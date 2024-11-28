import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // تأكد من أن react-router-dom مثبتة
import { CartProvider } from './js/cartContext';
import Header from './js/header';
import Carousel from './js/carousel';
import Products from './js/products';
import Login from "./js/login"; 
import Designs from "./js/designs";
import "./css/home.css";

// عنصر الصفحة الرئيسية
const root = ReactDOM.createRoot(document.getElementById('root'));

function Home() {
  return (
    <div className='home'>
      <CartProvider> {/* لف المكونات بـ Provider */}
        <Header />
        <Carousel />
        <Designs />
        <Products />
      </CartProvider>
    </div>
  );
}

// صفحة تسجيل الدخول
function LoginPage(){
  return(
    <>
      <Login/>
    </>
  );
}

// صفحة التصاميم
function DesignsPage(){
  return(
    <>
      <Header/>
    </>
  );
}

// التوجيه بين الصفحات
root.render(
  <React.StrictMode>
    <Router> 
      <Routes> 
        <Route path="/" element={<Home />} /> {/* الصفحة الرئيسية */}
        <Route path="/login" element={<LoginPage />} /> {/* صفحة تسجيل الدخول */}
        <Route path="/designs" element={<DesignsPage />} /> {/* صفحة التصاميم */}
      </Routes>
    </Router>
  </React.StrictMode>
);