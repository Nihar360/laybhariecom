import { Search, User, Menu, Heart, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from './ui/input';
import { CartDrawer } from './CartDrawer';
import { useAuth } from '../contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function Header() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

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
