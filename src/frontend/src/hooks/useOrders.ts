import { useState, useEffect } from 'react';
import type { Order } from '../types/order';

const ORDERS_KEY = 'orders';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);

  // Load orders from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(ORDERS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setOrders(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
      setOrders([]);
    }
  }, []);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch (error) {
      console.error('Failed to save orders:', error);
    }
  }, [orders]);

  const addOrder = (productName: string, customerName?: string) => {
    const newOrder: Order = {
      productName,
      createdAt: new Date().toISOString(),
      customerName,
    };
    setOrders((prev) => [newOrder, ...prev]); // Newest first
  };

  const clearOrders = () => {
    setOrders([]);
    try {
      localStorage.removeItem(ORDERS_KEY);
    } catch (error) {
      console.error('Failed to clear orders:', error);
      throw error;
    }
  };

  return { orders, addOrder, clearOrders };
}
