# Specification

## Summary
**Goal:** Fix the current build/deploy failure by making the Motoko backend compile reliably, preserving product CRUD behavior, and ensuring upgrade-safe persistence/migration wiring.

**Planned changes:**
- Identify and resolve the root cause(s) of the build/deploy pipeline failure so `dfx build` and deployment complete without errors.
- Replace the current `mo:core/Map` usage in `backend/main.mo` with a supported data structure/APIs that compile on the Internet Computer toolchain while preserving existing product CRUD semantics.
- Add stable, upgrade-safe persistence for products and `nextId` within the single Motoko actor so data survives canister upgrades/redeploys.
- Provide or repair `backend/migration.mo` (and required wiring) to match the project’s conditional migration policy and prevent upgrade traps.
- Ensure all existing user-facing text remains in English and the global footer content remains unchanged, including the exact text: `Mobile: 9973279335`.

**User-visible outcome:** The app builds and deploys successfully; product create/read/list/update/delete continues to work as before, and existing products/IDs remain intact across canister upgrades, with the footer text unchanged.
