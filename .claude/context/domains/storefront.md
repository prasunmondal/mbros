---
status: VERIFIED
last_verified: 2026-10-30
sources: [index.html, script.js, local-name-storage.js, style.css, lang.js, language.js]
---
# Storefront (index.html)

## Purpose
Single-page, mobile-first landing page where customers order, pre-book, pay, contact and refer. Professional redesign 2026-10-30 replaced the old accordion layout.

## Page structure (top → bottom)
| Section | Behaviour | Code |
|---|---|---|
| Sticky top bar | Logo, EN/বাং switch (`.lang-opt`, `.active`), call icon | `index.html`, `language.js` |
| Hero | Headline, "Order on WhatsApp" (scrolls to `#order`), call button, trust chips | `index.html` |
| Quick actions | 4 tiles: order, pre-book (opens occasion tab), pay, retail calculator | `index.html` |
| Why us | 4 feature cards. Copy limited to claims the business already makes (quality, fair price, on-time, computerised accounts) | `index.html` |
| `#order` | Tabbed card (`showOrderTab('tomorrow'|'occasion')`). Tomorrow: `#orderForm` requires kg or pieces (`#qtyError`), sends "Hello, I am {name}. I want to order {qty}." to `wa.me/{whatsappNumber}`. Occasion: `sendOccasionBooking()`; `#occDate` min = tomorrow | `script.js` |
| `#pay` | UPI card (QR, `payViaUpiSmart` with optional amount, rejects > ₹1,00,000) + bank card; values copy via `.copyable` click or copy buttons | `script.js` |
| Calculator promo | Links to `retail-calculator/` | `index.html` |
| `#refer` | EN/BN share via WhatsApp or `navigator.share` (text duplicated per function) | `script.js` |
| `#contact` | Pranab Mondal call/WhatsApp + new-shop sign-up (`#signupLink`, text set per language) | `index.html`, `language.js` |

SEO: meta description, Open Graph tags, `LocalBusiness` JSON-LD in `<head>`. Fonts: Poppins (Latin) + Hind Siliguri (Bengali).

## Rules / constraints
- Strings: all labels via `lang.js`; home-page keys live in the first `translations` block. Keys must not collide with calculator keys (`kg_ph`, `footer`, `copied`, …) because the calculator block overrides them — hence `order_kg_ph`, `site_footer`.
- `data-translate` sets `innerHTML`, so put icons **outside** the translated `<span>`.
- Business WhatsApp number: `whatsappNumber` const in `script.js` and hardcoded in `index.html` / `language.js`. Change all together.
- UPI payee in `payViaUpiSmart` must match the displayed primary UPI details.
- Name fields `#name`, `#occName` sync via `customerName` key.
- Tracked actions: `Clicked Section: <order|prebook|payment>` (`trackSection`), order/pre-book/share events (see `telemetry.md`).
- Design tokens are CSS variables at the top of `style.css`; `style.css` is used only by this page.

## Related
`business.md`, `telemetry.md`, ADR-002
