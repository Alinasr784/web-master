import React, { useEffect, useState} from "react";
import { useNavigate } from "react-router-dom"; // إضافة استيراد useNavigate

import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import "../css/products.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Boot ==> bootstrap
function BootCard(props) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [wishList, setWishList] = useState(
    JSON.parse(localStorage.getItem("wish")) || []
  );

  const toggleFavorite = () => {
    setIsFavorite((prevIsFavorite) => {
      if (prevIsFavorite) {
        setWishList((prevWishList) =>
          prevWishList.filter((itemId) => itemId !== props.id)
        );
      } else {
        setWishList((prevWishList) => [...prevWishList, props.id]);
      }
      return !prevIsFavorite;
    });
  };

  useEffect(() => {
    localStorage.setItem("wish", JSON.stringify(wishList));
  }, [wishList]);
  
  return (
    <div className="card-n">
      <div
        className="heart-icon"
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
      <div className="card-n-title">{props.name}</div>
      <div className="card-n-text">{props.smallDes}</div>
    </div>
  );
}

function Products() {
  const navigate = useNavigate(); // تعريف navigate
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // جلب البيانات من Firestore
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, "products"); // مرجع مجموعة "products"
        const productsSnapshot = await getDocs(productsCollection); // جلب البيانات
        const productsList = productsSnapshot.docs.map((doc) => ({
          id: doc.id, // استخدام ID المستند
          img: doc.data().image || "", // جلب صورة المنتج
          name: doc.data().title || "", // جلب اسم المنتج
          des: doc.data().description || "", // وصف المنتج
          smallDes : doc.data().smallDes || "",
          price: doc.data().price || 0, // السعر
          discount: doc.data().discount || false, // الخصم
          stock: doc.data().stock || 0, // الكمية المتوفرة
        }));
        setProducts(productsList); // تحديث الحالة بالبيانات
      } catch (error) {
        console.error("Error fetching products: ", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="products-section">
      <div className="products-header">
        <span>Make It <span>Yours</span></span>
        <div
          className="products-btn"
          onClick={() => navigate("/products")} // استخدام navigate
        >
          View All →
        </div>
        
      </div>
      <div className="content">
        {products.map((item) => (
          <BootCard key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
}

export default Products;