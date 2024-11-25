import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import "../css/login.css";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

const Login = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    email: "",
    address: "",
    password: "",
  });

  const [isLogin, setIsLogin] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const { firstname, lastname, phone, address, email, password } = formData;
    if (!email || !password) {
      Toast.fire("Error", "Please fill in all required fields.", "error");
      return false;
    }
    if (!isLogin && (!firstname || !lastname || !phone || !address)) {
      Toast.fire("Error", "Please fill in all required fields.", "error");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const auth = getAuth();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password,
        );
        navigate("/");
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password,
        );
        const user = userCredential.user;

        const db = getFirestore();
        await setDoc(doc(db, "users", user.uid), {
          firstname: formData.firstname,
          lastname: formData.lastname,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
        });

        navigate("/");
      }
    } catch (error) {
      Toast.fire("Error","Failed to create account. Please try again.","error");
    }
  };

  return (
    <div className="formbold-main-wrapper-checkout">
      <div className="formbold-form-wrapper-checkout">
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="formbold-input-flex-checkout">
                <div className="firstName">
                  <label className="formbold-form-label-checkout">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstname"
                    placeholder="Your first name"
                    className="formbold-form-input-checkout"
                    value={formData.firstname}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="formbold-form-label-checkout">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastname"
                    placeholder="Your last name"
                    className="formbold-form-input-checkout"
                    value={formData.lastname}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="formbold-mb-3-checkout">
                <label className="formbold-form-label-checkout">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Your phone number - start with 01"
                  className="formbold-form-input-checkout"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="formbold-mb-3-checkout">
                <label className="formbold-form-label-checkout">Address</label>
                <input
                  type="text"
                  name="address"
                  placeholder="Street address"
                  className="formbold-form-input-checkout"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}
          <div className="formbold-mb-3-checkout">
            <label className="formbold-form-label-checkout">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              className="formbold-form-input-checkout"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="formbold-mb-3-checkout">
            <label className="formbold-form-label-checkout">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Your password"
              className="formbold-form-input-checkout"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="formbold-btn-checkout">
            {isLogin ? "Login" : "Create Account"}
          </button>
          <p className="formbold-message-checkout">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <a href="#" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Sign up here" : "Login here"}
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
