import React, { useEffect, useState } from "react";
import { collection, getDocs, getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faShoppingCart, faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/designs.css";
import { useNavigate } from "react-router-dom"; // إضافة استيراد useNavigate

// Boot ==> bootstrap
function BootCard(props) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false); // لحفظ حالة زر "Order Now"
  const [isInCart, setIsInCart] = useState(false); // لحفظ حالة زر "Cart"
  const [user, setUser] = useState({});
  const [wishList, setWishList] = useState([]); // إضافة الحالة لقائمة المفضلة

  const toggleFavorite = () => {
    setIsFavorite((prevIsFavorite) => {
      if (prevIsFavorite) {
        // إزالة من قائمة المفضلة إذا كان قد تم إضافته بالفعل
        setWishList((prevWishList) =>
          prevWishList.filter((itemId) => itemId !== props.id)
        );
      } else {
        // إضافة إلى قائمة المفضلة
        setWishList((prevWishList) => [...prevWishList, props.id]);
      }
      return !prevIsFavorite;
    });
  };

  const handleOrder = async () => {
    setIsOrdered(true); // تغيير الحالة عند الضغط
    /*try {
      if (user && user.uid) {
        const userDoc = doc(db, "users", user.uid);
        await updateDoc(userDoc, {
          orders: [...(user.orders || []), props.id], // إضافة الـ id للـ orders
        });
      }
    } catch (error) {
      console.error("Error adding order: ", error);
    }*/
  };

  const handleAddToCart = async () => {
    if (!user || !user.uid) {
      alert("Please log in to add items to the cart.");
      return;
    }

    setIsInCart(true); // تغيير الحالة عند الضغط
    try {
      const userDoc = doc(db, "users", user.uid);
      await updateDoc(userDoc, {
        cart: [...(user.cart || []), props.id], // إضافة الـ id للـ cart
      });
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
            setUser({ ...currentUser, ...userSnapshot.data() });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        console.log("No user is logged in");
        setUser(null); // تأكد من تعيين user إلى null إذا لم يكن المستخدم مسجلاً
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="card-n-des">
      <div
        className="heart-icon-des"
        onClick={() => {
          toggleFavorite(props.id);
        }}
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
          className={`card-n-order-des ${isOrdered ? "disabled" : ""}`}
          onClick={handleOrder}
        >
          Order Now
        </div>
        <div
          className={`card-n-cart-des ${isInCart ? "disabled" : ""}`}
          onClick={()=>{
            handleAddToCart();
            console.log("done")
          }}
        >
          <FontAwesomeIcon
            icon={faCartPlus}
            style={{ color: isOrdered ? "#555" : "#ff7c37" }}
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
          des: doc.data().description || "", // وصف المنتج
          smallDes: doc.data().smallDes || "",
          price: doc.data().price || 0, // السعر
          discount: doc.data().discount || false, // الخصم
          stock: doc.data().stock || 0, // الكمية المتوفرة
          design: doc.data().design || false, // إضافة الخاصية "design"
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