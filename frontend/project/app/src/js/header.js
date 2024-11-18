import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import "../css/header.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const app = initializeApp(firebaseConfig);

function Normal() {
  const [logoVisible, setLogoVisible] = useState(true); // للتحكم في عرض الشعار
  const [message, setMessage] = useState(null); // نص الرسالة
  const [messageAction, setMessageAction] = useState(null); // دالة الرسالة
  const [messageClass, setMessageClass] = useState(""); // كلاس الرسالة للأنيميشن
  const showMessage = (text, duration, action) => {
    setMessage(text); // تعيين نص الرسالة
    setMessageAction(() => action); // تعيين الدالة
    setMessageClass("show"); // تطبيق كلاس الظهور
    setLogoVisible(false); // إخفاء الشعار

    setTimeout(() => {
      setMessageClass("hide"); // تطبيق كلاس الاختفاء
      setTimeout(() => {
        setMessage(null); // إزالة الرسالة
        setLogoVisible(true); // إعادة عرض الشعار
      }, 500); // وقت الأنيميشن
    }, duration);
  };

  useEffect(() => {
    showMessage("Added To Card", 3000, () => {
      console.log("Message clicked!");
    });

    const tes = setTimeout(() => {
      showMessage("Done Ali", 3000, () => {
        console.log("Message clicked!");
      });
    }, 8000);

    // تنظيف التايمر عند إعادة التقديم أو عند إلغاء مكون
    return () => clearTimeout(tes);
  }, []);

    
  return (
    <div className="contain">
      <div className="contain-left">
        <div className="menu">
          <FontAwesomeIcon icon={faBars} />
        </div>
      </div>

      <div className="contain-center">
        {message ? (
          <div
            className={`message ${messageClass}`}
            onClick={messageAction}
          >
            {message}
          </div>
        ) : (
          <div className={`logo ${logoVisible ? "show" : "hide"}`}>
            PIZZA Time
          </div>
        )}
      </div>

      <div className="contain-right">
        <div className="meAvatar">
          <img src="/assets/images/Profile.png" alt="Profile" />
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="header">
      <Normal />
    </div>
  );
}

export default Header; 