import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { cartService } from '@/api';
import { authService } from '@/api';
import type { CartItem as APICartItem, CartItemRequest } from '@/types/api';
import { toast } from 'sonner';

// Local cart item interface for compatibility
export interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
  subtotal: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItemRequest) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Convert API cart item to local cart item format
  const convertCartItem = (apiItem: APICartItem): CartItem => ({
    id: apiItem.id,
    productId: apiItem.productId,
    name: apiItem.productName,
    price: apiItem.price,
    image: apiItem.image,
    quantity: apiItem.quantity,
    size: apiItem.size,
    color: apiItem.color,
    subtotal: apiItem.subtotal,
  });

  // Fetch cart items from backend
  const refreshCart = async () => {
    if (!authService.isAuthenticated()) {
      setCart([]);
      return;
    }

    try {
      const response = await cartService.getCartItems();
      if (response.success && response.data) {
        const convertedCart = response.data.map(convertCartItem);
        setCart(convertedCart);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      // If unauthorized, clear cart
      if ((error as any)?.response?.status === 401) {
        setCart([]);
      }
    }
  };

  // Load cart on mount and refresh on auth state changes
  useEffect(() => {
    refreshCart();
    
    // Listen for auth changes (same-tab via custom event)
    const handleAuthChange = () => {
      refreshCart();
    };
    
    // Listen for storage events to detect auth changes (cross-tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_token') {
        refreshCart();
      }
    };
    
    window.addEventListener('auth-changed', handleAuthChange);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('auth-changed', handleAuthChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const addToCart = async (item: CartItemRequest) => {
    if (!authService.isAuthenticated()) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      const response = await cartService.addToCart(item);
      if (response.success && response.data) {
        // Refresh cart to get updated state
        await refreshCart();
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
      throw error;
    }
  };

  const removeFromCart = async (cartItemId: number) => {
    if (!authService.isAuthenticated()) {
      return;
    }

    try {
      const response = await cartService.removeCartItem(cartItemId);
      if (response.success) {
        // Refresh cart to get updated state
        await refreshCart();
        toast.success('Item removed from cart');
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item');
    }
  };

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    if (!authService.isAuthenticated()) {
      return;
    }

    if (quantity <= 0) {
      await removeFromCart(cartItemId);
      return;
    }

    try {
      const response = await cartService.updateCartItem(cartItemId, quantity);
      if (response.success) {
        // Refresh cart to get updated state
        await refreshCart();
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  const clearCart = async () => {
    if (!authService.isAuthenticated()) {
      setCart([]);
      return;
    }

    try {
      const response = await cartService.clearCart();
      if (response.success) {
        setCart([]);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.subtotal, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
