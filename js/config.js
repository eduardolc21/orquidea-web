// Configuración del sitio. Todo lo marcado PENDIENTE lo debe confirmar el cliente.
export const CONFIG = {
  CART_ADAPTER: 'local',               // 'local' (localStorage) | 'woo' (WooCommerce Store API)
  WOO_BASE_URL: '/wp-json/wc/store/v1',
  PRODUCTS_URL: 'data/products.json',
  SHIPPING_URL: 'data/shipping.json',
  STORAGE_KEY: 'orq-cart-v1',
  ORDER_KEY: 'orq-last-order',

  // PENDIENTE: número que recibe los pedidos web (Tarapoto 945 313 345 · Lima 951 492 572). Formato: 51 + número, sin espacios.
  WHATSAPP: '51945313345',
  EMAIL: 'hola@orquideaperu.com',

  // Producto del hero: la temporada manda hasta la fecha indicada; después vuelve el producto estrella.
  FEATURED: {
    season: { slug: 'paneton-orquidea', until: '2027-01-15', tag: 'Navidad' },
    default: { slug: 'organica-dark-72', tag: 'La más intensa' },
  },

  // PENDIENTE: datos de pago (fase 1: Yape/Plin o transferencia). Son marcadores.
  PAYMENT: {
    yape: { numero: '9XX XXX XXX', titular: 'Industrias Mayo (confirmar)' },
    plin: { numero: '9XX XXX XXX', titular: 'Industrias Mayo (confirmar)' },
    banco: { nombre: 'Banco (confirmar)', cuenta: 'XXX-XXXXXXX-X-XX', cci: 'XXX-XXX-XXXXXXXXXXXX-XX', titular: 'Industrias Mayo', ruc: '20XXXXXXXXX (confirmar)' },
  },
};
