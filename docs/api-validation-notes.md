# API validation notes

## Summary

This update adds a reusable Zod-based request validation layer for booking payloads and documents the schema used by the Express API.

## What Was Done

- Added a reusable `validateSchema` middleware in `src/middleware/validate.ts`.
- The middleware accepts a Zod schema, runs `safeParse` against `req.body`, and:
  - calls `next()` when validation passes
  - returns HTTP 400 with validation details when it fails
  - assigns the parsed result back to `req.body`
- Added `createBookingSchema` in `src/schemas/booking.schema.ts`.
- Enforced the required booking payload rules:
  - `desk`: trimmed string, length 3-100
  - `floor`: trimmed string, length 5-200
  - `date`: valid ISO date string
  - `active`: optional boolean, defaulting to `true`

## How to Test

1. Run the app with `npm run dev`.
2. Send a valid booking payload to the booking endpoint.
3. Confirm the request is accepted.
4. Send invalid payloads such as an empty `desk`, a short `floor`, or an invalid `date`.
5. Confirm the API responds with status `400` and includes validation errors.
