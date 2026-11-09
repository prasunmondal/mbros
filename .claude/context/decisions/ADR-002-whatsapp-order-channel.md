# ADR-002: WhatsApp and UPI as order/payment channels

- **Status:** accepted (backfilled 2026-10-30; rationale inferred — confirm with owner)
- **Date:** unknown

## Context
Customers are shopkeepers already using WhatsApp and UPI daily. Orders are confirmed manually by the owners.

## Decision
Forms compose a pre-filled `wa.me` message to the business number; payments use `upi://pay` deep links and displayed bank details. No cart, order DB or payment gateway.

## Alternatives considered
- Online order system with backend — needs hosting, auth, maintenance.
- Payment gateway — fees, KYC, integration effort.

## Consequences
+ No backend or fees; familiar to users.
− No order/payment record in the system; confirmation is manual; message format is the only "contract".

## Constraints for future work
Keep messages human-readable (owners read them directly). Business number and UPI IDs appear in multiple files — change together.

## Related
`domains/storefront.md`
