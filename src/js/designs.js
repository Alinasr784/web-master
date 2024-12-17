import React, { useEffect, useState, useContext , useRef} from "react";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faCartPlus,
  faShoppingCart,
  faBox,faChevronLeft, faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate , Link} from "react-router-dom"; // إضافة استيراد useNavigate
import { useCart } from "./cartContext"; // استيراد useCart
import "../css/designs.css";
import { useWish } from "./wishListContext"; // استيراد useCart

function BootCard(props) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [isInWish, setIsInWish] = useState(false);
  const [user, setUser] = useState({});
  const [myCart, setMyCart] = useState([]);
  const [myWish, setMyWish] = useState([]);
  const { addToWish, removeFromWish } = useWish();
  const { addToCart, removeFromCart } = useCart();

  const toggleFavorite = () => {
    setIsFavorite((prev) => !prev);
  };

  const handleOrder = () => {
    setIsOrdered(true);
    // يمكنك إضافة منطق الطلب هنا
  };

  const handleAddToCart = async (e) => {
    e.preventDefault()

    if (!user || !user.uid) {
      alert("Please log in to add items to the cart.");
      return;
    }

    try {
      const userDoc = doc(db, "users", user.uid);

      if (isInCart) {
        // إزالة العنصر من السلة
        const updatedCart = myCart.filter((item) => item !== props.id);
        await updateDoc(userDoc, { cart: updatedCart });
        setMyCart(updatedCart); // تحديث الحالة مباشرة
        setIsInCart(false);
        removeFromCart(props.id);
        console.log("Item removed from cart");
      } else {
        // إضافة العنصر إلى السلة
        const updatedCart = [...myCart, props.id];
        await updateDoc(userDoc, { cart: updatedCart });
        setMyCart(updatedCart); // تحديث الحالة مباشرة
        setIsInCart(true);
        addToCart(props.id);
        console.log("Item added to cart");
      }
    } catch (error) {
      console.error("Error updating cart: ", error);
    }
  };

  const handleAddToWish = async (e) => {
    e.preventDefault()
    if (!user || !user.uid) {
      alert("Please log in to add items to the wish list.");
      return;
    }

    try {
      const userDoc = doc(db, "users", user.uid);

      if (isInWish) {
        // إزالة العنصر من قائمة الأمنيات
        const updatedWish = myWish.filter((item) => item !== props.id);
        await updateDoc(userDoc, { wishList: updatedWish }); // تحديث wishList
        setMyWish(updatedWish); // تحديث الحالة مباشرة
        setIsInWish(false);
        removeFromWish(props.id);
        console.log("Item removed from wish list");
      } else {
        // إضافة العنصر إلى قائمة الأمنيات
        const updatedWish = [...myWish, props.id];
        await updateDoc(userDoc, { wishList: updatedWish }); // تحديث wishList
        setMyWish(updatedWish); // تحديث الحالة مباشرة
        setIsInWish(true);
        addToWish(props.id);
        console.log("Item added to wish list");
      }
    } catch (error) {
      console.error("Error updating wish list: ", error);
    }
  };

  // تحديث السلة وقائمة الأمنيات مرة واحدة فقط عند تسجيل الدخول
  useEffect(() => {
    const fetchUserCartAndWish = async () => {
      if (!user || !user.uid) return;

      try {
        const userDoc = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userDoc);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          setMyCart(userData.cart || []);
          setMyWish(userData.wishList || []);
          setIsInCart(userData.cart?.includes(props.id) || false);
          setIsInWish(userData.wishList?.includes(props.id) || false);
        }
      } catch (error) {
        console.error("Error fetching user cart and wish list:", error);
      }
    };

    fetchUserCartAndWish();
  }, [user]); // يحدث فقط عند تسجيل الدخول

  const fetchCartData = async () => {
    if (!user || !user.uid) return;

    try {
      const userDoc = doc(db, "users", user.uid);
      const userSnapshot = await getDoc(userDoc);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        setMyCart(userData.cart || []);
        setMyWish(userData.wishList || []);
        setIsInCart(userData.cart?.includes(props.id) || false);
        setIsInWish(userData.wishList?.includes(props.id) || false);
      }
    } catch (error) {
      console.error("Error fetching user cart:", error);
    }
  };

  // استدعاء تحديث البيانات بعد أي عملية تعديل
  useEffect(() => {
    fetchCartData();
  }, [myCart, myWish]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchCartData();
      } else {
        setUser(null);
        setMyCart([]);
        setMyWish([]);
        setIsInCart(false);
        setIsInWish(false);
      }
    });

    return () => unsubscribe();
  }, [props.id]);

  return (
    <Link 
      to={`/product/${props.id}`} 
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <div className="card-n-des">
        <div
          className={`card-n-wish-des heart-icon-des ${isInWish ? "disabled" : "active"}`}
          onClick={handleAddToWish}
        >
          <FontAwesomeIcon
            icon={faHeart}
            style={{ color: isInWish ? "#ff4d4d" : "#555" }}
          />
        </div>
        <img src={props.img} alt={props.name} />
        <div className="card-n-title-des">{props.name}</div>
        <div
          className={`card-n-discount-des ${props.discount ? "show" : "hide"}`}
        >
          {props.discount} EGP
        </div>
        <div className="card-n-price-des">{props.price} EGP</div>
        <div className="card-n-btns-des">
          <div
            className={`card-n-cart-des ${isInCart ? "disabled" : "active"}`}
            onClick={handleAddToCart}
          >
            {isInCart ? "Added" : "Add To Cart"}
          </div>
        </div>
      </div>
    </Link>
  );
}

function SingleRowProductDisplay({ products }) {
  const navigate = useNavigate(); // تعريف navigate
  const scrollLeft = () => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  const rowRef = useRef(null);

  return (
    <>
      <div className="section-header">
        <span>Designs for you</span>
        <div
          className="navigate-btn"
          onClick={() => navigate("/designs")} // استخدام navigate
        >
          View All →
        </div>
      </div>
      <div className="arrow-container">
        <button className="arrow left-arrow" onClick={() => scrollLeft()}>
          <FontAwesomeIcon icon={faChevronLeft}/>
        </button>
        <div className="single-row-container" ref={rowRef}>
          {products.map((product) => (
            <BootCard
              key={product.id}
              id={product.id}
              img={product.img}
              name={product.name}
              smallDes={product.smallDes}
              price={product.price}
              discount={product.discount}
            />
          ))}
        </div>
        <button className="arrow right-arrow" onClick={() => scrollRight()}>
          <FontAwesomeIcon icon={faChevronRight}/>
        </button>
      </div>
    </>
  );
}

function Designs() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const designsCollection = collection(db, "designs");
        const designsSnapshot = await getDocs(designsCollection);
        const designsList = designsSnapshot.docs.map((doc) => ({
          id: doc.id,
          img: doc.data().image || "",
          name: doc.data().title || "",
          smallDes: doc.data().smallDes || "",
          price: doc.data().price || 0,
          discount: doc.data().discount || false,
          stock: doc.data().stock || 0,
        }));
        setProducts(designsList);
      } catch (error) {
        console.error("Error fetching designs: ", error);
      }
    };

    fetchProducts();
  }, []);

  return (

    <div className="designs-page">
      <SingleRowProductDisplay products={products} />
    </div>
  );
}

export default Designs;
