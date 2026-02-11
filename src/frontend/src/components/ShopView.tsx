import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '../types/product';

interface ShopViewProps {
  products: Product[];
  onOrder: (productName: string) => void;
}

export default function ShopView({ products, onOrder }: ShopViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ShoppingCart className="w-8 h-8 text-primary" />
        <h2 className="text-3xl font-bold">Products</h2>
      </div>

      {products.length === 0 ? (
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
          {products.map((product, index) => (
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
