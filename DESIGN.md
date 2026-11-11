---
name: Chocolate Orquídea
description: The brand's own shop, painted as the hand-lettered sign of the Tarapoto plant.
colors:
  rotulo-gold: "#d39c58"
  orchid-red: "#e32c3b"
  orchid-red-ink: "#b81e2c"
  cacao-enamel: "#471b00"
  cacao-wall: "#2b1000"
  cacao-relief: "#5c2a0c"
  sign-cream: "#f2e6cf"
  sign-cream-deep: "#e5d4b3"
  muted-on-dark: "#d9c6a6"
  muted-on-light: "#6b3d1c"
  linea-azul: "#2b3f8f"
  linea-amarillo: "#f0bd1c"
  linea-crema: "#ead8bd"
  linea-rojo: "#c8261f"
  linea-cacao: "#5c2a0c"
  linea-blanco: "#f7f3ea"
  linea-verde: "#4caa48"
  linea-celeste: "#2b9ad6"
  linea-naranja: "#ec8418"
  linea-fucsia: "#b8285e"
typography:
  display:
    fontFamily: "Alfa Slab One, Rockwell, Roboto Slab, Georgia, serif"
    fontSize: "clamp(2.75rem, 0.9rem + 7.4vw, 8.25rem)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Alfa Slab One, Rockwell, Roboto Slab, Georgia, serif"
    fontSize: "clamp(2rem, 1.4rem + 2.6vw, 3.5rem)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Alfa Slab One, Rockwell, Roboto Slab, Georgia, serif"
    fontSize: "clamp(1.5rem, 1.2rem + 1.2vw, 2.125rem)"
    fontWeight: 400
    lineHeight: 1.2
  title-sm:
    fontFamily: "Alfa Slab One, Rockwell, Roboto Slab, Georgia, serif"
    fontSize: "clamp(1.1875rem, 1.05rem + 0.5vw, 1.375rem)"
    fontWeight: 400
    lineHeight: 1.1
  price:
    fontFamily: "Alfa Slab One, Rockwell, Roboto Slab, Georgia, serif"
    fontSize: "1.625rem"
    fontWeight: 400
    lineHeight: 1
    fontFeature: "lnum"
  lead:
    fontFamily: "Schibsted Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.1875rem, 1.05rem + 0.5vw, 1.375rem)"
    fontWeight: 420
    lineHeight: 1.55
  body:
    fontFamily: "Schibsted Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 420
    lineHeight: 1.55
  body-sm:
    fontFamily: "Schibsted Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 720
    lineHeight: 1.55
  label:
    fontFamily: "Schibsted Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "0.08em"
  label-sm:
    fontFamily: "Schibsted Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 800
    lineHeight: 1.55
    letterSpacing: "0.08em"
  plate:
    fontFamily: "Alfa Slab One, Rockwell, Roboto Slab, Georgia, serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.06em"
rounded:
  sm: "2px"
  plate: "6px"
spacing:
  3xs: "0.25rem"
  2xs: "0.5rem"
  xs: "0.75rem"
  sm: "1rem"
  md: "1.5rem"
  lg: "clamp(2rem, 1.5rem + 2vw, 3rem)"
  xl: "clamp(3rem, 2rem + 4vw, 5.5rem)"
  gutter: "clamp(1rem, 0.5rem + 2.5vw, 3.5rem)"
  board-gap: "clamp(0.5rem, 0.3rem + 0.8vw, 1rem)"
  board-pad: "clamp(1.25rem, 0.6rem + 3.2vw, 4rem)"
components:
  board:
    backgroundColor: "{colors.cacao-enamel}"
    textColor: "{colors.sign-cream}"
    rounded: "0"
    padding: "{spacing.board-pad}"
  board-light:
    backgroundColor: "{colors.sign-cream}"
    textColor: "{colors.cacao-enamel}"
    rounded: "0"
    padding: "{spacing.board-pad}"
  board-gold:
    backgroundColor: "{colors.rotulo-gold}"
    textColor: "{colors.cacao-enamel}"
    rounded: "0"
    padding: "{spacing.board-pad}"
  button-primary:
    backgroundColor: "{colors.rotulo-gold}"
    textColor: "{colors.cacao-enamel}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0.75rem 1.75rem"
    height: "3.5rem"
  button-primary-active:
    backgroundColor: "{colors.cacao-enamel}"
    textColor: "{colors.rotulo-gold}"
  button:
    backgroundColor: "{colors.cacao-enamel}"
    textColor: "{colors.sign-cream}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0.75rem 1.375rem"
    height: "3rem"
  button-active:
    backgroundColor: "{colors.sign-cream}"
    textColor: "{colors.cacao-enamel}"
  button-added:
    backgroundColor: "{colors.orchid-red-ink}"
    textColor: "{colors.sign-cream}"
  chip:
    textColor: "{colors.sign-cream}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: "0.5rem 1rem"
    height: "2.75rem"
  chip-selected:
    backgroundColor: "{colors.orchid-red-ink}"
    textColor: "{colors.sign-cream}"
  cart-plate:
    backgroundColor: "{colors.sign-cream}"
    textColor: "{colors.cacao-enamel}"
    typography: "{typography.plate}"
    rounded: "{rounded.plate}"
    padding: "0.3rem 0.75rem"
    height: "2.75rem"
  input:
    backgroundColor: "{colors.linea-blanco}"
    textColor: "{colors.cacao-enamel}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "0.65rem 0.85rem"
    height: "3rem"
  pizarra:
    backgroundColor: "{colors.linea-azul}"
    textColor: "{colors.sign-cream}"
    rounded: "0"
  dock:
    backgroundColor: "{colors.cacao-enamel}"
    textColor: "{colors.sign-cream}"
    padding: "0.5rem {spacing.gutter}"
---

# Design System: Chocolate Orquídea

## Overview

**Creative North Star: "Rótulo de Tarapoto"**

The shop is the hand-painted sign of the plant at Jr. Santa Mónica 200, Tarapoto. Every section is an enamelled board (tablón) framed by a double gold filete, hung on a darker cacao wall with one measured gap between boards. Headings are sign lettering: a heavy slab face in gold, carrying a painted shade that steps first into orchid red and then into the wall cacao. Products are small painted placards (pizarras) in the colour of their packaging line, edged in cream and throwing a hard red painted shade, the same shade the main call to action carries.

The world borrows its details from the street around the plant: the cart is a mototaxi number plate, separators are the striped trim of a mototaxi, and on phones the cart docks to the bottom edge like a bar along the vehicle. Interaction is painted, not lit: pressing a control inverts the board (ground and letter swap places) instead of glowing or lifting. Confidence is drawn in the stroke: data the brand has not confirmed (reference prices, family names whose stories are still pending) is painted as outline lettering; confirmed data is filled.

Density is generous on the boards and tight inside the pizarras. Long-form reading (checkout, payment details, legal pages) and the retailer passage move to the cream board; everything else sits on cacao enamel. The visual rejections confirmed by the direction: no premium chocolatier in candlelit darkness with a gold serif, and no cream grid with botanical illustration.

**Key Characteristics:**
- Cacao enamel boards with a 3px outer and 1px inner gold filete, stacked on a darker wall with one measured gap.
- Alfa Slab One sign lettering with a two-step painted shade (red, then wall cacao).
- Product pizarras painted in their packaging line colour, cream edge, hard red painted shade.
- Orchid red is the only state ink; pressing inverts.
- Outline lettering means unconfirmed; filled means confirmed.
- Mototaxi stripe separators, mototaxi-plate cart, docked cart bar on mobile.

## Colors

A sign-painter's enamel set: two cacao browns as ground, gold and cream as lettering, one red as the only active ink, and ten packaging-line colours reserved for product placards.

### Primary
- **Rótulo Gold** (rotulo-gold): the logotype colour. Sign lettering on dark boards, the double filete, the primary call to action fill, totals in the cart, header and dock rules, the selection highlight and the scrollbar thumb.

### Secondary
- **Orchid Red** (orchid-red): the only state ink. First step of the lettering shade, the hard painted shade under pizarras and the primary CTA, focus outlines, the cart plate border once it holds items, a completed free-shipping bar, the toast border, the text caret.
- **Orchid Red Ink** (orchid-red-ink): the same red deepened for fills that carry cream text at AA contrast: "added" buttons, selected chips and segmented options, the cart count on a filled plate, error text and error borders, checkbox and radio accents.

### Tertiary
- **Line colours** (linea-azul, linea-amarillo, linea-crema, linea-rojo, linea-cacao, linea-blanco, linea-verde, linea-celeste, linea-naranja, linea-fucsia): the packaging line palette. They paint pizarra grounds and the product-page gallery panel, and four of them (red, blue, yellow, green) recur in the mototaxi stripe. Light lines (amarillo, crema, blanco, verde, celeste, naranja) take cacao ink; dark lines (azul, rojo, cacao, fucsia) take cream ink. Linea-blanco doubles as the field and payment-card ground on cream boards.

### Neutral
- **Cacao Enamel** (cacao-enamel): the board ground, header, drawer, dock, and ink on cream and gold boards. Also the theme colour.
- **Cacao Wall** (cacao-wall): the page background, visible only as the measured gap between boards and in the footer; the second step of the lettering shade.
- **Cacao Relief** (cacao-relief): hover fill for chips on dark boards, dashed cart-line dividers, footer legal rule.
- **Sign Cream** (sign-cream): body text on cacao, the light board ground, the pizarra edge, the cart plate, the focus halo.
- **Sign Cream Deep** (sign-cream-deep): chip hover on cream boards.
- **Muted on Dark** (muted-on-dark): secondary text on cacao (at least 7:1).
- **Muted on Light** (muted-on-light): secondary text and placeholders on cream (at least 7:1).

### Named Rules
**The One Ink Rule.** Orchid red is the only colour that means "something happened" (added, selected, focused, invalid, complete). Gold is lettering, never state. Use orchid-red-ink whenever red sits behind text.

**The Line Colour Rule.** Line colours belong to products. They paint pizarras, the product gallery panel and the mototaxi stripe, never section boards, buttons or text.

**The Cacao Ground Rule.** Boards are cacao by default. The cream board is an exception kept for reading and form work (checkout, order confirmation, legal pages) and for the "Dónde comprar" passage; the gold board appears once, for the community story.

## Typography

**Display Font:** Alfa Slab One (with Rockwell, Roboto Slab, Georgia), self-hosted woff2, single weight.
**Body Font:** Schibsted Grotesk (with Helvetica Neue, Arial), self-hosted variable woff2, 400 to 800.

**Character:** Alfa Slab One is the sign painter's brush: fat slabs, painted shade, tight leading. Schibsted Grotesk is the stencilled small print beside it: sturdy, slightly heavy at rest (420), and set in tracked capitals for every control.

### Hierarchy
- **Display** (400, clamp 2.75rem to 8.25rem, 0.95; 0.9 and capped at 12svh from 56em): the hero line only, max 12ch.
- **Headline** (400, clamp 2rem to 3.5rem, 0.95): one section title per board, always with the painted shade.
- **Title** (400, clamp 1.5rem to 2.125rem, 1.2): drawer title, fieldset legends, order number, family names, legal subheads.
- **Title Small** (400, clamp 1.1875rem to 1.375rem, 1.1): pizarra names, step and pillar heads, footer column heads.
- **Price** (400, 1.625rem on pizarras, up to the headline size on the featured pizarra and product page, 1): always Alfa Slab One with lining numerals.
- **Lead** (420, clamp 1.1875rem to 1.375rem, 1.55): the paragraph under a section title, max 52ch (40 to 46ch in the hero).
- **Body** (420, 1.0625rem, 1.55): prose at a 66ch measure; bold is 720.
- **Label** (800, 0.9375rem, 0.08em, uppercase): buttons; 0.8125rem for nav links, badges, place tags.
- **Plate** (Alfa Slab One, 1rem, 0.06em, uppercase): the cart plate only.

### Named Rules
**The Painted Shade Rule.** Sign lettering on cacao is gold with a two-step shade: 0.045em in orchid red, then 0.08em in wall cacao. On cream boards the letter turns cacao with a single gold step; on the gold board, cacao with a single cream step. Body text never carries a shade.

**The Stroke of Confidence Rule.** Unconfirmed data is outline lettering (1.25px stroke in the current colour, transparent fill) with an accessible "por confirmar" note; confirmed data is filled. Outline lettering means nothing else.

## Layout

Boards stack in a single column at `min(100% - 2 × board-gap, 90rem)`, separated by one measured board gap (0.5rem to 1rem) through which the cacao wall shows. Inside each board, padding is the fluid board-pad (1.25rem to 4rem); page gutters outside boards are the fluid gutter. The header is sticky at 4.25rem, full bleed, with a gold rule.

Breakpoints: below 30em the logo shrinks and the plate drops its word; from 40em the shop grid becomes auto-fill at a 14rem minimum (two columns below that, with chips scrolling horizontally); from 56em hero, story, community, certifications, where-to-buy, corporate and product layouts go to two or three asymmetric columns; from 64em the nav opens inline, the mobile dock disappears and the checkout summary goes sticky. The hero fills the first viewport (capped at 52rem) with its mototaxi stripe inside the inner filete at the bottom.

Spacing follows a single scale (0.25, 0.5, 0.75, 1, 1.5rem, then fluid lg and xl); forms use an auto-fit grid with a 15rem minimum.

## Elevation & Depth

Depth is painted, not lit. Boards are flat; their frame is the double filete. The only offset shadows are the sign painter's hard shades: zero blur, on lettering, on pizarras and the product gallery panel, and on the primary CTA. Soft shadows exist only where a real object sits on or over the sign: the cart drawer over the page and the product packshots resting inside their pizarra.

### Shadow Vocabulary
- **Letter shade** (`text-shadow: 0.045em 0.045em 0 #e32c3b, 0.08em 0.08em 0 #2b1000`): sign lettering on cacao.
- **Letter shade light** (`text-shadow: 0.05em 0.05em 0 #d39c58`): sign lettering on cream; cream step instead on the gold board.
- **Board shade** (`box-shadow: 0.4rem 0.4rem 0 #e32c3b`): pizarras, product gallery panel, primary CTA.
- **Drawer** (`box-shadow: -1.5rem 0 3rem rgb(20 6 0 / 0.55)`): the cart drawer, over a 60% cacao backdrop.
- **Packshot** (`filter: drop-shadow(0 0.6rem 0.8rem rgb(20 6 0 / 0.35))`): cut-out product packshots inside pizarras.

### Named Rules
**The Press Inverts Rule.** Pressing swaps ground and letter (cream on cacao becomes cacao on cream). The primary CTA also drops its painted shade and moves 0.2rem into it. Nothing glows or lifts on press.

## Shapes

Sign corners are square. Boards and pizarras have no radius; controls use a barely softened 2px corner; the only rounded object is the cart plate (6px), because number plates are. Frames are always lines: the board's 3px outer filete plus a 1px inner filete inset 0.5rem; the pizarra's 3px cream edge plus a 1px inner line at 55% inset 0.375rem; photographs sit in a 3px gold, cream or cacao frame. Controls carry 2px borders. The mototaxi stripe is a 0.625rem band repeating red, blue, yellow and green panels (3.5rem) separated by 0.5rem gold.

## Components

### Buttons
Painted plates of capital letters that invert when pressed.
- **Shape:** squared with a 2px corner, 2px border.
- **Primary:** gold ground, cacao letter, cream border, board shade, 3.5rem tall; border turns cacao on hover; on press it inverts, loses the shade and steps 0.2rem down-right.
- **Default:** cacao ground, cream letter and border, 3rem tall; border turns gold on hover; inverts on press. Inside pizarras the default button is cacao on light lines and cream on dark lines, without shade.
- **Ghost:** transparent, current colour letter and border; presses to cream on cacao.
- **Added:** orchid-red-ink ground, cream letter and border.
- **Focus:** 3px orchid red outline offset 3px with a 7px cream halo, on every focusable element.

### Chips
- **Style:** line filters; transparent with a 2px border (gold on cacao, cacao on cream), heavy small text with the product count in regular weight.
- **State:** selected is orchid-red-ink filled with cream text; hover is a cacao-relief or cream-deep fill.

### Cards / Containers
- **Board (tablón):** cacao, cream or gold ground, square, double filete in gold (cacao on light and gold boards), board-pad inside, board gap below.
- **Pizarra (product card):** line-colour ground, 3px cream edge, inner 1px line, board shade. Packshots tilt -2.5deg and straighten with a 4px lift on hover; photographs sit square in a 2px frame. The whole pizarra is the link to the product page, with the buy row above it; focus outlines the whole pizarra. Sold-out dims and desaturates the image.
- **Inset cacao panel:** on cream boards, cacao panels (the Tarapoto store, the checkout summary) use a 3px cacao border and a 1px gold outline inset 0.5rem, and their lettering returns to the gold-on-cacao shade.

### Inputs / Fields
- **Style:** linea-blanco ground, cacao text, 2px cacao border, 2px corner, 3rem tall; custom drawn select chevron; bold label above, small muted hint below.
- **Focus:** the global red outline with cream halo.
- **Error:** orchid-red-ink border plus 1px inset, bold red-ink message; on cacao boards the message becomes cream on a red-ink tag. Form-level errors are a solid red-ink notice on linea-blanco.
- **Choices:** segmented controls and shipping rates fill the checked option (red-ink for segments, cacao for rate rows).

### Navigation
- **Header:** cacao, gold double rule at the bottom, gold logo left, tracked uppercase links (0.8125rem, 800) that turn gold on hover.
- **Mobile:** a ghost menu button opens a dropdown panel of large gold sign-lettered links (title size).

### Cart Plate (signature)
A cream mototaxi number plate with a 3px gold border and a cacao count tile, set in Alfa Slab One capitals. With items, the border turns orchid red and the count tile red-ink; adding an item bumps the plate (lift and -2deg tilt, 320ms). Press inverts.

### Cart Drawer and Dock (signature)
The cart is a native dialog sliding in from the right (28rem, gold left rule). Lines show a mini pizarra thumbnail in the product's line colour, a bordered quantity stepper and a remove control; the foot holds the free-shipping progress bar (gold fill, red when complete) and a gold display total. Below 64em a docked bar (cacao, gold top rule, safe-area padding) slides up once the cart has items, showing the gold total and a primary "Finalizar" button.

### Mototaxi Stripe (signature)
The painted trim used as a separator: inside the hero's inner filete at its foot and at the top of the footer. It is decoration only (aria-hidden).

## Do's and Don'ts

### Do:
- **Do** set every color, size, space and radius through the `--orq-*` custom properties in `css/tokens.css`; it is the single source and ships unchanged to WooCommerce.
- **Do** name new components in BEM with the `orq-` prefix and attach behavior only through `data-orq-*` attributes, never through classes.
- **Do** frame every new section as a board with the double filete and leave exactly one board gap between boards.
- **Do** paint a new product as a pizarra in its packaging line colour, choosing cream or cacao ink by the line's lightness.
- **Do** render any unconfirmed figure (price, schedule, name) as outline lettering with an accessible "por confirmar" note, and fill it once confirmed.
- **Do** express pressed and selected states by inverting ground and letter, or by orchid-red-ink fill for selection.
- **Do** keep product and origin rasters with their provenance sidecar (`*.webp.json`): product and origin images are sourced brand assets, and the logo WebPs are rendered from the traced brand SVG until the original vector arrives.

### Don't:
- **Don't** use orchid red for decoration or emphasis; it is reserved for state, focus, the painted shade and the stripe.
- **Don't** put cream text on orchid-red (#e32c3b); use orchid-red-ink behind text.
- **Don't** use line colours for boards, buttons or text.
- **Don't** blur the painted shades; lettering, pizarra and CTA shades are always hard-edged and offset down-right.
- **Don't** round boards or pizarras; controls stay at 2px and only the cart plate reaches 6px.
- **Don't** use outline lettering for confirmed data or as a style choice.
- **Don't** move to the cream board for anything other than reading, forms, payment data, or the retailer passage.
