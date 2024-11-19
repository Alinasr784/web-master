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
  const [avatarRotation, setAvatarRotation] = useState(0); // زاوية دوران الصورة

  const showMessage = (text, duration, action) => {
    setMessage(text);
    setMessageAction(() => action);
    setLogoVisible(false);

    setTimeout(() => {
      setMessageClass("show");
    }, 0);

    const hideTimeout = setTimeout(() => {
      setMessageClass("hide");
      setTimeout(() => {
        setMessage(null);
        setLogoVisible(true);
      }, 500);
    }, duration);

    return () => clearTimeout(hideTimeout);
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

    return () => {
      clearTimeout(tes);
    };
  }, []);

  // تحديث دوران الصورة بناءً على التمرير
  useEffect(() => {
    let lastScrollPosition = 0;

    const handleScroll = () => {
      const currentScrollPosition = window.scrollY;
      const maxScrollPosition =
        document.documentElement.scrollHeight - window.innerHeight;

      // التحقق من إذا كنا عند القمة أو القاع
      if (currentScrollPosition <= 0 || currentScrollPosition >= maxScrollPosition) {
        return; // لا يتم الدوران إذا كنا عند القمة أو القاع
      }

      // حساب الفرق في التمرير
      const scrollDifference = currentScrollPosition - lastScrollPosition;

      if (scrollDifference !== 0) {
        // تحديث زاوية الدوران بناءً على الفرق
        setAvatarRotation((prev) => prev + scrollDifference * -(0.001/0.005));
        lastScrollPosition = currentScrollPosition;
      }
    };

    window.addEventListener("scroll", handleScroll); // إضافة استماع للتمرير
    return () => window.removeEventListener("scroll", handleScroll); // تنظيف الاستماع
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
          <div className={`message ${messageClass}`} onClick={messageAction}>
            {message}
          </div>
        ) : (
          <div className={`logo ${logoVisible ? "show" : "hide"}`}>
            PIZZA Time
          </div>
        )}
      </div>

      <div className="contain-right">
        <div
          className="meAvatar"
          style={{
            transform: `rotate(${avatarRotation}deg)`, // تطبيق الدوران بناءً على الحالة
            transition: "transform 0.1s linear", // تأثير سلس للدوران
          }}
        >
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