import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { productsService } from '@/api';
import type { Product } from '@/types/api';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ChevronLeft, Star, Heart, Share2, Truck, Shield, RefreshCw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

export function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await productsService.getProductById(parseInt(id));
        if (response.success && response.data) {
          setProduct(response.data);
          // Set default size if available
          if (response.data.sizes && response.data.sizes.length > 0) {
            setSelectedSize(response.data.sizes[0]);
          }
          // Set default color if available
          if (response.data.colors && response.data.colors.length > 0) {
            setSelectedColor(response.data.colors[0]);
          }
        } else {
          toast.error('Product not found');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Product not found</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : ['https://via.placeholder.com/800x800?text=No+Image'];
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      toast.error('Please select a color');
      return;
    }

    try {
      await addToCart({
        productId: product.id,
        quantity: quantity,
        size: selectedSize || undefined,
        color: selectedColor || undefined,
      });
      toast.success('Added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }

    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      toast.error('Please select a color');
      return;
    }

    try {
      await addToCart({
        productId: product.id,
        quantity: quantity,
        size: selectedSize || undefined,
        color: selectedColor || undefined,
      });
      navigate('/checkout');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4 border-b">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-black"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Shopping
        </button>
      </div>

      {/* Product Details */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
              <ImageWithFallback
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {discount > 0 && (
                <Badge className="absolute top-4 right-4 bg-black hover:bg-gray-800">
                  -{discount}%
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-4 gap-4">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-black' : 'border-gray-200'
                  }`}
                >
                  <ImageWithFallback
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge className="mb-2 bg-black/10 text-black hover:bg-black/20">
                {product.category}
              </Badge>
              <h1 className="text-4xl mb-4">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-gray-600">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl">₹{product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-xl text-gray-400 line-through">
                  ₹{product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div>
              {product.inStock ? (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                  In Stock ({product.stockCount} available)
                </Badge>
              ) : (
                <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
                  Out of Stock
                </Badge>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed">{product.description}</p>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-3">
                <label className="text-sm font-medium">Size</label>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-2 border rounded-lg transition-all ${
                        selectedSize === size
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 hover:border-black'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-3">
                <label className="text-sm font-medium">Color</label>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-6 py-2 border rounded-lg transition-all ${
                        selectedColor === color
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 hover:border-black'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Quantity</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100"
                  disabled={!product.inStock}
                >
                  -
                </button>
                <span className="w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                  className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100"
                  disabled={!product.inStock}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                className="flex-1"
                size="lg"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                Add to Cart
              </Button>
              <Button
                className="flex-1 bg-black hover:bg-gray-800"
                size="lg"
                onClick={handleBuyNow}
                disabled={!product.inStock}
              >
                Buy Now
              </Button>
              <Button variant="outline" size="lg" className="px-4">
                <Heart className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" className="px-4">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="flex items-center gap-3">
                <Truck className="w-8 h-8 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">Free Shipping</p>
                  <p className="text-xs text-gray-500">On orders over ₹500</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">Secure Payment</p>
                  <p className="text-xs text-gray-500">100% protected</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RefreshCw className="w-8 h-8 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">Easy Returns</p>
                  <p className="text-xs text-gray-500">Within 30 days</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="description" className="mt-12">
          <TabsList className="grid w-full max-w-xl grid-cols-2">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({product.reviews})</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="space-y-4 mt-6">
            <div>
              <h3 className="text-xl mb-4">Product Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>
            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="text-xl mb-4">Key Features</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
            <div className="text-center py-12 text-gray-500">
              <p>No reviews yet. Be the first to review this product!</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
