import { useMemo, useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { ShoppingCart, Package, Search, Loader2 } from 'lucide-react';
import type { Product } from '../types/product';
import type { Order } from '../types/order';

interface ShopViewProps {
  products: Product[];
  onOrder: (productName: string) => void;
  orders: Order[];
  isLoading?: boolean;
}

export default function ShopView({ products, onOrder, orders, isLoading = false }: ShopViewProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Step 1: Sort products by most-selling (descending)
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

  // Step 2: Apply search filter to the already-sorted list
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) {
      return sortedProducts;
    }
    
    const lowerSearch = searchTerm.toLowerCase();
    return sortedProducts.filter((product) =>
      product.name.toLowerCase().includes(lowerSearch)
    );
  }, [sortedProducts, searchTerm]);

  const hasProducts = products.length > 0;
  const hasFilteredResults = filteredProducts.length > 0;

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <ShoppingCart className="w-8 h-8 text-primary" />
          <h2 className="text-3xl font-bold">Products</h2>
        </div>
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
            <p className="text-lg text-muted-foreground text-center">
              Loading products...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShoppingCart className="w-8 h-8 text-primary" />
          <h2 className="text-3xl font-bold">Products</h2>
        </div>

        {hasProducts && (
          <div className="relative w-full sm:w-auto sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        )}
      </div>

      {!hasProducts ? (
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
      ) : !hasFilteredResults ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="w-16 h-16 text-muted-foreground/50 mb-4" />
            <p className="text-lg text-muted-foreground text-center">
              No products found
            </p>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Try a different search term
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow overflow-hidden">
              {product.image ? (
                <div className="w-full h-48 overflow-hidden bg-muted">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-48 bg-muted flex items-center justify-center">
                  <Package className="w-16 h-16 text-muted-foreground/30" />
                </div>
              )}
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
