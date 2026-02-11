# Specification

## Summary
**Goal:** Improve order management and shopping experience by attaching customer names to orders, enabling admins to clear order history, and sorting products by most-selling.

**Planned changes:**
- When a logged-in customer places an order, store the customer name (from the login username) on the saved order record in localStorage.
- Update the Admin Orders view to display and/or clearly separate orders by customer name, with a safe fallback label (e.g., "Unknown customer") for older orders missing a customer name.
- Add an admin-only “Clear Order History” control in the Orders area with an in-app confirmation step and in-app success/error feedback; upon confirmation, delete orders from state and localStorage and refresh the empty state immediately.
- In the customer Shop view, sort products by most-selling (descending order count derived from stored order history), using stable ordering for ties and a sensible default ordering when no orders exist.

**User-visible outcome:** Customers’ orders are saved with their names; admins can view orders separated by customer and can clear all order history with confirmation; customers see products listed with most-selling items first.
