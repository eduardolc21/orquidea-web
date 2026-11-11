// Productos: JSON local hoy, Store API mañana.
import { CONFIG } from './config.js';
import { $, $$, esc, money } from './util.js';

let cache;
export function getProducts() {
  const url = CONFIG.CART_ADAPTER === 'woo' ? `${CONFIG.WOO_BASE_URL}/products?per_page=100` : CONFIG.PRODUCTS_URL;
  cache ||= fetch(url).then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); });
  cache.catch(() => { cache = null; });
  return cache;
}

export const attr = (p, name) => p.attributes?.find((a) => a.name === name)?.terms?.[0]?.name || '';
export const linea = (p) => p.extensions?.orquidea?.linea || 'cacao';
export const isTbc = (p) => !!p._placeholder?.precio;
export const meta = (p) => [attr(p, '% cacao') && `${attr(p, '% cacao')} cacao`, attr(p, 'Peso') || 'peso por confirmar'].filter(Boolean).join(' · ');
const HEIGHT = { navidad: 350, coberturas: 506, 'chocotejas-y-mas': 679 };

export function priceHTML(p, cls = '') {
  const pr = p.prices, tbc = isTbc(p);
  return `<p class="orq-price ${tbc ? 'orq-price--tbc' : ''} ${cls}"${tbc ? ' title="Precio referencial, por confirmar"' : ''}>${money(pr.price, pr.currency_minor_unit, pr.currency_prefix)}${tbc ? '<span class="orq-visually-hidden"> (precio referencial, por confirmar)</span>' : ''}</p>`;
}

export function addButton(p, extra = '') {
  return p.is_in_stock
    ? `<button class="orq-btn ${extra}" type="button" data-orq-add-to-cart="${p.id}" aria-label="Agregar ${esc(p.name)} al carrito">Agregar</button>`
    : `<button class="orq-btn ${extra}" type="button" disabled>Agotado</button>`;
}

export function imgHTML(p, cls, sizes, eager = false) {
  const img = p.images?.[0] || {}, cat = p.categories?.[0]?.slug;
  return `<img class="${cls}${cat === 'navidad' ? ` ${cls}--photo` : ''}" src="${esc(img.src)}" srcset="${esc(img.srcset || '')}" sizes="${esc(sizes || img.sizes || '45vw')}" alt="${esc(img.alt || p.name)}" width="480" height="${HEIGHT[cat] || 943}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
}

export function cardHTML(p, { feature = false, tag = '', heading = 'h3', eager = false } = {}) {
  return `<article class="orq-card orq-card--${linea(p)}${feature ? ' orq-feature' : p.categories?.[0]?.slug === 'navidad' ? ' orq-card--wide' : ''}${p.is_in_stock ? '' : ' orq-card--soldout'}" data-orq-product="${esc(p.slug)}">
  ${tag ? `<span class="orq-feature__tag">${esc(tag)}</span>` : ''}${p.is_in_stock ? '' : '<span class="orq-badge orq-card__badge">Agotado</span>'}
  <div class="orq-card__media">${imgHTML(p, 'orq-card__img', feature ? '(min-width: 56em) 30rem, 90vw' : '', eager)}</div>
  <div class="orq-card__body">
    <${heading} class="orq-card__title"><a href="${esc(p.permalink)}">${esc(p.name)}</a></${heading}>
    ${meta(p) ? `<p class="orq-card__meta">${esc(meta(p))}</p>` : ''}
    <div class="orq-card__buy">${priceHTML(p, 'orq-card__price')}${addButton(p)}</div>
  </div>
</article>`;
}

export async function renderFeatured(root) {
  if (!root) return;
  const { season, default: def } = CONFIG.FEATURED;
  const pick = new Date() < new Date(`${season.until}T00:00:00-05:00`) ? season : def;
  if (root.dataset.orqFeatured === pick.slug) return;   // el HTML estático ya trae el correcto
  const p = (await getProducts()).find((x) => x.slug === pick.slug);
  if (p) { root.outerHTML = cardHTML(p, { feature: true, tag: pick.tag, heading: 'h2', eager: true }); }
}

const fromHash = () => location.hash.replace(/^#(tienda-)?/, '');

export async function renderShop(root) {
  if (!root) return;
  const grid = $('[data-orq-shop-grid]', root), chips = $('[data-orq-shop-filters]', root), status = $('[data-orq-shop-status]', root);
  let products;
  try { products = await getProducts(); } catch {
    status.innerHTML = `<div class="orq-notice orq-notice--error" role="alert"><p>No pudimos cargar los productos. Revisa tu conexión.</p><button class="orq-btn" type="button" data-orq-retry>Reintentar</button></div>`;
    $('[data-orq-retry]', status).onclick = () => { status.textContent = ''; renderShop(root); };
    return;
  }
  // Navidad primero mientras dure la temporada
  const order = (p) => (p.categories?.[0]?.slug === 'navidad' ? 0 : 1);
  products = [...products].sort((a, b) => order(a) - order(b));
  const cats = [];
  products.forEach((p) => { const c = p.categories?.[0]; if (c && !cats.some((x) => x.slug === c.slug)) cats.push({ ...c, n: 0 }); cats.find((x) => x.slug === c?.slug).n++; });
  chips.innerHTML = [{ slug: '', name: 'Todo', n: products.length }, ...cats]
    .map((c) => `<li><button class="orq-chip" type="button" data-orq-filter="${esc(c.slug)}" aria-pressed="false">${esc(c.name)}<span class="orq-chip__count">${c.n}</span></button></li>`).join('');
  grid.innerHTML = products.map((p) => cardHTML(p)).join('');

  const apply = (slug, announceIt) => {
    if (!cats.some((c) => c.slug === slug)) slug = '';
    $$('[data-orq-filter]', chips).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.orqFilter === slug)));
    let shown = 0;
    $$('.orq-card', grid).forEach((el, i) => { const on = !slug || products[i].categories?.[0]?.slug === slug; el.hidden = !on; shown += on; });
    if (announceIt) status.innerHTML = `<p class="orq-visually-hidden" role="status">${shown} productos</p>`;
  };
  chips.addEventListener('click', (e) => { const b = e.target.closest('[data-orq-filter]'); if (b) apply(b.dataset.orqFilter, true); });
  apply(fromHash());
  addEventListener('hashchange', () => { const s = fromHash(); if (cats.some((c) => c.slug === s)) { apply(s); root.scrollIntoView(); } });
  if (cats.some((c) => c.slug === fromHash())) root.scrollIntoView();
}
