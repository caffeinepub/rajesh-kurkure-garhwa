# Specification

## Summary
**Goal:** Fix the regression in product save/update/delete so product prices are consistently stored as integer paise in the backend while being displayed/edited as rupees with 2 decimal places in the UI, and make failures easier to diagnose.

**Planned changes:**
- Correct product price mapping/conversion so UI uses rupees (2 decimals) while backend storage remains integer paise, ensuring prices remain consistent after save and reload.
- Fix frontend update-product conversion so `uiToBackendProductData` is called with correctly typed data (excluding `id`), and ensure add/update/delete mutations send valid backend arguments.
- Improve error visibility for failed add/update/delete operations by showing an underlying error reason in the toast when available and logging the caught error object to the console.

**User-visible outcome:** Admins can add, edit, and delete products reliably; prices entered as rupees (e.g., ₹12.50) remain the same immediately after saving and after refresh, and any failed operation shows a clearer error message.
