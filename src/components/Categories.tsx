import { ImageWithFallback } from './figma/ImageWithFallback';
import { useNavigation } from '../contexts/NavigationContext';
import { categories } from '../data/products';

export function Categories() {
  const { navigateTo } = useNavigation();

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl mb-4">Shop by Category</h2>
          <p className="text-gray-600">Browse our wide range of products</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.name}
              className="group relative overflow-hidden rounded-lg cursor-pointer"
              onClick={() => navigateTo('category', { category: category.name })}
            >
              <ImageWithFallback
                src={category.image}
                alt={category.name}
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-white text-xl mb-1">{category.name}</h3>
                <p className="text-gray-200 text-sm">{category.count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
