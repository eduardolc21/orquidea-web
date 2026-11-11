# Pendientes del cliente · Chocolate Orquídea

El sitio funciona con **marcadores**. Antes de publicar, el cliente debe confirmar o enviar lo siguiente. Entre paréntesis está el archivo donde se cambia.

## Datos de venta (bloquean la publicación)
- [ ] **Precios reales** de los 20 productos (`data/products.json` → `prices`, en céntimos). Al confirmar un precio, cambia `_placeholder.precio` a `false` y deja de verse en contorno.
- [ ] **Tarifas de envío** por zona y **monto para envío gratis**, y en qué zonas aplica (`data/shipping.json`).
- [ ] **Número de WhatsApp que recibe los pedidos**: ¿Tarapoto (945 313 345) o Lima (951 492 572)? (`js/config.js` → `WHATSAPP`).
- [ ] **Datos de pago**: Yape, Plin, banco, cuenta, CCI y titular (`js/config.js` → `PAYMENT`).
- [ ] **RUC** y razón social exacta de Industrias Mayo (pie de página, legales).
- [ ] **Textos legales** revisados por su asesor: términos, privacidad (y si el banco de datos está inscrito ante la ANPD), cambios y envíos, plazos (`legal/`).
- [ ] **Libro de Reclamaciones**: plataforma oficial o plugin con numeración correlativa (`legal/libro-reclamaciones.html`).

## Producto
- [ ] **Ingredientes y alérgenos** de cada producto, copiados del empaque (`data/products.json` → `extensions.orquidea`). Hoy son una aproximación marcada «por confirmar».
- [ ] **Peso de las chocotejas y de las coberturas** (no se ve en las fotos).
- [ ] **Panetón Orquídea**: la caja fotografiada dice **900 g**, pero el borrador decía 500 g. Confirmar el peso. Choco Panetón: 500 g.
- [ ] **Fotos de producto** en alta resolución y sin texto encima. Las del panetón son recortes de posts de Instagram, con destellos y texto.
- [ ] **Sesión de fotos** para el hero y para origen y comunidad. Las fotos actuales de la web antigua son pequeñas.
- [ ] **Stock**: qué productos están disponibles (`is_in_stock`).

## Marca y confianza
- [ ] **Logo vectorial original** (AI, PDF o SVG). `assets/brand/logo/orquidea-logotipo.svg` es un trazado automático.
- [ ] **Certificaciones vigentes** (orgánico USDA/UE, Fair Choice, Control Union): cuáles y con qué certificado. Hasta entonces la sección no muestra sellos.
- [ ] **Historias de las familias** (Quino Putpaña, Mariol Ojanasta, Boris Ojanasta Sinarahua): permiso para publicar nombres, fotos y textos.
- [ ] **Bio-tiendas en Lima**: confirmar cuáles siguen vendiendo Orquídea.
- [ ] **Horario de la tienda en Tarapoto**.
- [ ] Vigencia del teléfono fijo +51 1 372 3130 (hoy no se muestra).
- [ ] Dominio definitivo (hoy se asume `orquideaperu.com` en canonical, Open Graph y sitemap).

## No usar sin licencia
- Las imágenes de `assets/brand/fotos/_verificar-licencia/` no se usan en el sitio.
- No se usan fotos de menores de edad.
