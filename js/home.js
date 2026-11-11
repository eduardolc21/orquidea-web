// Solo en la home: video diferido y formulario corporativo (se carga bajo demanda).
import { CONFIG } from './config.js';
import { $, $$ } from './util.js';

// Video de YouTube: solo miniatura hasta que la persona hace clic
$$('[data-orq-video]').forEach((btn) => btn.addEventListener('click', () => {
  const f = document.createElement('iframe');
  f.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(btn.dataset.orqVideo)}?autoplay=1&rel=0`;
  f.title = btn.dataset.orqVideoTitle || 'Video';
  f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
  f.allowFullscreen = true;
  const wrap = Object.assign(document.createElement('div'), { className: 'orq-video' });
  wrap.append(f); btn.replaceWith(wrap); f.focus();
}));

// Ventas corporativas / exportación → WhatsApp o correo
const corp = $('[data-orq-corp]');
if (corp) corp.addEventListener('submit', (e) => {
  e.preventDefault();
  let firstBad = null;
  $$('[required]', corp).forEach((f) => {
    const err = $(`#${f.id}-error`);
    const bad = !f.value.trim() || (f.type === 'email' && !f.checkValidity());
    f.setAttribute('aria-invalid', String(bad));
    if (err) err.textContent = bad ? (f.type === 'email' && f.value ? 'Revisa el correo: falta la @ o el dominio.' : 'Completa este campo.') : '';
    if (bad && !firstBad) firstBad = f;
  });
  if (firstBad) { firstBad.focus(); return; }
  const v = Object.fromEntries(new FormData(corp));
  const text = `Hola, Chocolate Orquídea. Escribo desde la web por ${v.tipo}.\n\nNombre: ${v.nombre}\nEmpresa: ${v.empresa || '-'}\nCorreo: ${v.correo}\nCelular: ${v.celular || '-'}\n\n${v.mensaje}`;
  if (e.submitter?.value === 'email') location.href = `mailto:${CONFIG.EMAIL}?subject=${encodeURIComponent(`Consulta ${v.tipo} · ${v.empresa || v.nombre}`)}&body=${encodeURIComponent(text)}`;
  else window.open(`https://wa.me/${CONFIG.WHATSAPP}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
});
