// STUB · Adaptador WooCommerce Store API (/wp-json/wc/store/v1). Misma interfaz que adapter-local.js.
// Se activa con CART_ADAPTER = 'woo' en js/config.js. Ver MIGRACION-WOOCOMMERCE.md.
import { storage } from '../util.js';

export async function createAdapter(CONFIG) {
  const base = CONFIG.WOO_BASE_URL, ls = storage('localStorage'), TOKEN = 'orq-cart-token';
  let token = ls?.getItem(TOKEN) || null;
  // TODO al migrar: en el tema, wp_localize_script('orq-main', 'orqStore', ['nonce' => wp_create_nonce('wc_store_api')]);
  let nonce = window.orqStore?.nonce || null;

  async function call(path, { method = 'GET', body } = {}) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Cart-Token'] = token;          // sesión del carrito sin cookies (headless)
    if (nonce) headers.Nonce = nonce;                  // mismo dominio: nonce de wc_store_api
    const res = await fetch(base + path, { method, headers, credentials: 'include', body: body && JSON.stringify(body) });
    // TODO al migrar: si es headless, exponer el header con Access-Control-Expose-Headers: Cart-Token, Nonce
    const t = res.headers.get('Cart-Token');
    if (t && t !== token) { token = t; try { ls?.setItem(TOKEN, t); } catch { /* sin almacenamiento */ } }
    const n = res.headers.get('Nonce'); if (n) nonce = n;
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || `Error ${res.status} en la tienda`);
    return data;
  }
  const post = (path, body) => call(path, { method: 'POST', body });

  return {
    persistent: true,
    getCart: () => call('/cart'),
    addItem: (id, quantity = 1) => post('/cart/add-item', { id, quantity }),
    updateItem: (key, quantity) => (quantity < 1 ? post('/cart/remove-item', { key }) : post('/cart/update-item', { key, quantity })),
    removeItem: (key) => post('/cart/remove-item', { key }),
    applyCoupon: (code) => post('/cart/apply-coupon', { code }),
    selectShipping: (rate_id) => post('/cart/select-shipping-rate', { package_id: 0, rate_id }),
    // TODO al migrar: con la Opción A del plan se usa la página de checkout nativa de WooCommerce (bloque Checkout)
    // y este método no se llama. Solo para headless:
    async checkout(c) {
      const [first_name, ...rest] = c.name.trim().split(/\s+/);
      const addr = { first_name, last_name: rest.join(' '), address_1: c.address, city: c.district, state: c.zone, country: 'PE', phone: c.phone, email: c.email };
      const res = await post('/checkout', {
        billing_address: addr, shipping_address: addr, customer_note: c.notes,
        payment_method: 'bacs', // TODO al migrar: id de la pasarela (izipay, woo-mercado-pago-…, culqi)
        extensions: { orquidea: { documento: c.docType, numero: c.docNumber, razon_social: c.company || '', promociones: !!c.promos } },
      });
      return { id: res.order_number || res.order_id, ...res };
    },
  };
}
