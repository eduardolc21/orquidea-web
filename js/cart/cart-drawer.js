// UI del carrito: cajón (dialog nativo = trampa de foco + Esc), placa del header, barra acoplada y avisos.
import { cart } from './cart-store.js';
import { $, $$, esc, money, icon, announce, toast } from '../util.js';

const T = (c) => [c.totals.currency_minor_unit, c.totals.currency_prefix];
const m = (v, c) => money(v, ...T(c));
let drawer, opener, persistent = true;

function lineHTML(i, c) {
  const img = i.images?.[0] || {}, lim = i.quantity_limits || {}, name = esc(i.name);
  return `<li class="orq-line">
  <a class="orq-line__thumb orq-card--${esc(i.extensions?.orquidea?.linea || 'cacao')}" href="${esc(i.permalink || '#')}" tabindex="-1" aria-hidden="true"><img src="${esc(img.thumbnail || img.src)}" alt="" width="64" height="80" loading="lazy"></a>
  <div>
    <p class="orq-line__name"><a href="${esc(i.permalink || '#')}">${name}</a></p>
    <p class="orq-line__unit">${m(i.prices.price, c)} c/u${i._placeholder?.precio ? ' · referencial' : ''}</p>
    <div class="orq-line__controls">
      <div class="orq-qty" role="group" aria-label="Cantidad de ${name}">
        <button class="orq-qty__btn" type="button" data-orq-qty="-1" data-key="${esc(i.key)}" aria-label="Quitar uno">${icon('minus')}</button>
        <span class="orq-qty__value" aria-live="polite">${i.quantity}</span>
        <button class="orq-qty__btn" type="button" data-orq-qty="1" data-key="${esc(i.key)}" aria-label="Agregar uno"${i.quantity >= (lim.maximum || 99) ? ' disabled' : ''}>${icon('plus')}</button>
      </div>
      <span class="orq-line__total">${m(i.totals.line_total, c)}</span>
      <button class="orq-line__remove" type="button" data-orq-remove="${esc(i.key)}" aria-label="Eliminar ${name} del carrito">${icon('trash')}</button>
    </div>
  </div>
</li>`;
}

function progressHTML(c) {
  const x = c.extensions?.orquidea; if (!x || !Number(x.free_shipping_threshold)) return '';
  const goal = Number(x.free_shipping_threshold), sub = Number(c.totals.total_items), pct = Math.min(100, (sub / goal) * 100);
  const where = (x.zones || []).filter((z) => x.free_shipping_zones.includes(z.id)).map((z) => z.name.split(' (')[0]).join(' y ');
  const msg = sub >= goal ? `Tu envío es gratis en ${where}.` : `Te faltan <b>${m(goal - sub, c)}</b> para envío gratis en ${where}.`;
  return `<div class="orq-progress${sub >= goal ? ' orq-progress--done' : ''}"><p>${msg}</p><div class="orq-progress__track" aria-hidden="true"><div class="orq-progress__fill" style="--progress:${pct.toFixed(1)}%"></div></div></div>`;
}

function render(c) {
  const n = c.items_count || 0;
  $$('[data-orq-cart-count]').forEach((el) => { el.textContent = n; });
  $$('[data-orq-cart-plate]').forEach((el) => {
    el.classList.toggle('orq-plate--has-items', n > 0);
    el.setAttribute('aria-label', n ? `Carrito: ${n} ${n === 1 ? 'producto' : 'productos'}` : 'Carrito vacío');
  });
  const dock = $('[data-orq-dock]');
  if (dock) {
    const show = n > 0 && !document.body.hasAttribute('data-orq-no-dock');
    dock.classList.toggle('is-visible', show); dock.inert = !show; document.body.classList.toggle('has-dock', show);
    $('[data-orq-dock-count]', dock).textContent = `${n} ${n === 1 ? 'producto' : 'productos'} · ver carrito`;
    $('[data-orq-dock-total]', dock).textContent = m(c.totals.total_items, c);
  }
  if (!drawer) return;
  const body = $('[data-orq-drawer-body]', drawer), foot = $('[data-orq-drawer-foot]', drawer);
  if (!n) {
    body.innerHTML = `<div class="orq-drawer__empty">
      <p class="orq-letter orq-drawer__empty-title">Tu carrito está vacío</p>
      <p>¿No sabes por dónde empezar? La Dark 72% es la más intensa; la Mild Dark, la más suave de las orgánicas.</p>
      <a class="orq-btn orq-btn--primary" href="index.html#tienda" data-orq-cart-close>Ver la tienda</a></div>`;
    foot.hidden = true;
  } else {
    body.innerHTML = `<ul class="orq-lines" role="list" style="list-style:none;padding:0">${c.items.map((i) => lineHTML(i, c)).join('')}</ul>`;
    foot.hidden = false;
    foot.innerHTML = `${progressHTML(c)}
      <p class="orq-drawer__row"><span>Subtotal (IGV incluido)</span><span class="orq-drawer__total orq-num">${m(c.totals.total_items, c)}</span></p>
      <p class="orq-drawer__note">${icon('cold')}<span>El chocolate se envía en empaque térmico. El costo de envío se calcula en el siguiente paso.</span></p>
      ${c.extensions?.orquidea?.placeholder_prices ? '<p class="orq-drawer__note">Precios referenciales: te confirmamos el total por WhatsApp antes de pagar.</p>' : ''}
      ${persistent ? '' : '<p class="orq-drawer__note">Tu navegador no permite guardar datos: si recargas la página, el carrito se vacía.</p>'}
      <a class="orq-btn orq-btn--primary orq-btn--block" href="checkout.html">Finalizar compra ${icon('arrow')}</a>`;
  }
}

export function openCart(from) {
  if (!drawer || drawer.open) return;
  opener = from || document.activeElement;
  drawer.showModal();
  $('[data-orq-cart-close]', drawer)?.focus();
}
export function closeCart() { if (drawer?.open) drawer.close(); }

async function onAdd(btn) {
  const qtyInput = btn.closest('[data-orq-buy]')?.querySelector('[data-orq-qty-input]');
  const qty = Math.max(1, Number(qtyInput?.value) || 1);
  btn.disabled = true; btn.setAttribute('aria-busy', 'true');
  try {
    const c = await cart.add(btn.dataset.orqAddToCart, qty);
    const item = c.items.find((i) => String(i.id) === btn.dataset.orqAddToCart);
    const label = btn.textContent;
    btn.classList.add('orq-btn--added'); btn.textContent = 'Agregado';
    setTimeout(() => { btn.classList.remove('orq-btn--added'); btn.textContent = label; }, 1600);
    $$('[data-orq-cart-plate]').forEach((p) => { p.classList.remove('is-bump'); void p.offsetWidth; p.classList.add('is-bump'); });
    announce(`${item?.name || 'Producto'} agregado al carrito. Tienes ${c.items_count} ${c.items_count === 1 ? 'producto' : 'productos'}.`);
    if (!btn.closest('dialog')) openCart(btn);
  } catch { /* cart:error */ }
  finally { btn.disabled = false; btn.removeAttribute('aria-busy'); }
}

export function initCartUI() {
  drawer = $('[data-orq-drawer]');
  document.addEventListener('cart:updated', (e) => render(e.detail));
  document.addEventListener('cart:error', (e) => { toast(e.detail.message); announce(e.detail.message); });
  cart.persistent().then((p) => { persistent = p; if (cart.current) render(cart.current); }).catch(() => {});

  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-orq-add-to-cart],[data-orq-cart-open],[data-orq-cart-close],[data-orq-qty],[data-orq-remove]');
    if (!t) return;
    if (t.matches('[data-orq-add-to-cart]')) onAdd(t);
    else if (t.matches('[data-orq-cart-open]')) { e.preventDefault(); openCart(t); }
    else if (t.matches('[data-orq-cart-close]')) closeCart();
    else if (t.matches('[data-orq-remove]')) {
      const name = cart.current?.items.find((i) => i.key === t.dataset.orqRemove)?.name;
      cart.remove(t.dataset.orqRemove).then(() => { announce(`${name} eliminado del carrito.`); $('[data-orq-cart-close]', drawer)?.focus(); }).catch(() => {});
    } else {
      const it = cart.current?.items.find((i) => i.key === t.dataset.key);
      if (it) cart.update(it.key, it.quantity + Number(t.dataset.orqQty)).then((c) => {
        const now = c.items.find((i) => i.key === it.key);
        announce(now ? `${now.name}: ${now.quantity}` : `${it.name} eliminado del carrito.`);
        if (now) $(`[data-orq-qty="${t.dataset.orqQty}"][data-key="${CSS.escape(it.key)}"]`, drawer)?.focus();
        else $('[data-orq-cart-close]', drawer)?.focus();
      }).catch(() => {});
    }
  });
  if (!drawer) return;
  drawer.addEventListener('click', (e) => {
    if (e.target !== drawer) return;
    const r = drawer.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeCart();
  });
  drawer.addEventListener('close', () => { if (opener?.isConnected) opener.focus(); });
}
