import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import "../css/orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brand, setBrand] = useState("VIPER")

  const fetchOrders = async (userId) => {
    try {
      const userDocRef = doc(db, "users", userId);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const userOrders = userData.orders || [];
        setOrders(userOrders);
      }
    } catch (error) {
      console.error("Error fetching orders: ", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        fetchOrders(currentUser.uid);
      } else {
        setOrders([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="loading">Loading your orders...</div>;
  }

  if (orders.length === 0) {
    return <div className="no-orders">You have no orders yet!</div>;
  }

  return (
    <div className="orders-page">
      <h1 className="orders-title">My Orders</h1>
      <div className="orders-container">
        {orders.map((order, index) => (
          <div key={index} className="order-card">
            <div className="order-header">
              <h2>Order #{index + 1}</h2>
              <p className="order-status">
                <span>{order.status || "Under Review"}</span>{" "}
                {/* حالة افتراضية */}
              </p>
            </div>
            <div className="order-products">
              {order.products.map((product, idx) => (
                <div key={idx} className="product-item">
                  <img src={product.img} alt={product.name} />
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-price">Price: {product.price} EGP</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="order-summary">
              <span>Total Price:</span>
              <span className="order-total">{order.totalPrice} EGP</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;
