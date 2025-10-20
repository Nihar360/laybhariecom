import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { productsService } from '@/api';
import type { Product } from '@/types/api';
import { ProductCard } from '@/components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Search } from 'lucide-react';

export function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query.trim()) {
        setProducts([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await productsService.searchProducts(query);
        if (response.success && response.data) {
          setProducts(response.data);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error('Search error:', error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  if (!query.trim()) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Search className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Search for Products</h2>
        <p className="text-gray-600 mb-6">Start typing in the search box to find products</p>
        <Link to="/" className="text-primary hover:underline">
          Go back to homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Search Results for "{query}"
        </h1>
        {!isLoading && (
          <p className="text-gray-600">
            {products.length === 0
              ? 'No products found'
              : `Found ${products.length} product${products.length !== 1 ? 's' : ''}`}
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              originalPrice={product.originalPrice}
              image={product.images[0] || '/placeholder.png'}
              rating={product.rating}
              reviews={product.reviews}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Search className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
          <p className="text-gray-600 mb-6">
            We couldn't find any products matching "{query}". Try searching with different keywords.
          </p>
          <Link
            to="/"
            className="inline-block bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition"
          >
            Continue Shopping
          </Link>
        </div>
      )}
    </div>
  );
}
