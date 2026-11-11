// Estado del carrito + eventos. NO sabe de dónde vienen los datos: delega en el adaptador.
// Eventos en document: 'cart:updated' (detail = carrito con forma de /wc/store/v1/cart) y 'cart:error' (detail = Error).
import { CONFIG } from '../config.js';

let adapterP, current = null;
const adapter = () => (adapterP ||= (CONFIG.CART_ADAPTER === 'woo' ? import('./adapter-woo.js') : import('./adapter-local.js'))
  .then((m) => m.createAdapter(CONFIG)));

const emit = (c) => { current = c; document.dispatchEvent(new CustomEvent('cart:updated', { detail: c })); return c; };

async function run(method, ...args) {
  try { return emit(await (await adapter())[method](...args)); }
  catch (err) { document.dispatchEvent(new CustomEvent('cart:error', { detail: err })); throw err; }
}

export const cart = {
  refresh: () => run('getCart'),
  add: (id, qty = 1) => run('addItem', Number(id), qty),
  update: (key, qty) => run('updateItem', key, qty),
  remove: (key) => run('removeItem', key),
  applyCoupon: (code) => run('applyCoupon', code),
  selectShipping: (rateId) => run('selectShipping', rateId),
  async checkout(customer) { const order = await (await adapter()).checkout(customer); await run('getCart'); return order; },
  async persistent() { return (await adapter()).persistent !== false; },
  get current() { return current; },
};
