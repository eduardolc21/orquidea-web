export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const ENT = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ENT[c]);
export const strip = (h) => String(h ?? '').replace(/<[^>]+>/g, '').trim();

// Céntimos (string o número, como la Store API) → "S/ 12.90"
export function money(minor, unit = 2, prefix = 'S/ ') {
  const n = Number(minor || 0) / 10 ** unit;
  return prefix + n.toLocaleString('en-US', { minimumFractionDigits: unit, maximumFractionDigits: unit });
}
export const icon = (id, cls = '') =>
  `<svg class="orq-icon ${cls}" aria-hidden="true" focusable="false"><use href="assets/icons.svg#i-${id}"></use></svg>`;

export function announce(msg) {
  const r = $('[data-orq-live]');
  if (!r) return;
  r.textContent = '';
  setTimeout(() => { r.textContent = msg; }, 60);
}

let toastTimer;
export function toast(msg) {
  let t = $('.orq-toast');
  if (!t) { t = document.createElement('div'); t.className = 'orq-toast'; t.setAttribute('role', 'status'); document.body.append(t); }
  t.textContent = msg; t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.hidden = true; }, 4200);
}

export function storage(kind = 'localStorage') {
  try { const s = window[kind]; s.setItem('__orq', '1'); s.removeItem('__orq'); return s; } catch { return null; }
}
