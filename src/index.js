import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./js/cartContext";
import { WishProvider } from "./js/wishListContext";
import Header from "./js/header";
import Carousel from "./js/carousel";
import Login from "./js/login";
import Designs from "./js/designs";
import Sections from "./js/sections";
import BottomH from "./js/bottomH";
import Product from "./js/product.js";
import "./css/home.css";
import CartPage from "./js/cartPage.js"
import WishListPage from "./js/wishListPage.js"
import OrderSum from "./js/ordersum.js";
import Checkout from "./js/checkout.js";
import Thanks from "./js/thanks.js";
import ProductsPage from "./js/productsPage.js";
import Orders from "./js/orders.js";
import Contact from "./js/contact.js";
const root = ReactDOM.createRoot(document.getElementById("root"));

function Home() {
  return (
    <div className="home">
      <Header />
      <Carousel />
      <Designs />
      <Sections />
      <BottomH />
    </div>
  );
}

function LoginPage() {
  return (
    <>
      <Login />
    </>
  );
}

function DesignsPage() {
  return (
    <div>
      <Header />
      <ProductsPage />
      <BottomH />
    </div>
  );
}

function CartPageF(){
  return(
    <>
    <Header/>
    <CartPage/>
    <BottomH />
    </>
  )
}

function WishPage (){
  return(
  <>
    <Header/>
    <WishListPage />
    <BottomH />
  </>
  )
}

function OrdersPage (){
  return(
  <>
    <Header/>
    <Orders/>
    <BottomH />
  </>
  )
}

function ProductPage (){
  return(
    <div className="ProductPage">
      <Header/>
      <Product/>
      <Designs/>
      <BottomH/>
    </div>
  )
}

function OrderSumF (){
  return(
    <>
      <Header/>
      <OrderSum/>
      <BottomH/>
    </>
  )
}

function ThanksPage(){
  return(
    <>
      <Header/>
      <Thanks/>
      <BottomH/>
    </>
  )
}

function ContactUs(){
  return(
    <>
      <Header/>
      <Contact/>
      <BottomH/>
    </>
  )
}

function CheckoutF(){
  return(
    <>
      <Header/>
      <Checkout/>
      <BottomH/>
    </>
  )
}

root.render(
  <React.StrictMode>
    <WishProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/designs" element={<DesignsPage />} />
            <Route path="/cart" element={<CartPageF />} />
            <Route path="/wish-list" element={<WishPage />} />
            <Route path="/orders" element={<OrdersPage/>}/>
            <Route path="/product/:id" element={<ProductPage/>}/>
            <Route path="/your-order" element={<OrderSumF/>}/>
            <Route path="/thank-you" element={<ThanksPage/>}/>
            <Route path="/contact" element={<ContactUs/>}/>
            <Route path="/checkout" element={<CheckoutF/>}/>
          </Routes>
        </Router>
      </CartProvider>
    </WishProvider>
  </React.StrictMode>,
);
