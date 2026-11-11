// gracias.html: número de pedido, reenvío por WhatsApp y datos de pago (config.js).
import { CONFIG } from './config.js';
import { $, esc, storage } from './util.js';
import { M, whatsappUrl } from './order.js';

const root = $('[data-orq-thanks]');
if (root) {
  const id = new URLSearchParams(location.search).get('pedido');
  let order = null;
  for (const s of [storage('sessionStorage'), storage('localStorage')]) {
    try { const o = JSON.parse(s?.getItem(CONFIG.ORDER_KEY) || 'null'); if (o && o.id === id) { order = o; break; } } catch { /* nada */ }
  }
  const P = CONFIG.PAYMENT, total = order ? M(order.totals.total_price, order) : '';
  $('[data-orq-order-id]').textContent = id || 'sin número';
  $('[data-orq-order-total]').textContent = total ? `Total: ${total}${order.placeholder_prices ? ' (referencial, te lo confirmamos por WhatsApp)' : ''}` : '';
  const wa = $('[data-orq-wa]');
  if (order) wa.href = whatsappUrl(order); else wa.href = `https://wa.me/${CONFIG.WHATSAPP}?text=${encodeURIComponent(`Hola, hice el pedido ${id || ''} en la web.`)}`;
  $('[data-orq-pay]').innerHTML = `
    <div class="orq-pay__option"><h3 class="orq-letter">Yape</h3><p>Número: <b class="orq-num">${esc(P.yape.numero)}</b><br>A nombre de: ${esc(P.yape.titular)}</p></div>
    <div class="orq-pay__option"><h3 class="orq-letter">Plin</h3><p>Número: <b class="orq-num">${esc(P.plin.numero)}</b><br>A nombre de: ${esc(P.plin.titular)}</p></div>
    <div class="orq-pay__option"><h3 class="orq-letter">Transferencia</h3><p>${esc(P.banco.nombre)}<br>Cuenta: <b class="orq-num">${esc(P.banco.cuenta)}</b><br>CCI: <b class="orq-num">${esc(P.banco.cci)}</b><br>Titular: ${esc(P.banco.titular)} · RUC ${esc(P.banco.ruc)}</p></div>`;
  if (new URLSearchParams(location.search).get('wa')) $('[data-orq-wa-blocked]').hidden = false;
}
