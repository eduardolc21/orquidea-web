// Pedido → mensaje de WhatsApp (compartido por checkout.js y gracias.js).
import { CONFIG } from './config.js';
import { money } from './util.js';

export const M = (v, c) => money(v, c?.totals?.currency_minor_unit ?? 2, c?.totals?.currency_prefix ?? 'S/ ');

export function whatsappText(o) {
  const c = o.customer, t = o.totals, doc = c.docType === 'factura' ? `Factura · RUC ${c.docNumber} · ${c.company}` : `Boleta · DNI ${c.docNumber}`;
  return [
    `*Nuevo pedido ${o.id}*`, '',
    '*Productos*', ...o.items.map((i) => `• ${i.quantity} × ${i.name} — ${M(i.totals.line_total, o)}`), '',
    `Subtotal: ${M(t.total_items, o)}`,
    `Envío (${o.shipping.description} · ${o.shipping.name}): ${Number(t.total_shipping) ? M(t.total_shipping, o) : 'gratis'}`,
    `*Total: ${M(t.total_price, o)}* (IGV incluido)`,
    o.placeholder_prices ? '_Precios referenciales: por favor confírmenme el total._' : '', '',
    '*Cliente*', c.name, `Celular: ${c.phone}`, `Correo: ${c.email}`, doc, '',
    '*Entrega*', c.address, `${c.district} · ${o.shipping.description}`, c.notes ? `Notas: ${c.notes}` : '', '',
    'Pagaré con Yape/Plin o transferencia. Quedo atento a la confirmación.',
  ].filter((l, i, a) => l !== '' || a[i - 1] !== '').join('\n');
}
export const whatsappUrl = (o) => `https://wa.me/${CONFIG.WHATSAPP}?text=${encodeURIComponent(whatsappText(o))}`;
