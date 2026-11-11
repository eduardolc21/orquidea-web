// Checkout fase 1 (sin backend): datos del cliente → número de pedido → WhatsApp → gracias.html con datos de pago.
import { $, esc } from './util.js';
import { M, whatsappUrl } from './order.js';
import { cart } from './cart/cart-store.js';

/**
 * FASE 2 · Pago con pasarela (Izipay, Mercado Pago, Culqi o Niubiz).
 * Una web estática no puede cobrar con tarjeta de forma segura: la orden/token se crea en un servidor
 * con credenciales privadas. Al migrar a WooCommerce, el plugin de la pasarela hace este trabajo en el
 * checkout nativo. En un frontend headless, esta función debería:
 *   1. POST a tu servidor con order.id y order.totals.total_price (en céntimos, PEN).
 *   2. Recibir el token/URL de la pasarela y abrir su formulario o redirigir.
 *   3. Volver a gracias.html?pedido=<id>&pago=ok|error y confirmar el estado con el servidor (webhook).
 * @param {object} order Pedido con la forma que devuelve adapter.checkout()
 * @returns {Promise<{status: 'paid'|'pending'|'failed'}>}
 */
export async function payWithGateway(order) { // eslint-disable-line no-unused-vars
  throw new Error('Pago en línea disponible en la fase 2.');
}

const RULES = {
  name: (v) => v.trim().split(/\s+/).length >= 2 || 'Escribe tu nombre y apellido.',
  phone: (v) => /^9\d{8}$/.test(v.replace(/[\s-]/g, '').replace(/^(\+?51)/, '')) || 'Escribe un celular de 9 dígitos que empiece con 9.',
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Revisa el correo: falta la @ o el dominio (por ejemplo, nombre@gmail.com).',
  docNumber: (v, f) => (f.docType.value === 'factura'
    ? /^(10|15|17|20)\d{9}$/.test(v.trim()) || 'El RUC tiene 11 dígitos y empieza con 10 o 20.'
    : /^\d{8}$/.test(v.trim()) || 'El DNI tiene 8 dígitos.'),
  company: (v, f) => f.docType.value !== 'factura' || v.trim().length > 2 || 'Escribe la razón social para la factura.',
  address: (v) => v.trim().length > 5 || 'Escribe la dirección de entrega (calle, número, referencia).',
  district: (v) => v.trim().length > 1 || 'Escribe tu distrito y ciudad.',
  zone: (v) => !!v || 'Elige tu zona de envío.',
  rate: (v) => !!v || 'Elige una forma de envío.',
  terms: (v, f) => f.terms.checked || 'Debes aceptar los términos y condiciones.',
  privacy: (v, f) => f.privacy.checked || 'Debes aceptar la política de privacidad.',
};

function summary(c) {
  const box = $('[data-orq-summary]'); if (!box) return;
  if (!c.items.length) {
    box.innerHTML = `<h2 class="orq-letter orq-drawer__title">Tu carrito está vacío</h2><p style="margin-block:var(--orq-space-sm)">Agrega productos para hacer tu pedido.</p><a class="orq-btn orq-btn--primary" href="index.html#tienda">Ver la tienda</a>`;
    $('[data-orq-checkout-form]').hidden = true; return;
  }
  $('[data-orq-checkout-form]').hidden = false;
  const t = c.totals, ship = t.total_shipping == null ? 'Elige tu zona' : Number(t.total_shipping) ? M(t.total_shipping, c) : 'Gratis';
  box.innerHTML = `<h2 class="orq-letter orq-drawer__title">Tu pedido</h2>
  <ul role="list" style="list-style:none;padding:0">${c.items.map((i) => `<li class="orq-drawer__row" style="padding-block:var(--orq-space-xs);border-bottom:1px dashed var(--orq-cacao-soft);font-weight:400"><span>${i.quantity} × ${esc(i.name)}</span><span class="orq-num">${M(i.totals.line_total, c)}</span></li>`).join('')}</ul>
  <p class="orq-drawer__row" style="margin-top:var(--orq-space-sm)"><span>Subtotal</span><span class="orq-num">${M(t.total_items, c)}</span></p>
  <p class="orq-drawer__row"><span>Envío</span><span class="orq-num">${ship}</span></p>
  <p class="orq-drawer__row" style="margin-top:var(--orq-space-xs)"><span>Total (IGV incluido)</span><span class="orq-drawer__total orq-num">${M(t.total_price, c)}</span></p>
  ${c.extensions?.orquidea?.placeholder_prices ? '<p class="orq-drawer__note" style="margin-top:var(--orq-space-sm)">Precios referenciales: te confirmamos el total por WhatsApp antes de pagar.</p>' : ''}
  <p style="margin-top:var(--orq-space-sm)"><button class="orq-btn orq-btn--ghost" type="button" data-orq-cart-open>Editar carrito</button></p>`;
}

function rates(c, zone) {
  const list = $('[data-orq-rates]'); if (!list) return;
  const all = c.shipping_rates?.[0]?.shipping_rates || [];
  const zones = [...new Map(all.map((r) => [r.method_id, r.description])).entries()];
  const sel = $('#co-zone');
  if (sel.options.length <= 1) sel.insertAdjacentHTML('beforeend', zones.map(([id, n]) => `<option value="${esc(id)}">${esc(n)}</option>`).join(''));
  zone ||= sel.value || all.find((r) => r.selected)?.method_id || '';
  sel.value = zone;
  const mine = all.filter((r) => r.method_id === zone);
  list.innerHTML = mine.length ? mine.map((r) => `<label class="orq-rate"><input type="radio" name="rate" value="${esc(r.rate_id)}"${r.selected ? ' checked' : ''}>
    <span>${esc(r.name)}<span class="orq-rate__time">${esc(r.delivery_time || '')}</span></span><b class="orq-num">${Number(r.price) ? M(r.price, c) : 'Gratis'}</b></label>`).join('')
    : '<p class="orq-field__hint">Elige primero tu zona.</p>';
}

function validate(form) {
  const errs = [];
  Object.entries(RULES).forEach(([name, rule]) => {
    const f = form.elements[name], radio = name === 'rate';
    if (!f && !radio) return;
    if (f && !radio && f.closest('[hidden]')) return;
    const val = radio ? form.querySelector('input[name="rate"]:checked')?.value || '' : f.value;
    const ok = rule(val, form.elements), err = $(`#co-${name}-error`), msg = ok === true ? '' : ok;
    if (err) err.textContent = msg;
    if (!radio) f.setAttribute('aria-invalid', String(!!msg));
    if (msg) errs.push([name, msg]);
  });
  return errs;
}

function initCheckout(form) {
  const box = $('[data-orq-errors]');
  document.addEventListener('cart:updated', (e) => { summary(e.detail); rates(e.detail); });
  const toggleDoc = () => {
    const fac = form.docType.value === 'factura';
    $('[data-orq-company]').hidden = !fac;
    $('label[for="co-docNumber"]').textContent = fac ? 'RUC' : 'DNI';
    form.docNumber.maxLength = fac ? 11 : 8;
  };
  form.addEventListener('change', (e) => {
    if (e.target.name === 'docType') toggleDoc();
    if (e.target.name === 'zone') { rates(cart.current, e.target.value); }
    if (e.target.name === 'rate') cart.selectShipping(e.target.value).catch(() => {});
  });
  form.addEventListener('focusout', (e) => { const n = e.target.name; if (RULES[n] && e.target.value) validate(form); });
  toggleDoc();
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (errs.length) {
      box.hidden = false;
      box.innerHTML = `<p><b>Revisa ${errs.length === 1 ? 'este dato' : `estos ${errs.length} datos`}:</b></p><ul>${errs.map(([n, m]) => `<li><a href="#co-${n}">${esc(m)}</a></li>`).join('')}</ul>`;
      box.focus(); return;
    }
    box.hidden = true;
    const btn = form.querySelector('[type="submit"]'); btn.disabled = true; btn.textContent = 'Generando pedido…';
    const win = window.open('', '_blank');   // se abre ya para que el navegador no lo bloquee
    const v = Object.fromEntries(new FormData(form));
    try {
      const order = await cart.checkout({ name: v.name.trim(), phone: v.phone.trim(), email: v.email.trim(), docType: v.docType, docNumber: v.docNumber.trim(),
        company: v.company?.trim() || '', address: v.address.trim(), district: v.district.trim(), zone: v.zone, notes: v.notes.trim(), promos: !!v.promos });
      const url = whatsappUrl(order);
      if (win) win.location.href = url;
      location.href = `gracias.html?pedido=${encodeURIComponent(order.id)}${win ? '' : '&wa=1'}`;
    } catch (err) {
      win?.close();
      box.hidden = false; box.innerHTML = `<p>${esc(err.message)}</p>`; box.focus();
      btn.disabled = false; btn.textContent = 'Confirmar y enviar por WhatsApp';
    }
  });
}

const form = $('[data-orq-checkout-form]');
if (form) initCheckout(form);
