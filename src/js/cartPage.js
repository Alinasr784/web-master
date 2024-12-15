import React, { useEffect, useState } from "react";
import {
  collection,
  getDoc,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "./firebase";
import "../css/cartPage.css";
import { useCart } from "./cartContext";
import { useWish } from "./wishListContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faHeart } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, Link } from "react-router-dom";

function CartCard({ img, name, price, id, smallDes, onRemoveFromCart }) {
  const [isRemoving, setIsRemoving] = useState(false);
  const [isInWish, setIsInWish] = useState(false);
  const [user, setUser] = useState({});
  const [myWish, setMyWish] = useState([]);
  const { removeFromCart } = useCart();
  const { addToWish, removeFromWish } = useWish();

  const handleRemoveFromCart = async (e) => {
    e.preventDefault();

    if (!user || !user.uid) {
      alert("Please log in to remove items from the cart.");
      return;
    }

    setIsRemoving(true);
    setTimeout(async () => {
      try {
        const userDoc = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userDoc);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          const updatedCart = userData.cart.filter((item) => item !== id);
          await updateDoc(userDoc, { cart: updatedCart });
          removeFromCart(id);
          onRemoveFromCart(id); // تحديث حالة المنتجات في المكون الرئيسي
        }
      } catch (error) {
        console.error("Error removing item from cart:", error);
      }
    }, 500);
  };

  const handleAddToWish = async (e) => {
    e.preventDefault();
    if (!user || !user.uid) {
      alert("Please log in to add items to the wish list.");
      return;
    }

    try {
      const userDoc = doc(db, "users", user.uid);
      const userSnapshot = await getDoc(userDoc);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        const currentWishList = userData.wishList || [];

        if (isInWish) {
          const updatedWish = currentWishList.filter((item) => item !== id);
          await updateDoc(userDoc, { wishList: updatedWish });
          setMyWish(updatedWish);
          setIsInWish(false);
          removeFromWish(id);
        } else {
          const updatedWish = [...currentWishList, id];
          await updateDoc(userDoc, { wishList: updatedWish });
          setMyWish(updatedWish);
          setIsInWish(true);
          addToWish(id);
        }
      }
    } catch (error) {
      console.error("Error updating wish list:", error);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDoc = doc(db, "users", currentUser.uid);
        const userSnapshot = await getDoc(userDoc);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          setMyWish(userData.wishList || []);
          setIsInWish((userData.wishList || []).includes(id));
        }
      } else {
        setUser(null);
        setMyWish([]);
        setIsInWish(false);
      }
    });

    return () => unsubscribe();
  }, [id]);

  return (
    <div className={`card-n-des-Cart ${isRemoving ? "remove-animation" : ""}`}>
      <div
        className={`card-n-wish-des-Cart heart-icon-des-Cart ${isInWish ? "disabled" : "active"}`}
        onClick={handleAddToWish}
      >
        <FontAwesomeIcon
          icon={faHeart}
          style={{ color: isInWish ? "#ff4d4d" : "#555" }}
        />
      </div>
      <img src={img} alt={name} />
      <div className="card-n-title-Cart">{name}</div>
      <div className="card-n-text-Cart">{smallDes}</div>
      <div className="card-n-price-Cart">{price} EGP</div>
      <div className="card-n-btns-Cart">
        <div className="card-n-remove-Cart" onClick={handleRemoveFromCart}>
          Remove{" "}
          <FontAwesomeIcon
            icon={faTrash}
            style={{ color: "white", marginLeft: "10px" }}
          />
        </div>
      </div>
    </div>
  );
}

function CartPage() {
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // حساب السعر الإجمالي
  const calculateTotalPrice = (products) => {
    const total = products.reduce((acc, item) => acc + item.price, 0);
    setTotalPrice(total);
  };

  // تحديث حالة السلة عندما يتم إزالة منتج
  const handleRemoveFromCart = (id) => {
    const updatedProducts = products.filter((product) => product.id !== id);
    setProducts(updatedProducts); // تحديث قائمة المنتجات
    calculateTotalPrice(updatedProducts); // إعادة حساب السعر الإجمالي
  };

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userSnapshot = await getDoc(userDocRef);

          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            const cart = userData.cart || [];

            if (cart.length > 0) {
              const designsCollection = collection(db, "designs");
              const designsSnapshot = await getDocs(designsCollection);

              const cartProducts = designsSnapshot.docs
                .filter((doc) => cart.includes(doc.id))
                .map((doc) => ({
                  id: doc.id,
                  img: doc.data().image || "",
                  name: doc.data().title || "",
                  price: doc.data().price || 0,
                  smallDes: doc.data().smallDes,
                  description: doc.data().description,
                }));

              setProducts(cartProducts);
              calculateTotalPrice(cartProducts); // حساب السعر الإجمالي في البداية
            }
          }
        } catch (error) {
          console.error("Error fetching cart products:", error);
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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

  return (
    <div className="products-page-Cart">
      {products.length === 0 ? (
        <div className="no-products-Cart">No products in your cart</div>
      ) : (
        <>
          <div className="content-proPage-Cart">
            {products.map((product) => (
              <CartCard
                key={product.id}
                img={product.img}
                name={product.name}
                price={product.price}
                id={product.id}
                smallDes={product.smallDes}
                onRemoveFromCart={handleRemoveFromCart} // تمرير الدالة
              />
            ))}
          </div>
          <div className="checkout-btn-container">
            <button
              className="checkout-btn"
              onClick={() =>
                navigate("/checkout", {
                  state: { products, totalPrice }, // إرسال البيانات
                })
              }
            >
              Proceed to Buy ({totalPrice} EGP)
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default CartPage;