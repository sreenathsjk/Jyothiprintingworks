# Security Specification: Jyothi Print Studio (Firestore & Auth)

## 1. Data Invariants
- **Identity Lock**: A user can only read and write their own profile document (`/users/{userId}`).
- **Order Security**: A user can only access their own orders (where `userEmail` matches the authenticated user's email).
- **Static Validation**: All UIDs and Order IDs must be properly formed, avoiding injection attacks.
- **Immutability**: Crucial transaction fields like `orderId` and `userEmail` must not change on updates.
- **Strict Timestamps**: Server timestamps must be validated against `request.time` if they are defined.

## 2. The "Dirty Dozen" Malicious Payloads
Here are 12 specific payloads or actions designed to break the laws of Identity, Integrity, and State, which our Firestore rules will block:
1. **User Profile Hijack**: Creating or editing `/users/attackerUID` with a `userId` field claiming to be `victimUID`.
2. **PII Blanket Scrape**: Attempting to read all user profiles in a single collection query without specifying a filter.
3. **Ghost Fields Injection**: Injecting an unrequested field (e.g., `role: 'admin'`) into a user profile.
4. **Order Sneak**: Creating an order `/orders/order123` where `userEmail` is `victim@example.com` but the authenticated user is `attacker@example.com`.
5. **Dose of Injection**: Injecting a 1.5KB long trash string as a document ID (e.g., `/orders/TRASH...`).
6. **Self-Assigned Elevation**: Adding `exists(/admins/attackerUID)` or similar admin states from the client.
7. **Negative Values**: Placing an order with `totalAmount = -5000` or `quantity = -5`.
8. **Stale / Spoofed Date**: Forcing a client-side artificial order date in the future to bypass delivery SLA checks.
9. **Status Fast-Forward**: Direct-updating an order status from `design_approval` straight to `shipped` via client SDK.
10. **Order Hijack**: Updating an existing order's `userEmail` to transfer ownership.
11. **Anonymously Placed Orders**: Submitting checkout transactions without a verified, authenticated email.
12. **Double Delete**: Attempting to delete paid and active orders from the client SDK (only `shipped` orders are terminal, or deletion is entirely disabled for safety).

## 3. Test Runner Schema
The `firestore.rules` will explicitly reject these 12 cases. Let's design the rules to prevent these entirely.
