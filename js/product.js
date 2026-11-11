// Ficha (producto.html?slug=)
import { $, esc, strip, icon } from './util.js';
import { getProducts, cardHTML, priceHTML, addButton, imgHTML, attr, linea, meta } from './catalog.js';

const root = $('[data-orq-product-page]');
const slug = new URLSearchParams(location.search).get('slug');

function notFound() {
  root.innerHTML = `<h1 class="orq-letter orq-title">No encontramos ese producto</h1><p>Puede que el enlace esté incompleto o que ya no lo vendamos.</p><p><a class="orq-btn orq-btn--primary" href="index.html#tienda">Ver la tienda</a></p>`;
}

function setMeta(p) {
  const d = strip(p.short_description).slice(0, 155);
  document.title = `${p.name} · Chocolate Orquídea`;
  $('meta[name="description"]').content = d;
  $('link[rel="canonical"]').href = `https://orquideaperu.com/producto.html?slug=${encodeURIComponent(p.slug)}`;
  const ld = {
    '@context': 'https://schema.org', '@type': 'Product', name: p.name, sku: p.sku,
    description: d, image: new URL(p.images[0].src, location.href).href,
    brand: { '@type': 'Brand', name: 'Orquídea' }, category: p.categories?.[0]?.name,
    offers: { '@type': 'Offer', priceCurrency: 'PEN', price: (Number(p.prices.price) / 100).toFixed(2),
      availability: `https://schema.org/${p.is_in_stock ? 'InStock' : 'OutOfStock'}`, url: location.href,
},
  };
  $('#orq-product-ld').textContent = JSON.stringify(ld);
}

async function init() {
  let products;
  try { products = await getProducts(); } catch {
    root.innerHTML = '<p class="orq-notice orq-notice--error" role="alert">No pudimos cargar el producto. Revisa tu conexión y recarga la página.</p>'; return;
  }
  const p = products.find((x) => x.slug === slug);
  if (!p) { notFound(); return; }
  setMeta(p);
  const x = p.extensions?.orquidea || {}, cat = p.categories?.[0] || {};
  const alerg = x.alergenos?.length ? `Contiene ${x.alergenos.join(', ')}.` : 'Sin alérgenos declarados en esta ficha.';
  const rows = [['Cacao', attr(p, '% cacao')], ['Peso', attr(p, 'Peso')], ['Línea', cat.name],
    ['Ingredientes', `${esc(x.ingredientes || '')}${p._placeholder?.ingredientes ? ' <em>(por confirmar con el empaque)</em>' : ''}`],
    ['Alérgenos', `${alerg} La información completa de alérgenos está en el empaque.`],
    ['Sellos', 'Las certificaciones vigentes se publicarán pronto.']].filter(([, v]) => v);
  const related = products.filter((r) => r.id !== p.id && r.categories?.[0]?.slug === cat.slug).slice(0, 4);
  root.innerHTML = `
  <nav class="orq-crumbs" aria-label="Ruta"><a href="index.html#tienda">Tienda</a> / <a href="index.html#tienda-${esc(cat.slug)}">${esc(cat.name)}</a></nav>
  <div class="orq-product">
    <div class="orq-gallery"><div class="orq-gallery__main orq-card--${esc(linea(p))}">${imgHTML(p, 'orq-gallery__img', '(min-width: 56em) 40vw, 90vw', true)}</div></div>
    <div>
      <h1 class="orq-letter orq-title">${esc(p.name)}</h1>
      ${meta(p) ? `<p class="orq-lead">${esc(meta(p))}</p>` : ''}
      <div class="orq-prose" style="margin-top:var(--orq-space-md)">${p.description}</div>
      <dl class="orq-specs">${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>
      ${priceHTML(p, 'orq-product__price')}
      ${p._placeholder?.precio ? '<p class="orq-field__hint">Precio referencial con IGV, se confirma por WhatsApp.</p>' : '<p class="orq-field__hint">Precio con IGV incluido.</p>'}
      <div class="orq-product__buy" data-orq-buy>
        <div class="orq-qty" role="group" aria-label="Cantidad">
          <button class="orq-qty__btn" type="button" data-orq-step="-1" aria-label="Quitar uno">${icon('minus')}</button>
          <input class="orq-qty__value" type="number" inputmode="numeric" min="1" max="${p.add_to_cart?.maximum || 99}" value="1" data-orq-qty-input aria-label="Cantidad">
          <button class="orq-qty__btn" type="button" data-orq-step="1" aria-label="Agregar uno">${icon('plus')}</button>
        </div>
        ${addButton(p, 'orq-btn--primary')}
      </div>
      <p class="orq-drawer__note" style="color:inherit;margin-top:var(--orq-space-md)">${icon('cold')}<span>Enviamos a todo el Perú en empaque térmico. El costo de envío según tu zona se calcula en el checkout.</span></p>
    </div>
  </div>
  ${related.length ? `<section class="orq-related" aria-labelledby="orq-related-title"><h2 class="orq-letter orq-title" id="orq-related-title">También de esta línea</h2>
  <div class="orq-shop__grid">${related.map((r) => cardHTML(r)).join('')}</div></section>` : ''}`;

  const input = $('[data-orq-qty-input]', root);
  root.addEventListener('click', (e) => {
    const b = e.target.closest('[data-orq-step]'); if (!b) return;
    input.value = Math.min(Number(input.max), Math.max(1, (Number(input.value) || 1) + Number(b.dataset.orqStep)));
  });
  input.addEventListener('change', () => { input.value = Math.min(Number(input.max), Math.max(1, Math.round(Number(input.value)) || 1)); });
}
if (root) init();
