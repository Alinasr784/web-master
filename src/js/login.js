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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

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
    password: "",
  });

  const [isLogin, setIsLogin] = useState(false);
  const [step, setStep] = useState(1); // حالة لتتبع الخطوة الحالية

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateStep1 = () => {
    const { firstname, lastname, phone } = formData;
    if (!firstname || !lastname || !phone) {
      Toast.fire("Error", "Please fill in all required fields.", "error");
      return false;
    }
    return true;
  };

  const validateForm = () => {
    const { email, password } = formData;
    if (!email || !password) {
      Toast.fire("Error", "Please fill in all required fields.", "error");
      return false;
    }
    return true;
  };

  const handleContinue = () => {
    if (validateStep1()) {
      setStep(2);
    }
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
          password: formData.password,
          wishList:[],
          cart : []
        });

        navigate("/");
      }
    } catch (error) {
      Toast.fire("Error", "Failed to create account. Please try again.", "error");
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="formbold-main-wrapper-checkout">
      <div className="formbold-form-wrapper-checkout">
        <form onSubmit={handleSubmit}>
          {/* شريط التقدم */}
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${(step - 1) * 50}%` }}></div>
          </div>

          {/* Step 1 */}
          {!isLogin && step === 1 && (
            <>
              <div className="formbold-input-flex-checkout">
                <div className="firstName">
                  <label className="formbold-form-label-checkout">First Name</label>
                  <input
                    type="text"
                    name="firstname"
                    placeholder="Your first name"
                    className="formbold-form-input-checkout"
                    value={formData.firstname}
                    onChange={handleChange}
                    required
                    autoFocus // هنا التعديل
                  />
                </div>
                <div>
                  <label className="formbold-form-label-checkout">Last Name</label>
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
                <label className="formbold-form-label-checkout">Phone Number</label>
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
              <div className="formbold-btn-group">
                <button type="button" className="formbold-btn-continue" onClick={handleContinue}>
                  Continue <FontAwesomeIcon icon={faArrowRight} />
                </button>
                <button type="button" className="formbold-btn-cancel" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </>
          )}

          {/* Step 2 */}
          {(isLogin || step === 2) && (
            <>
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
                  autoFocus // هنا التعديل
                />
              </div>
              <div className="formbold-mb-3-checkout">
                <label className="formbold-form-label-checkout">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Your Password"
                  className="formbold-form-input-checkout"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="formbold-btn-group-step2">
                <button type="submit" className="formbold-btn-step2-create">
                  {isLogin ? "Login" : "Create Account"}
                </button>
                <button type="button" className="formbold-btn-step2-cancel" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </>
          )}

          {/* Toggle between Login and Create Account */}
          <div className="formbold-text-center">
            <p
              style={{ cursor: "pointer" }}
              onClick={() => {
                setIsLogin(!isLogin);
                if (!isLogin) setStep(1);  // عند التبديل إلى "Create Account"، اعادة الخطوة إلى 1
              }}
              className="formbold-switch-to-login-signup"
            >
              {isLogin
                ? "Don't have an account? Create Account"
                : "Already have an account? Login"}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;