# Specification

## Summary
**Goal:** Fix product load failures after adding products by normalizing backend-to-UI product data types and ensuring CRUD calls use correctly typed IDs.

**Planned changes:**
- Normalize product mapping so UI `Product.id` is always a string and backend numeric-like values (e.g., `id`, `pricePaise` as `number` or `bigint`) are handled robustly.
- Ensure product list rendering uses stable React keys derived from the normalized string IDs and newly added products display correctly after refresh.
- Update the products CRUD hook to safely convert UI string IDs to backend Nat/`bigint` for update/delete operations.
- Fix the update-product flow so the UI→backend conversion helper is called with data that does not include an `id` field when it expects `Omit<Product, 'id'>`.

**User-visible outcome:** After adding a product, the product list refreshes and shows the new item without “unable to load the product” errors, and products can be edited or deleted reliably (no “Product not found” / ID conversion issues).
