import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "./firebase"; // تأكد من أن ملف Firebase يحتوي على الإعدادات الصحيحة
import "../css/contact.css"; // تأكد من إنشاء هذا الملف

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      setAlert({ show: true, type: "error", message: "All fields are required!" });
      setTimeout(() => setAlert({ show: false, type: "", message: "" }), 3000);
      return;
    }

    try {
      // إرسال البيانات إلى Firestore
      await addDoc(collection(db, "messages"), {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        createdAt: new Date(),
      });

      setAlert({ show: true, type: "success", message: "Message sent successfully!" });
      setTimeout(() => setAlert({ show: false, type: "", message: "" }), 3000);

      // إعادة تعيين النموذج
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error sending message: ", error);
      setAlert({ show: true, type: "error", message: "Failed to send message. Please try again." });
      setTimeout(() => setAlert({ show: false, type: "", message: "" }), 3000);
    }
  };

  return (
    <div className="contact-page">
      <h1 className="contact-title">Contact Us</h1>

      {/* عرض التنبيه */}
      {alert.show && (
        <div className={`alert ${alert.type}`}>
          <span>{alert.message}</span>
        </div>
      )}

      <div className="contact-container">
        {/* معلومات التواصل */}
        <div className="contact-info">
          <h2>Get in Touch</h2>
          <p>If you have any questions or inquiries, feel free to contact us!</p>
          <p>
            <strong>Email:</strong> support@example.com
          </p>
          <p>
            <strong>Phone:</strong> +1 234 567 890
          </p>
        </div>

        {/* نموذج الاتصال */}
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              rows="5"
              placeholder="Enter your message"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <button type="submit" className="submit-btn">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}

export default Contact;






