import { ImageWithFallback } from './figma/ImageWithFallback';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Badge } from './ui/badge';
import { useNavigation } from '../contexts/NavigationContext';
import { useCart } from '../contexts/CartContext';
import { toast } from 'sonner@2.0.3';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  badge?: string;
}

export function ProductCard({ 
  id,
  name, 
  price, 
  originalPrice, 
  image, 
  rating, 
  reviews,
  badge 
}: ProductCardProps) {
  const { navigateTo } = useNavigation();
  const { addToCart } = useCart();
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({ id, name, price, image });
    toast.success('Added to cart!');
  };

  return (
    <Card 
      className="group overflow-hidden border-0 shadow-sm hover:shadow-xl transition-shadow cursor-pointer"
      onClick={() => navigateTo('product', { productId: id })}
    >
      <div className="relative overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={name}
          className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {badge && (
          <Badge className="absolute top-3 left-3 bg-red-600 hover:bg-red-700">
            {badge}
          </Badge>
        )}
        {discount > 0 && (
          <Badge className="absolute top-3 right-3 bg-black hover:bg-gray-800">
            -{discount}%
          </Badge>
        )}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              toast.success('Added to wishlist!');
            }}
            className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100"
          >
            <Heart className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="mb-2 line-clamp-2">{name}</h3>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">({reviews})</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">${price}</span>
            {originalPrice && (
              <span className="text-gray-400 line-through text-sm">
                ${originalPrice}
              </span>
            )}
          </div>
        </div>
        <Button 
          className="w-full mt-4 bg-black hover:bg-gray-800"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </div>
    </Card>
  );
}
