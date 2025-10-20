import { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import { productsService } from '@/api';
import type { Product } from '@/types/api';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productsService.getAllProducts();
        if (response.success && response.data) {
          setProducts(response.data);
        } else {
          toast.error('Failed to load products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl mb-4">Our All Products</h2>
          <p className="text-gray-600">Discover our handpicked selection of authentic Indian spices</p>
        </div>
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No products available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                originalPrice={product.originalPrice}
                image={product.images[0] || ''}
                rating={product.rating}
                reviews={product.reviews}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
