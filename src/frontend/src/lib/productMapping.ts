import type { Product as BackendProduct } from '../backend';
import type { Product as UIProduct } from '../types/product';

/**
 * Convert backend Product (bigint id/price) to UI Product (string id/price)
 */
export function backendToUIProduct(backendProduct: BackendProduct): UIProduct {
  return {
    id: backendProduct.id.toString(),
    name: backendProduct.name,
    price: backendProduct.price.toString(),
    image: backendProduct.image || undefined,
  };
}

/**
 * Convert UI Product data to backend format for create/update operations
 */
export function uiToBackendProductData(uiProduct: Omit<UIProduct, 'id'>): {
  name: string;
  price: bigint;
  image: string | null;
} {
  // Parse price safely
  const priceNum = parseFloat(uiProduct.price);
  const priceBigInt = isNaN(priceNum) ? 0n : BigInt(Math.floor(priceNum * 100)); // Store as paise (cents)

  return {
    name: uiProduct.name,
    price: priceBigInt,
    image: uiProduct.image || null,
  };
}

/**
 * Parse bigint price to display string (convert from paise to rupees)
 */
export function formatPrice(priceBigInt: bigint): string {
  const priceNum = Number(priceBigInt) / 100;
  return priceNum.toFixed(2);
}
