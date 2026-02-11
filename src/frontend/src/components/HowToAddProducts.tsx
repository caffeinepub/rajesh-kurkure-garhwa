import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Plus, CheckCircle } from 'lucide-react';

export default function HowToAddProducts() {
  return (
    <Card className="border-accent/40 bg-accent/5">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Info className="w-5 h-5 text-primary" />
          How to Add Products
        </CardTitle>
        <CardDescription>
          Quick guide for managing shop inventory
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <h4 className="font-semibold text-sm text-foreground/90">Steps to Add a Product:</h4>
          <ol className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="font-semibold text-primary min-w-[1.5rem]">1.</span>
              <span>Enter the <strong>Product Name</strong> in the first field</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-primary min-w-[1.5rem]">2.</span>
              <span>Enter the <strong>Price (₹)</strong> in the second field</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-primary min-w-[1.5rem]">3.</span>
              <span>Click the <strong className="inline-flex items-center gap-1"><Plus className="w-3 h-3 inline" />Add Product</strong> button</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-primary min-w-[1.5rem]">4.</span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-600" />
                Verify the product appears in the Products list above
              </span>
            </li>
          </ol>
        </div>

        <Alert className="bg-muted/50 border-muted">
          <AlertDescription className="text-xs text-muted-foreground">
            <strong>Tip:</strong> Make sure to enter accurate product names and prices. 
            Products will be immediately visible to all customers in the shop.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
