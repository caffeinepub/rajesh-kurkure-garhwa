import type { Product as BackendProduct } from '../backend';
import type { Product as UIProduct } from '../types/product';

/**
 * Convert backend Product (bigint id/pricePaise) to UI Product (string id/price in rupees)
 */
export function backendToUIProduct(backendProduct: BackendProduct): UIProduct {
  return {
    id: backendProduct.id.toString(),
    name: backendProduct.name,
    price: formatPriceFromPaise(backendProduct.pricePaise),
    image: backendProduct.image || undefined,
  };
}

/**
 * Convert UI Product data to backend format for create/update operations
 */
export function uiToBackendProductData(uiProduct: Omit<UIProduct, 'id'>): {
  name: string;
  pricePaise: bigint;
  image: string | null;
} {
  // Parse price safely and convert rupees to paise
  const priceNum = parseFloat(uiProduct.price);
  const pricePaise = isNaN(priceNum) ? 0n : BigInt(Math.round(priceNum * 100));

  return {
    name: uiProduct.name,
    pricePaise,
    image: uiProduct.image || null,
  };
}

/**
 * Format bigint paise to display string (convert from paise to rupees with 2 decimals)
 */
export function formatPriceFromPaise(pricePaise: bigint): string {
  const priceNum = Number(pricePaise) / 100;
  return priceNum.toFixed(2);
}
