import { useState, useEffect } from 'react';
import type { Product } from '../types/product';

const STORAGE_KEY = 'products';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  // Load products from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setProducts(parsed);
        }
      }
    } catch (error) {
      console.error('Failed to load products from localStorage:', error);
    }
  }, []);

  // Save products to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (error) {
      console.error('Failed to save products to localStorage:', error);
    }
  }, [products]);

  const addProduct = (product: Product) => {
    setProducts((prev) => [...prev, product]);
  };

  return {
    products,
    addProduct,
  };
}
