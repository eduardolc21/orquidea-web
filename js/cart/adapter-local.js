// Adaptador actual: carrito en localStorage (o en memoria si el navegador lo bloquea).
// Devuelve objetos con la forma de GET /wp-json/wc/store/v1/cart para que la UI no cambie al migrar.
import { storage } from '../util.js';

const json = (r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); };

function orderId() {
  const d = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Lima' }).format(new Date()).replaceAll('-', '');
  const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', r = crypto.getRandomValues(new Uint8Array(4));
  return `ORQ-${d}-${[...r].map((n) => abc[n % abc.length]).join('')}`;
}

export async function createAdapter(CONFIG) {
  const ls = storage('localStorage'), mem = {};
  const read = () => {
    try { return JSON.parse((ls ? ls.getItem(CONFIG.STORAGE_KEY) : mem.cart) || 'null') || { items: [], rate: null }; }
    catch { return { items: [], rate: null }; }
  };
  const write = (s) => { const v = JSON.stringify(s); try { if (ls) { ls.setItem(CONFIG.STORAGE_KEY, v); return; } } catch { /* cuota llena */ } mem.cart = v; };

  const [products, ship] = await Promise.all([fetch(CONFIG.PRODUCTS_URL).then(json), fetch(CONFIG.SHIPPING_URL).then(json)]);
  const byId = new Map(products.map((p) => [p.id, p]));
  const rates = ship.zones.flatMap((z) => z.rates.map((r) => ({ ...r, zone: z.id, zone_name: z.name })));
  const max = (p) => p.add_to_cart?.maximum || 99;
  const freeFor = (zone, sub) => ship.free_shipping_threshold > 0 && sub >= ship.free_shipping_threshold && ship.free_shipping_zones.includes(zone);

  function build(s) {
    const items = s.items.filter((i) => byId.has(i.id)).map((i) => {
      const p = byId.get(i.id), q = Math.max(1, Math.min(i.quantity, max(p))), line = String(Number(p.prices.price) * q);
      return {
        key: i.key, id: p.id, quantity: q, name: p.name, permalink: p.permalink, sku: p.sku,
        quantity_limits: { minimum: 1, maximum: max(p), multiple_of: 1, editable: true },
        prices: p.prices, images: p.images, extensions: p.extensions, _placeholder: p._placeholder,
        totals: { line_subtotal: line, line_subtotal_tax: '0', line_total: line, line_total_tax: '0', currency_code: 'PEN', currency_minor_unit: 2, currency_prefix: 'S/ ' },
      };
    });
    const sub = items.reduce((a, i) => a + Number(i.totals.line_total), 0);
    const price = (r) => (freeFor(r.zone, sub) ? 0 : Number(r.price));
    const sel = rates.find((r) => r.rate_id === s.rate);
    const shipping = sel ? price(sel) : null;
    return {
      items, items_count: items.reduce((a, i) => a + i.quantity, 0), coupons: [], errors: [], needs_shipping: true,
      shipping_rates: [{ package_id: 0, name: 'Envío', shipping_rates: rates.map((r) => ({
        rate_id: r.rate_id, name: r.name, description: r.zone_name, delivery_time: r.delivery_time, method_id: r.zone,
        price: String(price(r)), selected: r.rate_id === s.rate })) }],
      totals: {
        currency_code: 'PEN', currency_minor_unit: 2, currency_prefix: 'S/ ', currency_suffix: '',
        total_items: String(sub), total_items_tax: '0', total_discount: '0', total_tax: '0',   // precios con IGV incluido
        total_shipping: shipping == null ? null : String(shipping), total_shipping_tax: '0',
        total_price: String(sub + (shipping || 0)),
      },
      extensions: { orquidea: {
        free_shipping_threshold: String(ship.free_shipping_threshold), free_shipping_zones: ship.free_shipping_zones,
        zones: ship.zones.map((z) => ({ id: z.id, name: z.name })), placeholder_prices: items.some((i) => i._placeholder?.precio),
      } },
    };
  }
  const save = (s) => { write(s); return build(s); };
  const find = (s, key) => { const it = s.items.find((i) => i.key === key); if (!it) throw new Error('Ese producto ya no está en tu carrito.'); return it; };

  return {
    persistent: !!ls,
    async getCart() { return build(read()); },
    async addItem(id, qty = 1) {
      const s = read(), p = byId.get(id);
      if (!p) throw new Error('No encontramos ese producto.');
      if (!p.is_in_stock) throw new Error(`«${p.name}» está agotado por ahora.`);
      const it = s.items.find((i) => i.id === id);
      if (it && it.quantity >= max(p)) throw new Error(`Puedes llevar hasta ${max(p)} unidades de «${p.name}» por pedido.`);
      if (it) it.quantity = Math.min(max(p), it.quantity + qty); else s.items.push({ key: `k${id}`, id, quantity: Math.min(max(p), qty) });
      return save(s);
    },
    async updateItem(key, qty) {
      const s = read();
      if (qty < 1) s.items = s.items.filter((i) => i.key !== key);
      else { const it = find(s, key); it.quantity = Math.min(qty, max(byId.get(it.id))); }
      return save(s);
    },
    async removeItem(key) { const s = read(); s.items = s.items.filter((i) => i.key !== key); return save(s); },
    async applyCoupon() { throw new Error('Los cupones estarán disponibles en la tienda con pago en línea.'); },
    async selectShipping(rateId) {
      if (!rates.some((r) => r.rate_id === rateId)) throw new Error('Esa forma de envío no está disponible.');
      const s = read(); s.rate = rateId; return save(s);
    },
    async checkout(customer) {
      const s = read(), c = build(s);
      if (!c.items.length) throw new Error('Tu carrito está vacío.');
      if (c.totals.total_shipping == null) throw new Error('Elige una forma de envío.');
      const rate = c.shipping_rates[0].shipping_rates.find((r) => r.selected);
      const order = { id: orderId(), date: new Date().toISOString(), status: 'pendiente-whatsapp', customer, items: c.items, totals: c.totals, shipping: rate, placeholder_prices: c.extensions.orquidea.placeholder_prices };
      const ss = storage('sessionStorage');
      try { (ss || ls)?.setItem(CONFIG.ORDER_KEY, JSON.stringify(order)); } catch { /* sin almacenamiento: gracias.html usa la URL */ }
      write({ items: [], rate: null });
      return order;
    },
  };
}
