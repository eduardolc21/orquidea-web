# Migración a WordPress + WooCommerce

Ruta recomendada: **Opción A**, un tema clásico mínimo (o el plugin `orquidea-ui`) que carga **sin modificar** `css/tokens.css`, `css/base.css`, `css/components.css` y `css/sections.css`, más el JS de `js/`. WordPress aporta productos, carrito real, pedidos y pagos. El diseño vive en estos archivos, no en el tema.

## 1. HTML → plantillas PHP

Cada sección es un tablón (`.orq-board`) independiente. Las clases BEM `orq-*` y los atributos `data-orq-*` se copian tal cual a PHP.

| HTML actual | WordPress | Notas |
|---|---|---|
| `<header class="orq-header">` (todas las páginas) | `header.php` | `wp_head()` antes de `</head>`. Menú: `wp_nav_menu(['theme_location'=>'principal','container'=>false,'menu_class'=>'orq-nav__list','link_class'=>'orq-nav__link'])` (con un filtro `nav_menu_link_attributes` para la clase del enlace). La placa del carrito queda igual (`data-orq-cart-open`, `data-orq-cart-count`). |
| `<footer class="orq-footer">` | `footer.php` | `wp_footer()` antes de `</body>`. Año: `<?php echo date('Y'); ?>`. |
| `<dialog class="orq-drawer">`, `.orq-dock` y `[data-orq-live]` | `template-parts/cart-drawer.php` | Se incluye en `footer.php`. Es la misma UI, alimentada por `adapter-woo.js`. |
| `index.html` | `front-page.php` | `get_template_part()` de cada sección, en este orden: |
| Hero `.orq-hero` | `template-parts/section-hero.php` | La pizarra destacada sale de un producto marcado como «Destacado» (`wc_get_products(['featured'=>true,'limit'=>1])`). |
| Tienda `#tienda` | `template-parts/section-shop.php` | Dos opciones: (a) dejar `[data-orq-shop]` y que `catalog.js` lea `/wp-json/wc/store/v1/products`; (b) render PHP con `wc_get_products()` imprimiendo el mismo marcado de `cardHTML()` (mejor SEO). |
| Pizarra de producto `.orq-card` | `template-parts/product-card.php` | Recibe `$product`. Línea de color: meta `_orq_linea` → clase `orq-card--{linea}`. Botón: `data-orq-add-to-cart="<?php echo $product->get_id(); ?>"`. |
| Historia `#historia` | `template-parts/section-story.php` | O un **block pattern** `orquidea/historia` para que el cliente edite el texto. |
| Comunidad `#comunidad` | `template-parts/section-community.php` | Pattern editable. |
| Certificaciones `#certificaciones` | `template-parts/section-certs.php` | Sellos desde un campo de opciones (ACF) cuando estén vigentes. |
| Dónde comprar `#donde-comprar` | `template-parts/section-where.php` | Pattern editable. |
| Corporativo `#corporativo` | `template-parts/section-corporate.php` | El formulario puede seguir enviando por WhatsApp o pasar a Contact Form 7 / WPForms con las mismas clases `orq-field*`. |
| `producto.html` | `woocommerce/single-product.php` (o `content-single-product.php`) | Mismo marcado que renderiza `js/product.js` (`.orq-product`, `.orq-gallery`, `.orq-specs`). El JSON-LD lo genera WooCommerce/Yoast. |
| `checkout.html` | Página «Finalizar compra» con el **bloque Checkout** nativo | Ver la sección 3. |
| `gracias.html` | Página de pedido recibido de WooCommerce | Las instrucciones de Yape/Plin van en la pasarela «Transferencia bancaria» (BACS) o en un plugin de Yape. |
| `legal/*.html` | Páginas de WordPress | La de privacidad, como «Página de política de privacidad» en Ajustes. |

Encolar los recursos (`functions.php`):

```php
add_action('wp_enqueue_scripts', function () {
  $u = get_template_directory_uri(); $v = '1.0.0';
  foreach (['tokens','base','components','sections'] as $css) wp_enqueue_style("orq-$css", "$u/css/$css.css", [], $v);
  wp_enqueue_script('orq-main', "$u/js/main.js", [], $v, ['strategy' => 'defer', 'in_footer' => true]);
  wp_localize_script('orq-main', 'orqStore', ['nonce' => wp_create_nonce('wc_store_api')]);
});
add_filter('script_loader_tag', fn($tag, $h) => str_starts_with($h, 'orq-') ? str_replace(' src', ' type="module" src', $tag) : $tag, 10, 2);
```

Las rutas relativas de los JS (`data/products.json`, `assets/icons.svg`) se cambian por `CONFIG` y una base (`window.orqStore.base`) al migrar.

## 2. `products.json` → WooCommerce

Usa `data/products-woocommerce.csv` con el importador nativo (**Productos → Importar**). Columnas:

| Columna CSV | Origen en `products.json` |
|---|---|
| `SKU` | `sku` |
| `Name` | `name` |
| `Type` | `simple` |
| `Regular price` | `prices.regular_price / 100` (con IGV; activa «Precios con impuestos incluidos» en Ajustes → Impuestos) |
| `Categories` | `categories[0].name` |
| `Short description` / `Description` | `short_description` / `description` |
| `Images` | URL absoluta de `images[0].src`: sube antes `assets/img/productos/*-480.webp` o cambia el dominio `https://TU-DOMINIO.pe/` en el CSV |
| `In stock?` | `is_in_stock` |
| `Is featured?` | `1` en el producto del hero |
| `Attribute 1/2/3 name` y `value(s)` | `% cacao`, `Peso`, `Certificación` |
| `Meta: _orq_linea`, `_orq_ingredientes`, `_orq_alergenos` | `extensions.orquidea.*` |

Para que la Store API devuelva `extensions.orquidea` (y `catalog.js` siga pintando el color de la línea), registra el dato con `woocommerce_store_api_register_endpoint_data` sobre `ProductSchema`, leyendo esas metas. `_placeholder` no se migra: en WooCommerce todos los precios son reales.

Las categorías deben conservar los slugs `tabletas-organicas`, `tabletas-clasicas`, `chocotejas-y-mas`, `coberturas` y `navidad`.

## 3. `tokens.css` + `components.css` → Carrito y Checkout nativos

Encola `tokens.css` también en las páginas de Carrito y Finalizar compra y añade este puente (por ejemplo en `css/woocommerce.css`). **Solo usa variables `--orq-*`**, así que el diseño sigue saliendo de `tokens.css`:

```css
/* Contenedores = tablón claro */
.wc-block-cart, .wc-block-checkout {
  background: var(--orq-cream); color: var(--orq-cacao);
  border: var(--orq-filete) solid var(--orq-cacao);
  padding: var(--orq-board-pad); font-family: var(--orq-font-body);
}
.wc-block-cart h2, .wc-block-checkout h2,
.wc-block-components-title, .wc-block-components-checkout-step__title {
  font-family: var(--orq-font-display); font-weight: 400; color: var(--orq-cacao);
  text-shadow: var(--orq-letter-shade-light);
}
/* Campos = .orq-field__input */
.wc-block-components-text-input input, .wc-block-components-combobox .components-combobox-control__input,
.wc-block-components-textarea, .wc-blocks-components-select__select {
  background: var(--orq-linea-blanco); color: var(--orq-cacao);
  border: 2px solid var(--orq-cacao); border-radius: var(--orq-radius-sm);
}
.wc-block-components-text-input.has-error input { border-color: var(--orq-error); }
.wc-block-components-validation-error { color: var(--orq-error); font-weight: var(--orq-weight-bold); }
/* Botones = .orq-btn--primary */
.wc-block-components-button:not(.is-link), .wc-block-cart__submit-button, .wc-block-components-checkout-place-order-button {
  background: var(--orq-gold); color: var(--orq-cacao); border: 2px solid var(--orq-cacao);
  border-radius: var(--orq-radius-sm); font-weight: var(--orq-weight-black);
  letter-spacing: var(--orq-tracking-caps); text-transform: uppercase; min-height: 3.5rem;
}
.wc-block-components-button:not(.is-link):active { background: var(--orq-cacao); color: var(--orq-gold); }
/* Resumen del pedido = .orq-checkout__summary */
.wc-block-components-sidebar .wc-block-components-totals-wrapper,
.wp-block-woocommerce-checkout-order-summary-block {
  background: var(--orq-cacao); color: var(--orq-cream); border-color: var(--orq-gold);
}
.wc-block-components-totals-footer-item .wc-block-components-totals-item__value {
  font-family: var(--orq-font-display); color: var(--orq-gold); font-size: var(--orq-text-xl);
}
/* Cantidad = .orq-qty */
.wc-block-components-quantity-selector { border: 2px solid currentColor; border-radius: var(--orq-radius-sm); }
/* Radios y checkbox: rojo de estado */
.wc-block-components-radio-control__input:checked, .wc-block-components-checkbox__input:checked { background: var(--orq-state-fill); border-color: var(--orq-state-fill); }
.wc-block-components-radio-control__option--checked-option-highlighted { box-shadow: inset 0 0 0 2px var(--orq-cacao); }
/* Avisos */
.wc-block-components-notice-banner.is-error { border-color: var(--orq-error); color: var(--orq-error); }
/* Foco */
.wc-block-cart :focus-visible, .wc-block-checkout :focus-visible { outline: 3px solid var(--orq-focus); outline-offset: 3px; box-shadow: 0 0 0 7px var(--orq-focus-halo); }
```

Los nombres de clase de los bloques cambian entre versiones de WooCommerce: revísalos con el inspector en staging y ajusta solo los selectores, nunca los valores.

El cajón del carrito (`components.css` → `.orq-drawer`) sigue siendo el mini-carrito; el botón «Finalizar compra» apunta a `wc_get_checkout_url()`.

## 4. Cambiar `CART_ADAPTER` a `'woo'`

1. En `js/config.js`: `CART_ADAPTER: 'woo'` y, si WordPress está en otra ruta, `WOO_BASE_URL` (por ejemplo `'/wp/wp-json/wc/store/v1'`).
2. En el tema, `wp_localize_script` con `nonce => wp_create_nonce('wc_store_api')` (ver la sección 1). `adapter-woo.js` lo envía en el header `Nonce` y lo renueva con cada respuesta.
3. `catalog.js` lee automáticamente `${WOO_BASE_URL}/products?per_page=100` cuando el adaptador es `woo`.
4. Revisa los `// TODO al migrar` de `js/cart/adapter-woo.js`:
   - **Cart-Token**: ya se lee del header de cada respuesta y se guarda en `localStorage`. Si es headless (otro dominio), expón el header con CORS: `Access-Control-Expose-Headers: Cart-Token, Nonce`.
   - **Checkout**: con la Opción A no se usa `adapter.checkout()`: el botón «Finalizar compra» lleva al checkout nativo. Puedes borrar `checkout.html`, `gracias.html`, `js/checkout.js`, `js/order.js` y `js/gracias.js`.
   - `payment_method`: solo para headless, el id de la pasarela.
5. La barra de envío gratis del cajón usa `extensions.orquidea.free_shipping_threshold`. Para mantenerla, expón ese dato en el endpoint `/cart` con `woocommerce_store_api_register_endpoint_data` sobre `CartSchema`. Si no lo expones, la barra simplemente no aparece.
6. Prueba en staging: agregar, cambiar cantidad, eliminar, recargar (persistencia) y llegar al checkout nativo.

## 5. Después de migrar
- Pasarela peruana (Izipay, Mercado Pago o Culqi), SMTP y plugin de Libro de Reclamaciones.
- Redirecciones de `REDIRECTS.md` hacia las nuevas URL de categoría.
- `sitemap.xml` y `robots.txt` pasan a generarse con WordPress (o Yoast/Rank Math).
