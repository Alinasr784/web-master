import React from 'react';
import ReactDOM from 'react-dom/client';
import Header from './js/header'
import Carousel from './js/carousel'
import AllMenu from './js/allMenu'
import Sections from './js/section'
import "./css/home.css"
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div className='home'>
      <Header/>
      <Carousel/>
      <Sections/>
      <AllMenu/>
    </div>
  </React.StrictMode>
);