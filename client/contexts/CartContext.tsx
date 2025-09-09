import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartResponse } from '@shared/api';

interface CartContextType {
  cartData: CartResponse | null;
  itemCount: number;
  addToCart: (plantId: string, quantity?: number) => Promise<void>;
  removeFromCart: (plantId: string) => Promise<void>;
  updateQuantity: (plantId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartData, setCartData] = useState<CartResponse | null>(null);
  const [itemCount, setItemCount] = useState(0);

  const refreshCart = async () => {
    try {
      const response = await fetch('/api/cart', {
        headers: {
          'session-id': 'default'
        }
      });
      if (response.ok) {
        const data: CartResponse = await response.json();
        setCartData(data);
        setItemCount(data.itemCount);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const addToCart = async (plantId: string, quantity: number = 1) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'session-id': 'default'
        },
        body: JSON.stringify({ plantId, quantity })
      });

      if (response.ok) {
        const data: CartResponse = await response.json();
        setCartData(data);
        setItemCount(data.itemCount);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const removeFromCart = async (plantId: string) => {
    try {
      const response = await fetch(`/api/cart/${plantId}`, {
        method: 'DELETE',
        headers: {
          'session-id': 'default'
        }
      });

      if (response.ok) {
        const data: CartResponse = await response.json();
        setCartData(data);
        setItemCount(data.itemCount);
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateQuantity = async (plantId: string, quantity: number) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'session-id': 'default'
        },
        body: JSON.stringify({ plantId, quantity })
      });

      if (response.ok) {
        const data: CartResponse = await response.json();
        setCartData(data);
        setItemCount(data.itemCount);
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: {
          'session-id': 'default'
        }
      });

      if (response.ok) {
        const data: CartResponse = await response.json();
        setCartData(data);
        setItemCount(data.itemCount);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const value: CartContextType = {
    cartData,
    itemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    refreshCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
