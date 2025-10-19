import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { productsService } from '@/api';
import type { Category } from '@/types/api';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await productsService.getAllCategories();
        if (response.success && response.data) {
          setCategories(response.data);
        } else {
          toast.error(response.message || 'Failed to load categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl mb-4">Shop by Category</h2>
          <p className="text-gray-600">Browse our wide range of products</p>
        </div>
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No categories available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.name}`}
                className="group relative overflow-hidden rounded-lg cursor-pointer block"
              >
                <ImageWithFallback
                  src={category.image || 'https://via.placeholder.com/400x300?text=Category'}
                  alt={category.name}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-white text-xl mb-1">{category.name}</h3>
                  <p className="text-gray-200 text-sm">{category.description || ''}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
