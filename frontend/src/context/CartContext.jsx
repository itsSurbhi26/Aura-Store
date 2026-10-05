import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cartItems');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const addItem = (product, quantity = 1) => {
    if (!product || !product.id && !product._id) return;
    const productId = product.id || product._id;

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => (item.product.id || item.product._id) === productId
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        const newQty = updated[existingIndex].quantity + quantity;
        const maxStock = product.countInStock || 255;
        updated[existingIndex].quantity = Math.min(newQty, maxStock);
        return updated;
      } else {
        return [...prevItems, { product, quantity: Math.min(quantity, product.countInStock || 255) }];
      }
    });

    showToast(`"${product.name}" added to cart!`);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        const id = item.product.id || item.product._id;
        if (id === productId) {
          const maxStock = item.product.countInStock || 255;
          return { ...item, quantity: Math.min(newQuantity, maxStock) };
        }
        return item;
      })
    );
  };

  const removeItem = (productId) => {
    setCartItems((prevItems) => {
      const itemToRemove = prevItems.find((item) => (item.product.id || item.product._id) === productId);
      if (itemToRemove) {
        showToast(`Removed "${itemToRemove.product.name}" from cart`, 'info');
      }
      return prevItems.filter((item) => (item.product.id || item.product._id) !== productId);
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.product.price || 0;
    return acc + price * item.quantity;
  }, 0);

  const value = {
    cartItems,
    totalItems,
    subtotal,
    toast,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    showToast,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
