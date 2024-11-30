import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import { CartProvider } from './js/cartContext';
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
  );
}

function DesignsPage(){
  return(
    <div>
      <Header />
    </div>
  );
}

root.render(
  <React.StrictMode>
    <CartProvider>
      <Router> 
        <Routes> 
          <Route path="/" element={<Home />} /> 
          <Route path="/login" element={<LoginPage />} /> 
          <Route path="/designs" element={<DesignsPage />} /> 
        </Routes>
      </Router>
    </CartProvider>
  </React.StrictMode>
);