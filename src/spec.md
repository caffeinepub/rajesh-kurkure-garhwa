# Specification

## Summary
**Goal:** Persist products permanently by moving product storage from frontend `localStorage` to a Motoko backend with stable state and a CRUD API, while keeping existing shop/admin UI behavior intact.

**Planned changes:**
- Implement a persistent Product data model and stable storage in `backend/main.mo` to retain products across canister upgrades (fields: `id`, `name`, `price`, optional `image` as text).
- Add product CRUD + read APIs in `backend/main.mo`: list products (query), create product (update with generated unique id), update product by id, delete product by id (with clear not-found results).
- Update `frontend/src/hooks/useProducts.ts` to use the backend APIs (via React Query) instead of `localStorage`, preserving existing product image (data URL string) behavior end-to-end.
- Wire existing UI components (`App.tsx`, `ShopView`, `AdminPanel`) to the backend-backed products hook, including loading/error handling with user-friendly English messages.
- Ensure build/deploy succeeds and the global footer remains unchanged, including the text: "Mobile: 9973279335".

**User-visible outcome:** Products added/edited/deleted in the Admin panel are saved permanently, shared across sessions/browsers, and still appear correctly in the shop after refresh or canister upgrade; failures show clear English error messages and the footer text remains the same.
