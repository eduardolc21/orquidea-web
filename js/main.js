// Arranque común: carrito, menú y, solo si la página los tiene, catálogo y extras de la home.
import { $ } from './util.js';
import { cart } from './cart/cart-store.js';
import { initCartUI } from './cart/cart-drawer.js';
import './nav.js';

initCartUI();
cart.refresh().catch(() => {});
const shop = $('[data-orq-shop]'), featured = $('[data-orq-featured]');
if (shop || featured) import('./catalog.js').then((c) => { c.renderFeatured(featured); c.renderShop(shop); });
if ($('[data-orq-corp]') || $('[data-orq-video]')) import('./home.js');
