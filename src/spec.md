# Specification

## Summary
**Goal:** Fix the app header logo so it matches the originally uploaded/provided logo, using a static frontend asset.

**Planned changes:**
- Replace/update the generated logo asset so the correct logo artwork is used from `frontend/public/assets/generated`.
- Update `frontend/src/App.tsx` to reference the corrected logo filename via a `/assets/generated/...` path (unambiguous static asset reference).
- Ensure the logo continues to be served purely as a static frontend file (no backend image serving).

**User-visible outcome:** On app load (including after a hard refresh), the header displays the correct, originally provided logo.
