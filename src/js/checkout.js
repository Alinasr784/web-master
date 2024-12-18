import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "./firebase";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "../css/checkout.css";

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Receiving products and total price from the Order Summary page
  const { products = [], totalPrice = 0 } = location.state || {};

  const [formData, setFormData] = useState({
    governorate: "",
    address: "",
    note: "",
  });

  const [user, setUser] = useState(null);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  // Fetch authenticated user's UID and data
  useEffect(() => {
    const fetchUserData = async (userId) => {
      try {
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUser(userDoc.data());
        } else {
          console.error("User document not found!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        fetchUserData(currentUser.uid);
      } else {
        setUser(null);
        console.error("No user is logged in!");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.governorate || !formData.address) {
      setAlert({ show: true, type: "error", message: "All fields are required!" });
      setTimeout(() => setAlert({ show: false, type: "", message: "" }), 3000);
      return;
    }

    if (!user) {
      setAlert({ show: true, type: "error", message: "User not logged in!" });
      return;
    }

    try {
      // Formatting products
      const formattedProducts = products.map((product) => ({
        "product-name": product.name || "Unknown Name",
        "product-image": product.img || "No Image",
        "product-price": product.discount || product.price || 0,
        "product-id": product.id || "No ID",
        "product-description": product.description || "No description available",
      }));

      // Order data
      const orderData = {
        products: formattedProducts,
        user: {
          firstname: user.firstname || "Unknown",
          lastname: user.lastname || "Unknown",
          phone: user.phone || "No Phone",
          email: user.email || "No Email",
          governorate: formData.governorate,
          address: formData.address,
          note: formData.note || "",
        },
        totalPrice: totalPrice || 0,
        orderDate: new Date(),
      };

      // Adding order to the Firestore "orders" collection
      const ordersCollectionRef = collection(db, "orders");
      await addDoc(ordersCollectionRef, orderData);

      setAlert({ show: true, type: "success", message: "Order placed successfully!" });
      setTimeout(() => navigate("/thank-you"), 2000);
    } catch (error) {
      console.error("Error placing order: ", error.message);
      setAlert({ show: true, type: "error", message: "Failed to place order. Please try again." });
    }
  };

  return (
    <div className="checkout-page">
      <h1 className="checkout-title">Checkout</h1>

      {/* Alert */}
      {alert.show && <div className={`alert ${alert.type}`}>{alert.message}</div>}

      {/* Product Details */}
      <div className="checkout-products">
        <h2>Your Items</h2>
        {products.map((product, index) => (
          <div key={index} className="checkout-product">
            <span>{product.name}</span>
            <span>{product.price} EGP</span>
          </div>
        ))}
        <h3>Total: {totalPrice} EGP</h3>
      </div>

      {/* Checkout Form */}
      <form className="checkout-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="governorate">Governorate</label>
          <select
            id="governorate"
            name="governorate"
            value={formData.governorate}
            onChange={handleChange}
            required
          >
            <option value="">Select your governorate</option>
            <option value="Cairo">Cairo</option>
            <option value="Giza">Giza</option>
            <option value="Alexandria">Alexandria</option>
            <option value="Dakahlia">Dakahlia</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="address">Detailed Address</label>
          <input
            type="text"
            id="address"
            name="address"
            placeholder="Enter your address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="note">Notes</label>
          <textarea
            id="note"
            name="note"
            rows="4"
            placeholder="Enter any additional notes"
            value={formData.note}
            onChange={handleChange}
          ></textarea>
        </div>

        <button type="submit" className="submit-btn">
          Place Order
        </button>
      </form>
    </div>
  );
}

export default Checkout;