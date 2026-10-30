---
status: VERIFIED
last_verified: 2026-10-30
sources: [index.html, script.js, local-name-storage.js, style.css, header-style.css]
---
# Storefront (index.html)

## Purpose
Single-page accordion where customers order, pre-book, pay, contact and refer.

## Flows
| Section | Behaviour | Code |
|---|---|---|
| Hero | Call button (`tel:`), WhatsApp sign-up link (text set per language in `language.js`) | `index.html` |
| Retail Calculator link | Navigates to `retail-calculator/`; shows "New" badge | `index.html` |
| Payment | QR image, UPI deep link with optional amount (`payViaUpiSmart`, rejects > ₹1,00,000), copyable UPI/bank details (`copyToClipboard`, `.copyable` click) | `script.js` |
| Order for Tomorrow | `#orderForm` submit → builds "Hello, I am {name}. I want to order {qty}." → opens `wa.me/{whatsappNumber}` | `script.js` |
| Occasion Pre-Booking | `sendOccasionBooking()` → multi-line WhatsApp message | `script.js` |
| Refer Customers | EN/BN share text via WhatsApp or `navigator.share` (4 functions, text duplicated per function) | `script.js` |

Accordion: `.accordion-header` toggles `.open` on next sibling, scrolls into view, and tracks a `Clicked Header` event.

## Rules / constraints
- Business WhatsApp number: `whatsappNumber` const in `script.js` and hardcoded in `index.html` / `language.js`. Change all together.
- UPI payee in `payViaUpiSmart` must match the displayed primary UPI details.
- Name fields `#name`, `#occName` sync via `customerName` key.
- Every user action should call `trackEvent(...)` (see `telemetry.md`).

## Related
`business.md`, `telemetry.md`, ADR-002
