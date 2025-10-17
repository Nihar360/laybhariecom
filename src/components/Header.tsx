import { Search, User, Menu, Heart } from 'lucide-react';
import { Input } from './ui/input';
import { CartDrawer } from './CartDrawer';
import { useNavigation } from '../contexts/NavigationContext';

export function Header() {
  const { navigateTo } = useNavigation();

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

          <button onClick={() => navigateTo('home')}>
            <h1 className="text-2xl cursor-pointer">SPICE HOUSE</h1>
          </button>

          {/* Search bar - hidden on mobile */}
          <div className="hidden md:flex items-center flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for products..."
                className="pl-10 w-full"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="hidden sm:block hover:text-gray-600">
              <Heart className="w-6 h-6" />
            </button>
            <button className="hover:text-gray-600">
              <User className="w-6 h-6" />
            </button>
            <CartDrawer />
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center justify-center gap-8 py-4 border-t">
          <button onClick={() => navigateTo('home')} className="hover:text-gray-600">New Arrivals</button>
          <button onClick={() => navigateTo('category', { category: 'Masala Blends' })} className="hover:text-gray-600">Masala Blends</button>
          <button onClick={() => navigateTo('category', { category: 'Single Spices' })} className="hover:text-gray-600">Single Spices</button>
          <button onClick={() => navigateTo('category', { category: 'Whole Spices' })} className="hover:text-gray-600">Whole Spices</button>
          <button onClick={() => navigateTo('category', { category: 'Herbs & Aromatics' })} className="hover:text-gray-600">Herbs & Aromatics</button>
          <button className="text-red-600">Sale</button>
        </nav>
      </div>
    </header>
  );
}
