import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { collection, addDoc, doc, getDoc , updateDoc} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "./firebase"; // تأكد من مسار ملف Firebase
import "../css/checkout.css";

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [user, setUser] = useState(null);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  useEffect(() => {
    // التحقق من وجود المستخدم الحالي وجلب بياناته من Firestore
    const fetchUserData = async (currentUser) => {
      try {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          setUser({
            uid: currentUser.uid,
            email: userData.email || currentUser.email,
            firstname: userData.firstname || "N/A",
            lastname: userData.lastname || "N/A",
            phone: userData.phone || "N/A",
          });
        } else {
          console.error("User document does not exist");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        fetchUserData(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // التحقق من وجود البيانات المرسلة
    if (location.state && location.state.products) {
      setProducts(location.state.products);
      setTotalPrice(location.state.totalPrice || 0);
    } else {
      // إذا لم يتم إرسال بيانات، إعادة التوجيه إلى CartPage
      navigate("/cart");
    }
  }, [location, navigate]);

  const handlePlaceOrder = async () => {
    if (!user) {
      showAlert("error", "Please log in to place your order.");
      return;
    }

    try {
      console.log("Starting order placement...");

      const orderData = {
        user: {
          uid: user.uid || "N/A",
          email: user.email || "N/A",
          firstname: user.firstname || "N/A",
          lastname: user.lastname || "N/A",
          phone: user.phone || "N/A",
        },
        products: products.map((product) => ({
          id: product.id || "N/A",
          name: product.name || "N/A",
          price: product.price || 0,
          img: product.img || "N/A",
        })),
        totalPrice: totalPrice || 0,
        status: "Under Review", // تأكد من إضافة الحالة هنا
        createdAt: new Date(),
      };

      console.log("Order Data Prepared: ", orderData);

      // إضافة الطلب إلى مجموعة "orders"
      const orderRef = await addDoc(collection(db, "orders"), orderData);
      console.log("Order added to orders collection with ID: ", orderRef.id);

      // تحديث بيانات المستخدم
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (!userDocSnapshot.exists()) {
        console.error("User document not found!");
        showAlert("error", "Failed to find user data.");
        return;
      }

      const userData = userDocSnapshot.data();
      const existingOrders = userData.orders || [];
      const updatedOrders = [...existingOrders, { ...orderData, orderId: orderRef.id }];

      await updateDoc(userDocRef, { orders: updatedOrders });
      console.log("Order added to user's document successfully!");

      showAlert("success", "Your order has been placed successfully!");

      // إعادة التوجيه إلى صفحة "شكراً"
      setTimeout(() => {
        navigate("/thankyou");
      }, 2000);
    } catch (error) {
      console.error("Error placing order: ", error.message);
      showAlert("error", "Failed to place your order. Please try again.");
    }
  };

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });

    // إخفاء التنبيه بعد 5 ثوانٍ
    setTimeout(() => {
      setAlert({ show: false, type: "", message: "" });
    }, 5000);
  };

  return (
    <div className="checkout-page">
      <h1 className="checkout-title">Checkout</h1>

      {/* عرض التنبيه */}
      {alert.show && (
        <div className={`custom-alert ${alert.type}`}>
          <span>{alert.message}</span>
        </div>
      )}

      <div className="checkout-container">
        {/* قائمة المنتجات */}
        <div className="checkout-products">
          <h2>Your Items</h2>
          <ul className="product-list">
            {products.length > 0 ? (
              products.map((product) => (
                <li key={product.id} className="product-item">
                  <img src={product.img} alt={product.name} />
                  <span className="product-name">{product.name}</span>
                  <span className="product-price">{product.price} EGP</span>
                </li>
              ))
            ) : (
              <p className="no-products">No products to checkout.</p>
            )}
          </ul>
        </div>

        {/* ملخص الطلب */}
        {products.length > 0 && (
          <div className="checkout-summary">
            <h2 className="summary-title">Order Summary</h2>
            <div className="summary-details">
              <div className="summary-item">
                <span className="summary-label">Total Items</span>
                <span className="summary-value">{products.length}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Total Price</span>
                <span className="summary-value total-price">{totalPrice} EGP</span>
              </div>
            </div>
            <button className="place-order-btn" onClick={handlePlaceOrder}>
              Place Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Checkout;