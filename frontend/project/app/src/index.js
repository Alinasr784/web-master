import React from 'react';
import ReactDOM from 'react-dom/client';
import Header from './js/header'
import Carousel from './js/carousel.js'
import Products from './js/products.js'
import "./css/home.css"
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div className='home'>
      <Header/>
      <Carousel/>
      <Products/>
    </div>
  </React.StrictMode>
);