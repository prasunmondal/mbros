---
status: VERIFIED
last_verified: 2026-10-30
sources: [index.html, lang.js, script.js, retail-calculator/retail-calculator-script.js]
---
# Business context

## Purpose
Mondal Brothers supplies fresh farm chicken **wholesale to shops and hotels** with daily delivery. The site is a lightweight digital storefront plus a free utility that keeps retail shopkeepers engaged with the brand. Tagline: "Exclusive for Shops | Premium Quality | Modern Accounting with Daily SMS".

## Users
- **Shop / hotel owners (customers)** — mostly on Android phones, many prefer Bengali. Order, pay dues, refer other shops.
- **Retail shopkeepers** — use the Retail Calculator at the counter to price sales to their own walk-in customers.
- **Owners** — Pranab Mondal (contact/phone, WhatsApp orders on +91 97340 75801), Prasun Mondal (primary UPI payee, maintains the site).

## Terminology
| Term | Meaning |
|---|---|
| Broiler | Standard meat chicken |
| Culbird (cull bird) | Spent/older laying hen, sold cheaper |
| Live | Sold by live weight |
| Cut | Dressed/cut meat, sold by weight |
| Product type keys | `broiler_live`, `broiler_cut`, `culbird_live`, `culbird_cut` |
| Occasion pre-booking | Advance bulk order for an event (wedding, festival) on a date |

## Business rules
- Ordering is **next-day**: "Order for Tomorrow". Orders are a WhatsApp message to the business number; no in-app confirmation or cart.
- Quantity may be given in kg **or** pieces (or both).
- Pre-booking asks for name, occasion, date, qty (kg) and requests availability confirmation — the business confirms manually.
- Payment: UPI (deep link with optional amount, max ₹1,00,000 per UPI txn) or bank transfer (Canara Bank current account). Payment is not verified by the site.
- New shops sign up by WhatsApp message.
- Referral messages advertise: quality, fair prices, on-time delivery, computerised accounting with transaction SMS and statements.
- Retail calculator: amounts rounded to 2 decimals, kg to 3. Times are IST (Asia/Kolkata).

## Why the system looks this way
Customers already live in WhatsApp and UPI apps; reusing them avoids a backend, accounts and payment-gateway fees (see ADR-002, ADR-003). Bengali default reflects the customer base (ADR-005).

## Related
`domains/storefront.md`, `domains/retail-calculator.md`
