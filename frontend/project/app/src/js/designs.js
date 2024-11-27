import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import "../css/designs.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useNavigate } from "react-router-dom"; // استيراد useNavigate

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
      <div className={`card-n-discount ${props.discount ? "show" : "hide"}`}>
        {props.discount} EGP
      </div>
      <div className="card-n-price">{props.price} EGP</div>
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

function Products() {
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

export default Products;