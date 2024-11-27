import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // تأكد من أن react-router-dom مثبتة

import Header from './js/header';
import Carousel from './js/carousel';
import Products from './js/products';
import Login from "./js/login"; 
import Designs from "./js/designs";
import "./css/home.css";

const root = ReactDOM.createRoot(document.getElementById('root'));

function Home() {
  return (
    <div className='home'>
      <Header />
      <Carousel />
      <Designs />
      <Products />
    </div>
  );
}
function LoginPage(){
  return(
  <>
    <Login/>
  </>
  )
}
function DesignsPage(){
  return(
    <>
      <Header/>
    </>
  )
}

root.render(
  <React.StrictMode>
    <Router> 
      <Routes> 
        <Route path="/" element={<Home />} /> {/* الصفحة الرئيسية */}
        <Route path="/login" element={<LoginPage />} /> {/* صفحة تسجيل الدخول */}
      </Routes>
    </Router>
  </React.StrictMode>
);