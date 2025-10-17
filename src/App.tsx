import { CartProvider } from "./contexts/CartContext";
import {
  NavigationProvider,
  useNavigation,
} from "./contexts/NavigationContext";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Categories } from "./components/Categories";
import { FeaturedProducts } from "./components/FeaturedProducts";
import { Newsletter } from "./components/Newsletter";
import { Footer } from "./components/Footer";
import { CategoryPage } from "./pages/CategoryPage";
import { ProductDetailsPage } from "./pages/ProductDetailsPage";
import { Toaster } from "./components/ui/sonner";

function AppContent() {
  const { currentPage } = useNavigation();

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <>
            <Hero />
            <Categories />
            <FeaturedProducts />
            <Newsletter />
          </>
        );
      case "category":
        return <CategoryPage />;
      case "product":
        return <ProductDetailsPage />;
      default:
        return (
          <>
            <Hero />
            <Categories />
            <FeaturedProducts />
            <Newsletter />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main>{renderPage()}</main>
      {currentPage === "home" && <Footer />}
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <NavigationProvider>
        <AppContent />
      </NavigationProvider>
    </CartProvider>
  );
}