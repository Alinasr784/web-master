// cartContext.js
import React, { createContext, useState, useContext } from "react";

// إنشاء Context للسلة
const CartContext = createContext();

// إنشاء Provider للسلة
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // دالة لإضافة منتج إلى السلة
  const addToCart = (productId) => {
    // تحقق من إذا كان المنتج موجودًا بالفعل في السلة
    setCart((prevCart) => {
      if (prevCart.includes(productId)) {
        return prevCart; // إذا كان موجودًا، لا تضيفه مرة أخرى
      }
      return [...prevCart, productId];
    });
  };
  const removeFromCart = (productId)=>{
    setCart((prevCart) => {
      return prevCart.filter((item) => item !== productId);
    });
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

// دالة لاستهلاك البيانات من الـ Context
export const useCart = () => useContext(CartContext);
