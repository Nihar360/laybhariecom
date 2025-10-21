import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Categories } from './components/Categories';
import { FeaturedProducts } from './components/FeaturedProducts';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { CategoryPage } from './pages/CategoryPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { OrderHistoryPage } from './pages/OrderHistoryPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Toaster } from './components/ui/sonner';

import { AdminAuthProvider } from './admin/contexts/AdminAuthContext';
import AdminAuthGuard from './admin/components/AdminAuthGuard';
import AdminLayout from './admin/components/AdminLayout';
import AdminLogin from './admin/pages/AdminLogin';
import AdminDashboard from './admin/pages/AdminDashboard';
import AccessDenied from './admin/pages/AccessDenied';

function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedProducts />
      <Newsletter />
    </>
  );
}

function Layout({ children, hideHeader = false }: { children: React.ReactNode; hideHeader?: boolean }) {
  return (
    <div className="min-h-screen">
      {!hideHeader && <Header />}
      <main>{children}</main>
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AdminAuthProvider>
          <CartProvider>
            <Routes>
              {/* Customer Routes */}
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              
              <Route
                path="/"
                element={
                  <Layout>
                    <HomePage />
                    <Footer />
                  </Layout>
                }
              />
              
              <Route
                path="/category/:categoryName"
                element={
                  <Layout>
                    <CategoryPage />
                  </Layout>
                }
              />
              
              <Route
                path="/product/:id"
                element={
                  <Layout>
                    <ProductDetailsPage />
                  </Layout>
                }
              />
              
              <Route
                path="/search"
                element={
                  <Layout>
                    <SearchResultsPage />
                  </Layout>
                }
              />
              
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Layout hideHeader>
                      <CheckoutPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/order-success/:orderNumber"
                element={
                  <ProtectedRoute>
                    <Layout hideHeader>
                      <OrderSuccessPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <OrderHistoryPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/access-denied" element={<AccessDenied />} />
              
              <Route
                path="/admin"
                element={
                  <AdminAuthGuard>
                    <AdminLayout />
                  </AdminAuthGuard>
                }
              >
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<div className="text-center py-8">Users page - Coming soon</div>} />
                <Route path="orders" element={<div className="text-center py-8">Orders page - Coming soon</div>} />
                <Route path="products" element={<div className="text-center py-8">Products page - Coming soon</div>} />
                <Route path="coupons" element={<div className="text-center py-8">Coupons page - Coming soon</div>} />
                <Route path="analytics" element={<div className="text-center py-8">Analytics page - Coming soon</div>} />
                <Route path="notifications" element={<div className="text-center py-8">Notifications page - Coming soon</div>} />
                <Route path="settings" element={<div className="text-center py-8">Settings page - Coming soon</div>} />
              </Route>
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </CartProvider>
        </AdminAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
