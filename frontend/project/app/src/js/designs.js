import React, { useEffect, useState, useContext } from "react";
import { collection, getDocs, getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faShoppingCart, faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/designs.css";
import { useNavigate } from "react-router-dom"; // إضافة استيراد useNavigate
import { useCart } from './cartContext'; // استيراد useCart

function BootCard(props) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false); // لحفظ حالة زر "Order Now"
  const [isInCart, setIsInCart] = useState(false); // لحفظ حالة زر "Cart"
  const [user, setUser] = useState({});
  const { addToCart } = useCart(); // استهلاك دالة addToCart من الـ Context

  const toggleFavorite = () => {
    setIsFavorite((prevIsFavorite) => {
      // تحديث حالة المفضلة
      return !prevIsFavorite;
    });
  };

  const handleOrder = async () => {
    setIsOrdered(true); // تغيير الحالة عند الضغط
    // يمكنك إضافة منطق إضافي هنا، مثل إرسال الطلب إلى قاعدة البيانات
  };

  const handleAddToCart = async () => {
    setIsInCart(true); // تغيير الحالة عند الضغط
    if (!user || !user.uid) {
      alert("Please log in to add items to the cart.");
      return;
    }

    try {
      const userDoc = doc(db, "users", user.uid);
      await updateDoc(userDoc, {
        cart: [...(user.cart || []), props.id], // إضافة الـ id للـ cart
      });

      // إضافة المنتج إلى السلة في الـ Context
      addToCart(props.id);
      console.log("Item added to cart");
    } catch (error) {
      console.error("Error adding to cart: ", error);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        console.log("User is logged in:", currentUser);
        setUser(currentUser); // حفظ المستخدم الحالي
        try {
          const userDoc = doc(db, "users", currentUser.uid);
          const userSnapshot = await getDoc(userDoc);
          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            setUser({ ...currentUser, ...userData });

            // تحقق من العناصر الموجودة في cart
            if (userData.cart && Array.isArray(userData.cart)) {
              if (userData.cart.includes(props.id)) {
                setIsInCart(true); // إذا كان العنصر موجودًا في السلة
              }
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        console.log("No user is logged in");
        setUser(null); // تعيين user إلى null إذا لم يكن المستخدم مسجلاً
      }
    });

    return () => unsubscribe();
  }, [props.id]);

  return (
    <div className="card-n-des">
      <div
        className="heart-icon-des"
        onClick={toggleFavorite}
      >
        <FontAwesomeIcon
          icon={faHeart}
          style={{ color: isFavorite ? "#ff4d4d" : "#fff" }}
        />
      </div>
      <img src={props.img} alt={props.name} />
      <div className="card-n-title-des">{props.name}</div>
      <div className="card-n-text-des">{props.smallDes}</div>
      <div className={`card-n-discount-des ${props.discount ? "show" : "hide"}`}>
        {props.discount} EGP
      </div>
      <div className="card-n-price-des">{props.price} EGP</div>
      <div className="card-n-btns-des">
        <div
          className={`card-n-order-des ${isOrdered ? "disabled" : "active"}`}
          onClick={handleOrder}
        >
          Order Now
        </div>
        <div
          className={`card-n-cart-des ${isInCart ? "disabled" : "active"}`}
          onClick={handleAddToCart}
        >
          <FontAwesomeIcon
            icon={faCartPlus}
            style={{ color: isInCart ? "#555" : "#ff7c37" }}
          />
        </div>
      </div>
    </div>
  );
}

function SingleRowProductDisplay({ products }) {
  const navigate = useNavigate(); // تعريف navigate

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
      <div className="single-row-container">
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
    </>
  );
}

function Designs() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // جلب البيانات من كولكشن "designs"
    const fetchProducts = async () => {
      try {
        const designsCollection = collection(db, "designs"); // مرجع مجموعة "designs"
        const designsSnapshot = await getDocs(designsCollection); // جلب البيانات
        const designsList = designsSnapshot.docs.map((doc) => ({
          id: doc.id, // استخدام ID المستند
          img: doc.data().image || "", // جلب صورة المنتج
          name: doc.data().title || "", // جلب اسم المنتج
          smallDes: doc.data().smallDes || "",
          price: doc.data().price || 0, // السعر
          discount: doc.data().discount || false, // الخصم
          stock: doc.data().stock || 0, // الكمية المتوفرة
        }));
        setProducts(designsList); // تحديث الحالة بالبيانات
      } catch (error) {
        console.error("Error fetching designs: ", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <SingleRowProductDisplay products={products} />
    </div>
  );
}

export default Designs;