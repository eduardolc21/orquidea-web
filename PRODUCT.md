# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML5 + CSS + vanilla JavaScript (ES modules). No frameworks, no build step, no UI libraries; runs from any static server (`npx serve .`). Binding because the site will be migrated to WordPress + WooCommerce keeping the same markup, CSS and JS (see `PROMPT_claude_code_orquidea.md` §2).

## Users

- **Primary — buyers in the provinces, especially Tarapoto and San Martín:** live where the chocolate is made or in regions without supermarket distribution; want to order the full range and have it shipped.
- **Primary — Lima buyers buying for themselves:** already know the brand from Wong, Vivanda, Tottus, Metro, Plaza Vea or the bio-stores; come for lines that are hard to find on the shelf (organic bars, chocotejas, coberturas, seasonal panetón).
- Secondary: corporate and export enquiries (a simple form, no online sale).

Most traffic arrives on a phone, often from Instagram or Facebook.

## Product Purpose

The brand's own online shop plus its story: let people buy the full Orquídea range directly and understand where it comes from. In phase 1 an order is a cart plus checkout form that sends the order through WhatsApp; payment is made by Yape, Plin or bank transfer. Success means complete, well-formed WhatsApp orders from anywhere in Peru.

## Positioning

Chocolate made entirely in the place the cacao is grown: a plant in Tarapoto, San Martín, run by Industrias Mayo for more than 25 years. The project began as cacao grown as an alternative to the coca leaf, working with small farmers from native communities. The chocolate is handmade with organic Amazonian cacao and native ingredients (kiwicha, quinoa, maracuyá), with no cocoa powder and no hydrogenated vegetable fats.

## Operating Context

- Ships nationwide: Lima, Tarapoto/San Martín and the rest of Peru through a courier, with a rate per zone and free shipping above a configurable amount. The chocolate travels in thermal packaging.
- Orders and customer service run through WhatsApp: Tarapoto 945 313 345 and Lima 951 492 572 (confirm which number receives web orders).
- Peruvian requirements: prices in PEN including IGV; boleta or factura (DNI or RUC); Ley 29733 privacy consent; a visible Libro de Reclamaciones.
- Seasonal: a Christmas line (Panetón Orquídea and Choco Panetón, 500 g) is featured in the shop and the hero until January, then the permanent star product returns.

## Capabilities and Constraints

- Catalogue in the WooCommerce Store API shape (`data/products.json`); cart behind an adapter (`local` now, `woo` later).
- No card payments in phase 1; `payWithGateway(order)` is left as a stub for phase 2 (Izipay, Mercado Pago or Culqi).
- Weight budget: home under 1 MB, own JS under 30 KB, at most 2 self-hosted font families.
- **Undecided (placeholders):** all prices, shipping rates and the free-shipping threshold, the order WhatsApp number, Yape/Plin and bank details, RUC, which certifications are current, Tarapoto store hours, and whether the bio-stores still stock the brand.

## Brand Commitments

- Name: Chocolates Orquídea / Orquídea Chocolate. Packaging lines: «Hecho en la Amazonía Peruana», «Amazonian Cacao».
- Brand colours from real assets: cacao `#471B00`, gold `#D39C58` (wordmark), orchid red `#E32C3B` (symbol). Each line has a packaging colour (organic: blue Dark, yellow Kiwicha, cream Mild Dark, red Quinoa; classics: white, green, light blue, yellow, orange, fuchsia).
- Voice: warm, proud of the origin, honest, and more restrained and premium than social media. No superlatives such as «el mejor del mundo»; concrete stories of the jungle and the families.
- The wordmark SVG is an automatic trace; it is a prototype stand-in until the original arrives.

## Evidence on Hand

- Product cut-outs (500×982) for every bar, chocoteja, the drinking chocolate and coberturas: `assets/brand/productos/`. Weights and cacao % read from the packs: `assets/brand/data/products-borrador.json`.
- Origin photos (landscape, pods, farmer, drying, collection centre, plant, community): `assets/brand/fotos/origen-y-comunidad/`. Ambient product photos: `assets/brand/fotos/producto-ambiente/`.
- Panetón photos from Instagram: `assets/brand/productos/paneton/`.
- Retailer logos: `assets/brand/puntos-venta/`. Maps: `assets/brand/mapas/`. YouTube process video: lpyuCaFZwA0.
- **Do not use:** certification seals until the client confirms current certificates (the public PDFs are from 2011–2013); anything in `fotos/_verificar-licencia/`; photos of children.
- **Do not fabricate:** testimonials, prices, ratings, awards or certifications. The farmer stories (Quino Putpaña, Mariol Ojanasta, Boris Ojanasta Sinarahua) are placeholders until the client approves them.
- There is no high-resolution hero photography; a new shoot is recommended.

## Product Principles

1. **Origin is the proof.** Every claim traces back to San Martín, the plant, the farmers or the ingredients; nothing generic.
2. **The order must arrive complete.** The checkout exists to produce a WhatsApp message the team can fulfil without asking anything back.
3. **Honest placeholders.** Unconfirmed data is marked as such and never presented as fact.
4. **Portable by design.** Markup, tokens and components must survive the move to WooCommerce unchanged.
5. **Light enough for a phone in the provinces.** Performance is accessibility for buyers on mobile data.

## Accessibility & Inclusion

WCAG 2.2 AA: contrast, visible focus, full keyboard use, an accessible cart dialog (focus trap, Esc, live announcements), `prefers-reduced-motion`. Language es-PE.
