import type { Product as BackendProduct } from '../backend';
import type { Product as UIProduct } from '../types/product';

/**
 * Safely convert numeric-like values (bigint | number | string) to bigint
 */
function toSafeBigInt(value: bigint | number | string): bigint {
  if (typeof value === 'bigint') {
    return value;
  }
  if (typeof value === 'number') {
    return BigInt(Math.floor(value));
  }
  if (typeof value === 'string') {
    const parsed = BigInt(value);
    return parsed;
  }
  throw new Error(`Cannot convert ${typeof value} to bigint`);
}

/**
 * Safely parse UI string ID to bigint for backend calls
 */
export function parseProductId(id: string): bigint {
  try {
    return BigInt(id);
  } catch (error) {
    throw new Error(`Invalid product ID: ${id}`);
  }
}

/**
 * Convert backend Product (bigint id/pricePaise) to UI Product (string id/price in rupees)
 * Handles numeric-like values robustly (bigint | number | string)
 */
export function backendToUIProduct(backendProduct: BackendProduct): UIProduct {
  // Normalize id to string, handling number/bigint/string
  const id = String(toSafeBigInt(backendProduct.id as any));
  
  // Normalize pricePaise to bigint, then format
  const pricePaise = toSafeBigInt(backendProduct.pricePaise as any);
  const price = formatPriceFromPaise(pricePaise);

  return {
    id,
    name: backendProduct.name,
    price,
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
