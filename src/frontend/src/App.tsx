import { useState } from 'react';
import LoginView from './components/LoginView';
import ShopView from './components/ShopView';
import AdminPanel from './components/AdminPanel';
import OrdersPanel from './components/OrdersPanel';
import { useProducts } from './hooks/useProducts';
import { useOrders } from './hooks/useOrders';
import { Toaster } from '@/components/ui/sonner';

type UserRole = 'guest' | 'customer' | 'admin';

function App() {
  const [userRole, setUserRole] = useState<UserRole>('guest');
  const [username, setUsername] = useState<string>('');
  const [orderMessage, setOrderMessage] = useState<string>('');
  const { products, addProduct } = useProducts();
  const { orders, addOrder, clearOrders } = useOrders();

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
            <ShopView products={products} onOrder={handleOrder} orders={orders} />

            {/* Admin-Only Sections */}
            {userRole === 'admin' && (
              <>
                {/* Orders Panel */}
                <OrdersPanel orders={orders} onClearOrders={clearOrders} />
                
                {/* Admin Panel */}
                <AdminPanel onAddProduct={addProduct} />
              </>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-muted/30 border-t mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
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
        </div>
      </footer>
    </div>
  );
}

export default App;
