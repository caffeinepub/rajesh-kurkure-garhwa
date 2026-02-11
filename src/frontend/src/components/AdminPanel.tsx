import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Plus } from 'lucide-react';
import type { Product } from '../types/product';

interface AdminPanelProps {
  onAddProduct: (product: Product) => void;
}

export default function AdminPanel({ onAddProduct }: AdminPanelProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate fields
    if (!name.trim() || !price.trim()) {
      setError('Please fill in all fields');
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setError('Please enter a valid price');
      return;
    }

    // Add product
    onAddProduct({ name: name.trim(), price: price.trim() });
    setSuccess('Product added successfully!');
    setName('');
    setPrice('');

    // Clear success message after 3 seconds
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <Card className="border-primary/20 shadow-lg">
      <CardHeader className="bg-primary/5">
        <CardTitle className="text-2xl flex items-center gap-2">
          <Plus className="w-6 h-6" />
          Add Product (Admin)
        </CardTitle>
        <CardDescription>
          Add new products to the shop inventory
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 text-green-900 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="productName">Product Name</Label>
            <Input
              id="productName"
              type="text"
              placeholder="Enter product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="productPrice">Price (₹)</Label>
            <Input
              id="productPrice"
              type="number"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full"
              step="0.01"
              min="0"
            />
          </div>

          <Button type="submit" className="w-full" size="lg">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
