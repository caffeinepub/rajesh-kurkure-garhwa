import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ShoppingBag, Clock, Package, Trash2, User } from 'lucide-react';
import { toast } from 'sonner';
import type { Order } from '../types/order';

interface OrdersPanelProps {
  orders: Order[];
  onClearOrders: () => void;
}

export default function OrdersPanel({ orders, onClearOrders }: OrdersPanelProps) {
  const [isClearing, setIsClearing] = useState(false);

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleClearOrders = async () => {
    setIsClearing(true);
    try {
      onClearOrders();
      toast.success('Order history cleared successfully');
    } catch (error) {
      toast.error('Failed to clear order history');
      console.error('Clear orders error:', error);
    } finally {
      setIsClearing(false);
    }
  };

  // Group orders by customer
  const ordersByCustomer = orders.reduce((acc, order) => {
    const customerName = order.customerName || 'Unknown customer';
    if (!acc[customerName]) {
      acc[customerName] = [];
    }
    acc[customerName].push(order);
    return acc;
  }, {} as Record<string, Order[]>);

  const customerNames = Object.keys(ordersByCustomer).sort();

  return (
    <Card className="border-accent/40 shadow-lg">
      <CardHeader className="bg-accent/5">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <ShoppingBag className="w-6 h-6" />
              Customer Orders (Admin)
            </CardTitle>
            <CardDescription>
              View all orders placed by customers
            </CardDescription>
          </div>
          {orders.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled={isClearing}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear History
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear Order History?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all order records. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleClearOrders}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Clear All Orders
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {orders.length === 0 ? (
          <Alert className="bg-muted/50 border-muted">
            <Package className="h-4 w-4" />
            <AlertDescription>
              No orders yet. Orders will appear here when customers place them.
            </AlertDescription>
          </Alert>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-6">
              {customerNames.map((customerName) => (
                <div key={customerName} className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground border-b pb-2">
                    <User className="w-4 h-4" />
                    {customerName}
                    <span className="ml-auto text-xs">
                      ({ordersByCustomer[customerName].length} {ordersByCustomer[customerName].length === 1 ? 'order' : 'orders'})
                    </span>
                  </div>
                  <div className="space-y-2 pl-2">
                    {ordersByCustomer[customerName].map((order, index) => (
                      <div
                        key={`${order.createdAt}-${index}`}
                        className="flex items-start justify-between gap-4 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                      >
                        <div className="flex-1 space-y-1">
                          <p className="font-medium text-foreground">
                            {order.productName}
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          #{orders.indexOf(order) + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
