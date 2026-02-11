import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '../types/product';
import type { Order } from '../types/order';

interface ShopViewProps {
  products: Product[];
  onOrder: (productName: string) => void;
  orders: Order[];
}

export default function ShopView({ products, onOrder, orders }: ShopViewProps) {
  // Sort products by most-selling (descending)
  const sortedProducts = useMemo(() => {
    if (orders.length === 0) {
      // No orders yet, return products in original order
      return products;
    }

    // Count sales per product
    const salesCount = new Map<string, number>();
    orders.forEach((order) => {
      const count = salesCount.get(order.productName) || 0;
      salesCount.set(order.productName, count + 1);
    });

    // Sort products by sales count (descending), with stable tie-breaking
    return [...products].sort((a, b) => {
      const aCount = salesCount.get(a.name) || 0;
      const bCount = salesCount.get(b.name) || 0;
      
      if (bCount !== aCount) {
        return bCount - aCount; // Most-selling first
      }
      
      // Stable tie-breaker: maintain original order
      return products.indexOf(a) - products.indexOf(b);
    });
  }, [products, orders]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ShoppingCart className="w-8 h-8 text-primary" />
        <h2 className="text-3xl font-bold">Products</h2>
      </div>

      {sortedProducts.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ShoppingCart className="w-16 h-16 text-muted-foreground/50 mb-4" />
            <p className="text-lg text-muted-foreground text-center">
              No products available yet
            </p>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Check back later or contact the administrator
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProducts.map((product, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">{product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-primary">
                  ₹{product.price}
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => onOrder(product.name)}
                  className="w-full"
                  size="lg"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Order
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
