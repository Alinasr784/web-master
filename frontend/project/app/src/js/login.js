import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // لاستخدام التنقل
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"; // استيراد التوابع الضرورية
import { getFirestore, doc, setDoc } from "firebase/firestore"; // استيراد Firestore
import Swal from "sweetalert2";
import "../css/login.css"; // استيراد الأنماط

const Login = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    email: "",
    address: "",
    password: "", // إضافة حقل كلمة المرور
  });

  const navigate = useNavigate(); // لاستخدام التنقل

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const { firstname, lastname, phone, address, email, password } = formData;
    if (!firstname || !lastname || !phone || !address || !email || !password) {
      Swal.fire("Error", "Please fill in all required fields.", "error");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const auth = getAuth();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // حفظ بيانات المستخدم في Firestore
      const db = getFirestore();
      await setDoc(doc(db, "users", user.uid), {
        firstname: formData.firstname,
        lastname: formData.lastname,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
      });

      Swal.fire("Success", "Account created successfully!", "success");
      navigate("/"); // التنقل إلى صفحة لوحة التحكم بعد الإنشاء الناجح
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  return (
    <div className="formbold-main-wrapper-checkout">
      <div className="formbold-form-wrapper-checkout">
        <form onSubmit={handleSubmit}>
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
          <button type="submit" className="formbold-btn-checkout">
            Create Account
          </button>
          <p className="formbold-message-checkout">
            Already have an account?{" "}
            <a href="#" onClick={() => navigate("/login")}>
              Login here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;