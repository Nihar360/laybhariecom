import { Search, User, Menu, Heart, LogOut, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from './ui/input';
import { CartDrawer } from './CartDrawer';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { productsService } from '../api';
import type { Product } from '../types/api';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function Header() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    let isCurrent = true;

    const searchProducts = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        setShowSuggestions(false);
        return;
      }

      try {
        const response = await productsService.searchProducts(searchQuery.trim());
        if (isCurrent && response.success && response.data) {
          setSearchResults(response.data.slice(0, 5));
          setShowSuggestions(true);
        }
      } catch (error) {
        if (isCurrent) {
          console.error('Search error:', error);
          setSearchResults([]);
        }
      }
    };

    const debounceTimer = setTimeout(searchProducts, 300);
    
    return () => {
      isCurrent = false;
      clearTimeout(debounceTimer);
    };
  }, [searchQuery]);

  const handleProductClick = (productId: number) => {
    setShowSuggestions(false);
    setSearchQuery('');
    navigate(`/product/${productId}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSuggestions(false);
  };

  return (
    <header className="border-b sticky top-0 bg-white z-50">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between py-2 text-sm border-b">
          <p className="text-gray-600">Free shipping on orders over $25 | Fresh spices delivered</p>
          <div className="flex gap-4">
            <button className="text-gray-600 hover:text-black">Help</button>
            <button className="text-gray-600 hover:text-black">Track Order</button>
          </div>
        </div>

        {/* Main header */}
        <div className="flex items-center justify-between py-4">
          <button className="lg:hidden">
            <Menu className="w-6 h-6" />
          </button>

          <Link to="/">
            <h1 className="text-2xl cursor-pointer">SPICE HOUSE</h1>
          </Link>

          {/* Search bar - hidden on mobile */}
          <div className="hidden md:flex items-center flex-1 max-w-xl mx-8" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for products..."
                className="pl-10 pr-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && searchResults.length > 0 && setShowSuggestions(true)}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              
              {showSuggestions && searchResults.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                  {searchResults.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleProductClick(product.id)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b last:border-b-0"
                    >
                      <img
                        src={product.images[0] || '/placeholder.png'}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 text-left">
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-sm text-gray-600">${product.price.toFixed(2)}</p>
                      </div>
                      {!product.inStock && (
                        <span className="text-xs bg-gray-500 text-white px-2 py-1 rounded">
                          Out of Stock
                        </span>
                      )}
                    </button>
                  ))}
                  {searchQuery.trim().length >= 2 && (
                    <button
                      onClick={handleSearchSubmit}
                      className="w-full p-3 text-sm text-center text-primary hover:bg-gray-50 font-medium"
                    >
                      View all results for "{searchQuery}"
                    </button>
                  )}
                </div>
              )}
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="hidden sm:block hover:text-gray-600">
              <Heart className="w-6 h-6" />
            </button>
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hover:text-gray-600 flex items-center gap-2">
                    <User className="w-6 h-6" />
                    <span className="hidden md:inline text-sm">{user?.fullName}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/orders')}>
                    My Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button onClick={() => navigate('/login')} className="hover:text-gray-600">
                <User className="w-6 h-6" />
              </button>
            )}
            <CartDrawer />
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center justify-center gap-8 py-4 border-t">
          <Link to="/" className="hover:text-gray-600">New Arrivals</Link>
          <Link to="/category/Masalas" className="hover:text-gray-600">Masalas</Link>
          <Link to="/category/Mixes" className="hover:text-gray-600">Mixes</Link>
          <button className="text-red-600">Sale</button>
        </nav>
      </div>
    </header>
  );
}
