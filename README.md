# Chocolate Orquídea · web one page + tienda

Sitio estático (HTML, CSS y JavaScript vanilla con ES modules), sin build ni dependencias. Está preparado para migrar a WordPress + WooCommerce sin rediseñar (ver `MIGRACION-WOOCOMMERCE.md`).

## Cómo correrlo

Los módulos y el `fetch` de los JSON necesitan un servidor; abrir `index.html` con doble clic no basta.

```bash
npx serve .
# o bien
python3 -m http.server 8000
```

Luego abre http://localhost:3000 (o :8000).

## Páginas

| Archivo | Qué es |
|---|---|
| `index.html` | One page: hero, tienda, historia, comunidad, certificaciones, dónde comprar, ventas corporativas y pie |
| `producto.html?slug=…` | Ficha de producto (datos estructurados `schema.org/Product`) |
| `checkout.html` | Datos del cliente, comprobante, envío y confirmación por WhatsApp |
| `gracias.html` | Número de pedido e instrucciones de pago |
| `legal/` | Términos, privacidad, cambios y envíos, Libro de Reclamaciones (borradores) |

## Editar productos (`data/products.json`)

El archivo tiene **la misma forma que la Store API de WooCommerce** (`GET /wp-json/wc/store/v1/products`). Campos que se editan a mano:

- `name`, `slug` (la URL: `producto.html?slug=…`), `short_description` y `description` (HTML simple).
- `prices.price` y `prices.regular_price`: **en céntimos y como texto**. S/ 14.90 → `"1490"`. Con IGV incluido.
- `attributes`: `% cacao` y `Peso` (se muestran en la tarjeta y en la ficha).
- `categories[0]`: `id`, `name`, `slug`. Los filtros de la tienda salen de aquí.
- `is_in_stock`: `false` muestra la tarjeta como «Agotado» y desactiva el botón.
- `add_to_cart.maximum`: unidades máximas por pedido.
- `extensions.orquidea.linea`: color de la pizarra. Valores: `azul`, `amarillo`, `crema`, `rojo`, `cacao`, `blanco`, `verde`, `celeste`, `naranja`, `fucsia` (definidos en `css/tokens.css`).
- `extensions.orquidea.ingredientes` y `alergenos` (lista).
- `_placeholder.precio`: mientras sea `true`, el precio se dibuja **en letra de contorno** y el carrito avisa que es referencial. Ponlo en `false` cuando el precio esté confirmado. `_placeholder.ingredientes` funciona igual en la ficha.

**Imágenes.** Cada producto usa `assets/img/productos/<slug>-240.webp` y `-480.webp`. Para cambiar una foto, reemplaza los dos archivos con el mismo nombre (WebP, 240 y 480 px de ancho, fondo transparente para las tabletas).

**Producto del hero.** Se configura en `js/config.js` → `FEATURED`: el de temporada (Panetón) se muestra hasta la fecha `until`; después se muestra el producto `default`. Si cambias el de temporada, actualiza también la tarjeta estática del hero en `index.html`, que existe para que cargue rápido.

## Editar envíos (`data/shipping.json`)

- `zones[]`: cada zona con sus `rates[]` (`rate_id` único, `name`, `price` en céntimos y `delivery_time`).
- `free_shipping_threshold`: monto en céntimos desde el que el envío es gratis (`15000` = S/ 150.00). Con `0` se desactiva.
- `free_shipping_zones`: zonas donde aplica el envío gratis.

## Número de WhatsApp y datos de pago

Todo está en **`js/config.js`**:

- `WHATSAPP`: número que recibe los pedidos, con código de país y sin espacios (`51945313345`).
- `PAYMENT`: Yape, Plin y transferencia (banco, cuenta, CCI, titular, RUC). Se muestran en `gracias.html`.
- `CART_ADAPTER`: `'local'` hoy; `'woo'` al migrar.

Los enlaces de WhatsApp del pie (Tarapoto y Lima) están en el HTML de cada página.

## Cómo funciona el pedido (fase 1)

1. El carrito se guarda en `localStorage`. Si el navegador lo bloquea, funciona en memoria y lo avisa.
2. En el checkout se validan los datos (celular de 9 dígitos, DNI de 8 o RUC de 11, etc.).
3. Al confirmar se genera el número `ORQ-AAAAMMDD-XXXX` y se abre WhatsApp con el pedido completo. Si el navegador bloquea la ventana, `gracias.html` ofrece el botón para enviarlo.
4. `gracias.html` muestra los datos de pago. El cobro con tarjeta queda para la fase 2: `payWithGateway()` está documentada en `js/checkout.js`.

## Estructura

```
css/tokens.css       únicas variables de color, tipografía, espaciado, radios y sombras
css/base.css         reset y tipografía base
css/components.css   tablón, letra de rótulo, botones, placa del carrito, pizarras, cajón, formularios, pie
css/sections.css     hero, tienda, historia, comunidad, certificaciones, dónde comprar, corporativo y páginas internas
js/main.js           arranque común (carrito y menú); carga catalog.js y home.js solo si hacen falta
js/catalog.js        tarjetas, filtros y producto del hero desde la fuente de datos
js/cart/             cart-store (estado + evento cart:updated), adapter-local, adapter-woo (stub) y cart-drawer (UI)
js/checkout.js       formulario de checkout y payWithGateway() para la fase 2
js/order.js          mensaje de WhatsApp del pedido
js/gracias.js        página de gracias
js/product.js        ficha de producto
assets/fonts/        Alfa Slab One y Schibsted Grotesk (woff2, licencia OFL)
assets/img/          imágenes optimizadas (WebP) y favicons
assets/icons.svg     sprite de íconos
assets/brand/        material original recopilado (no se publica todo; ver 00_LEEME.md)
```

Peso: ~27 KB de JS propio en la home y menos de 30 KB en cada página; primera carga de la home ≈ 310 KB. Lighthouse móvil (local, 11/11/2026): home 94–98 · ficha 93–94 · checkout 97 en rendimiento; 100 en accesibilidad, buenas prácticas y SEO (el checkout baja en SEO porque es `noindex` a propósito).

Ver también `PENDIENTES-CLIENTE.md` y `REDIRECTS.md`.

## Vista previa en GitHub Pages

La vista previa no se indexa en buscadores: todos los HTML llevan `<meta name="robots" content="noindex, nofollow">` y `robots.txt` dice `Disallow: /`. **Al publicar en el dominio real**, quita esa meta de las páginas públicas (deja `noindex` solo en checkout y gracias) y restaura `robots.txt` con el bloque comentado que contiene.
