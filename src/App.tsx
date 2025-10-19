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
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Toaster } from './components/ui/sonner';

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
        <CartProvider>
          <Routes>
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
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
