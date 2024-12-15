// cartContext.js
import React, { createContext, useState, useContext } from "react";

// إنشاء Context للسلة
const WishContext = createContext();

// إنشاء Provider للسلة
export const WishProvider = ({ children }) => {
  const [wish, setWish] = useState([]);

  // دالة لإضافة منتج إلى السلة
  const addToWish = (productId) => {
    // تحقق من إذا كان المنتج موجودًا بالفعل في السلة
    setWish((prevWish) => {
      if (prevWish.includes(productId)) {
        return prevWish; // إذا كان موجودًا، لا تضيفه مرة أخرى
      }
      return [...prevWish, productId];
    });
  };
  const removeFromWish = (productId)=>{
    setWish((prevWish) => {
      return prevWish.filter((item) => item !== productId);
    });
  }

  return (
    <WishContext.Provider value={{ wish, addToWish, removeFromWish }}>
      {children}
    </WishContext.Provider>
  );
};

// دالة لاستهلاك البيانات من الـ Context
export const useWish = () => useContext(WishContext);
