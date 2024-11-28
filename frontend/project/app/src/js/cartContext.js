// CartContext.js
import React, { createContext, useState, useContext } from 'react';

// إنشاء Context للسلة
const CartContext = createContext();

// إنشاء Provider للسلة
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // دالة لإضافة منتج إلى السلة
  const addToCart = (productId) => {
    setCart((prevCart) => [...prevCart, productId]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

// دالة لاستهلاك البيانات من الـ Context
export const useCart = () => useContext(CartContext);