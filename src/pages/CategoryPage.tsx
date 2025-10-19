import { useState, useEffect } from 'react';
import { useNavigation } from '../contexts/NavigationContext';
import { ProductCard } from '../components/ProductCard';
import { productsService } from '@/api';
import type { Product } from '@/types/api';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

export function CategoryPage() {
  const { pageData, goBack, navigateTo } = useNavigation();
  const categoryName = pageData?.category || 'All Products';
  
  const [sortBy, setSortBy] = useState('featured');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = categoryName === 'All Products'
          ? await productsService.getAllProducts()
          : await productsService.getProductsByCategory(categoryName);
        
        if (response.success && response.data) {
          setProducts(response.data);
        } else {
          toast.error(response.message || 'Failed to load products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName]);

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const handleProductClick = (productId: number) => {
    navigateTo('product', { productId });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-gray-600 hover:text-black mb-4"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl mb-2">{categoryName}</h1>
              <p className="text-gray-600">{sortedProducts.length} products</p>
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name">Name: A to Z</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No products found in this category.</p>
            <Button onClick={goBack}>Go Back</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <div key={product.id} onClick={() => handleProductClick(product.id)}>
                <ProductCard
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  image={product.images[0] || ''}
                  rating={product.rating}
                  reviews={product.reviews}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
