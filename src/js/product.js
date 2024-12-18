import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "./firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import "../css/product.css";
import { useCart } from "./cartContext";

function Product() {
  const { id } = useParams();
  const navigate = useNavigate(); // لإعادة التوجيه
  const [user, setUser] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInCart, setIsInCart] = useState(false);
  const [myCart, setMyCart] = useState([]);
  const { addToCart, removeFromCart } = useCart();

  // التحقق من تسجيل الدخول وجلب بيانات المستخدم
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDoc = doc(db, "users", currentUser.uid);
        const userSnapshot = await getDoc(userDoc);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          setMyCart(userData.cart || []);
          setIsInCart(userData.cart?.includes(id) || false);
        }
      } else {
        setUser(null);
        setMyCart([]);
        setIsInCart(false);
      }
    });

    return () => unsubscribe();
  }, [id]);

  // إضافة أو إزالة المنتج من العربة
  const handleAddToCart = async () => {
    if (!user || !user.uid) {
      alert("Please log in to add items to the cart.");
      return;
    }

    try {
      const userDoc = doc(db, "users", user.uid);

      if (isInCart) {
        // إزالة المنتج من العربة
        const updatedCart = myCart.filter((item) => item !== id);
        await updateDoc(userDoc, { cart: updatedCart });
        setMyCart(updatedCart);
        setIsInCart(false);
        removeFromCart(id);
      } else {
        // إضافة المنتج إلى العربة
        const updatedCart = [...myCart, id];
        await updateDoc(userDoc, { cart: updatedCart });
        setMyCart(updatedCart);
        setIsInCart(true);
        addToCart(id);
      }
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  // جلب بيانات المنتج
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productDoc = doc(db, "designs", id);
        const productSnapshot = await getDoc(productDoc);
        if (productSnapshot.exists()) {
          setProduct(productSnapshot.data());
        } else {
          console.error("Product not found");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  // أثناء التحميل
  if (loading) {
    return (
      <div className="load-container-Cart">
        <div className="dots-Cart">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <p className="loading-text-Cart">Loading...</p>
      </div>
    );
  }

  // إذا لم يتم العثور على المنتج
  if (!product) {
    return <div className="error-message">Product not found</div>;
  }

  // استخراج البيانات من المنتج
  const { images = [], title = "No Title", des = "No Description", price = "0" } = product;

  const handleBuyNow = () => {
    navigate("/your-order", {
      state: {
        products: [
          {
            ...product,
            img: product.image, // استخدام الحقل image مباشرة
          },
        ],
        totalPrice: parseFloat(price),
      },
    });
  };

  return (
    <div className="product-page-Product">
      {/* Carousel */}
      <div className="carousel-container">
        <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
          {/* Indicators */}
          <div className="carousel-indicators">
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide-to={index}
                className={index === 0 ? "active" : ""}
                aria-label={`Slide ${index + 1}`}
              ></button>
            ))}
          </div>

          {/* Slides */}
          <div className="carousel-inner">
            {images.map((image, index) => (
              <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                <img src={image} className="bannar carousel-img" alt={`Slide ${index + 1}`} />
              </div>
            ))}
          </div>

          {/* Controls */}
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="prev"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="next"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="product-details">
        {/* العنوان */}
        <div className="product-header">
          <h1 className="product-title">{title}</h1>
          <div className="product-price">{price} EGP</div>
        </div>

        {/* الوصف */}
        <div className="product-description">
          <h2>Description</h2>
          <p>{des}</p>
        </div>

        {/* أزرار الحركة */}
        <div className="product-actions">
          {!isInCart && (
            <button className="action-btn add-to-cart" onClick={handleAddToCart}>
              Add to Cart
            </button>
          )}
          {isInCart && (
            <button className="action-btn remove-from-cart" onClick={handleAddToCart}>
              Remove from Cart
            </button>
          )}
          <button className="action-btn buy-now" onClick={handleBuyNow}>
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default Product;