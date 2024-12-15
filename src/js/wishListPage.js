import React, { useEffect, useState } from "react";
import { collection, getDoc, getDocs, doc, updateDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "./firebase";

import { useCart } from "./cartContext";
import "../css/designs.css";
import { useWish } from "./wishListContext";
import "../css/wishListPage.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

function BootCard({ img, name, price, discount, id, smallDes, onRemoveFromWishList }) {
  const [isInCart, setIsInCart] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false); // حالة تأثير الحذف
  const [user, setUser] = useState({});
  const [myCart, setMyCart] = useState([]);
  const { addToCart, removeFromCart } = useCart();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user || !user.uid) {
      alert("Please log in to add items to the cart.");
      return;
    }

    try {
      const userDoc = doc(db, "users", user.uid);

      if (isInCart) {
        const updatedCart = myCart.filter((item) => item !== id);
        await updateDoc(userDoc, { cart: updatedCart });
        setMyCart(updatedCart);
        setIsInCart(false);
        removeFromCart(id);
      } else {
        const updatedCart = [...myCart, id];
        await updateDoc(userDoc, { cart: updatedCart });
        setMyCart(updatedCart);
        setIsInCart(true);
        addToCart(id);
      }
    } catch (error) {
      console.error("Error updating cart: ", error);
    }
  };

  const handleRemoveFromWishList = async (e) => {
    e.preventDefault();
    if (!user || !user.uid) {
      alert("Please log in to remove items from the wish list.");
      return;
    }

    try {
      setIsRemoving(true); // تطبيق تأثير الحذف
      setTimeout(async () => {
        const userDoc = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userDoc);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          const updatedWishList = userData.wishList.filter((item) => item !== id);
          await updateDoc(userDoc, { wishList: updatedWishList });

          onRemoveFromWishList(id); // تحديث حالة الـ Wish List في المكون الرئيسي
        }
      }, 500); // وقت الأنيميشن
    } catch (error) {
      console.error("Error removing item from wish list:", error);
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

  return (
    <div className={`card-n-des-WishList ${isRemoving ? "remove-animation" : ""}`}>
      <div
        className="card-n-wish-des-WishList heart-icon-des-WishList"
        onClick={handleRemoveFromWishList}
      >
        <FontAwesomeIcon icon={faHeart} style={{ color: "#ff4d4d" }} />
      </div>
      <img src={img} alt={name} />
      <div className="card-n-title-des-WishList">{name}</div>
      <div className="card-n-text-des-WishList">{smallDes}</div>
      {discount && (
        <div className="card-n-discount-des-WishList show">{discount} EGP</div>
      )}
      <div className="card-n-price-des-WishList">{price} EGP</div>
      <div className="card-n-btns-des-WishList">
        <div
          className={`card-n-cart-des-WishList ${isInCart ? "disabled" : "active"}`}
          onClick={handleAddToCart}
        >
          {isInCart ? "Added" : "Add To Cart"}
        </div>
      </div>
    </div>
  );
}

function WishListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // تحديث حالة الـ Wish List عند إزالة عنصر
  const handleRemoveFromWishList = (id) => {
    const updatedProducts = products.filter((product) => product.id !== id);
    setProducts(updatedProducts);
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
            const wishList = userData.wishList || [];

            if (wishList.length > 0) {
              const designsCollection = collection(db, "designs");
              const designsSnapshot = await getDocs(designsCollection);

              const wishListProducts = designsSnapshot.docs
                .filter((doc) => wishList.includes(doc.id))
                .map((doc) => ({
                  id: doc.id,
                  img: doc.data().image || "",
                  name: doc.data().title || "",
                  price: doc.data().price || 0,
                  discount: doc.data().discount || false,
                  smallDes: doc.data().smallDes,
                }));

              setProducts(wishListProducts);
            }
          } else {
            console.error("User data not found");
          }
        } catch (error) {
          console.error("Error fetching wish list products:", error);
        }
      } else {
        console.error("User is not logged in");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="load-container-WishList">
        <div className="dots-WishList">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <p className="loading-text-WishList">Loading...</p>
      </div>
    );
  }

  return (
    <div className="products-page-WishList">
      {products.length === 0 ? (
        <div className="no-products-WishList">No products here</div>
      ) : (
        <div className="content-proPage-WishList">
          {products.map((product) => (
            <BootCard
              key={product.id}
              img={product.img}
              name={product.name}
              price={product.price}
              discount={product.discount}
              id={product.id}
              smallDes={product.smallDes}
              onRemoveFromWishList={handleRemoveFromWishList}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default WishListPage;