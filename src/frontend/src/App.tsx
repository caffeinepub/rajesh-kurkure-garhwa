import { useState, useEffect, useRef } from 'react';
import LoginView from './components/LoginView';
import ShopView from './components/ShopView';
import AdminPanel from './components/AdminPanel';
import OrdersPanel from './components/OrdersPanel';
import { useProducts } from './hooks/useProducts';
import { useOrders, ORDERS_KEY } from './hooks/useOrders';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { Phone } from 'lucide-react';

type UserRole = 'guest' | 'customer' | 'admin';

function App() {
  const [userRole, setUserRole] = useState<UserRole>('guest');
  const [username, setUsername] = useState<string>('');
  const [orderMessage, setOrderMessage] = useState<string>('');
  const { products, addProduct, updateProduct, deleteProduct, isLoading, error } = useProducts();
  const { orders, addOrder, clearOrders } = useOrders();
  
  // Track previous order count for detecting new orders
  const prevOrderCountRef = useRef<number>(0);
  const isInitialLoadRef = useRef<boolean>(true);

  const handleLogin = (role: UserRole, loginUsername: string) => {
    setUserRole(role);
    setUsername(loginUsername);
  };

  const handleOrder = (productName: string) => {
    // Save order to localStorage with customer name
    addOrder(productName, username);
    
    // Show confirmation message
    setOrderMessage(`Order placed for ${productName}`);
    setTimeout(() => setOrderMessage(''), 3000);
  };

  // Handle product fetch errors
  useEffect(() => {
    if (error) {
      toast.error('Failed to load products. Please refresh the page.');
    }
  }, [error]);

  // Detect new orders in same tab (via state changes)
  useEffect(() => {
    // Skip initial load
    if (isInitialLoadRef.current) {
      prevOrderCountRef.current = orders.length;
      isInitialLoadRef.current = false;
      return;
    }

    // Check if new orders were added
    if (orders.length > prevOrderCountRef.current && userRole === 'admin') {
      const newOrdersCount = orders.length - prevOrderCountRef.current;
      const latestOrder = orders[0]; // Newest first
      
      if (latestOrder) {
        toast.success(
          `New order received: ${latestOrder.productName}${
            latestOrder.customerName ? ` from ${latestOrder.customerName}` : ''
          }`,
          {
            duration: 5000,
          }
        );
      }
    }

    prevOrderCountRef.current = orders.length;
  }, [orders, userRole]);

  // Detect new orders from other tabs (via storage event)
  useEffect(() => {
    if (userRole !== 'admin') return;

    const handleStorageChange = (e: StorageEvent) => {
      // Only listen to orders key changes
      if (e.key !== ORDERS_KEY) return;
      
      // Parse new orders
      try {
        const newOrders = e.newValue ? JSON.parse(e.newValue) : [];
        const oldOrders = e.oldValue ? JSON.parse(e.oldValue) : [];
        
        // Check if orders were added (not cleared)
        if (Array.isArray(newOrders) && newOrders.length > oldOrders.length) {
          const latestOrder = newOrders[0]; // Newest first
          
          if (latestOrder) {
            toast.success(
              `New order received: ${latestOrder.productName}${
                latestOrder.customerName ? ` from ${latestOrder.customerName}` : ''
              }`,
              {
                duration: 5000,
              }
            );
          }
        }
      } catch (error) {
        console.error('Failed to parse storage event:', error);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [userRole]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Toaster />
      
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-4">
            <img 
              src="/assets/generated/rajesh-kurkure-garhwa-logo-from-upload.dim_256x256.png" 
              alt="RAJESH KURKURE GARHWA logo" 
              className="w-12 h-12 object-contain"
            />
            <h1 className="text-2xl md:text-3xl font-bold text-center">
              RAJESH KURKURE GARHWA
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {userRole === 'guest' ? (
          <LoginView onLogin={handleLogin} />
        ) : (
          <div className="space-y-8">
            {/* Order Confirmation Message */}
            {orderMessage && (
              <div className="bg-accent text-accent-foreground px-6 py-4 rounded-lg shadow-md border-l-4 border-primary animate-in slide-in-from-top">
                <p className="font-medium">{orderMessage}</p>
              </div>
            )}

            {/* Shop View */}
            <ShopView products={products} onOrder={handleOrder} orders={orders} isLoading={isLoading} />

            {/* Admin-Only Sections */}
            {userRole === 'admin' && (
              <>
                {/* Orders Panel */}
                <OrdersPanel orders={orders} onClearOrders={clearOrders} />
                
                {/* Admin Panel */}
                <AdminPanel 
                  products={products}
                  onAddProduct={addProduct}
                  onUpdateProduct={updateProduct}
                  onDeleteProduct={deleteProduct}
                />
              </>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-muted/30 border-t mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-center gap-3 text-sm text-muted-foreground">
            <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4">
              <p className="flex items-center gap-2">
                © {new Date().getFullYear()} RAJESH KURKURE GARHWA
              </p>
              <p className="flex items-center gap-1">
                Built with <span className="text-destructive">♥</span> using{' '}
                <a
                  href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium hover:text-foreground transition-colors underline"
                >
                  caffeine.ai
                </a>
              </p>
            </div>
            <p className="flex items-center gap-2 font-medium text-foreground">
              <Phone className="w-4 h-4" />
              Mobile: 9973279335
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
