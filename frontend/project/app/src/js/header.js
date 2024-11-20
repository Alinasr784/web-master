import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faSearch,
  faBox,
  faShoppingCart,
  faSmile,
} from "@fortawesome/free-solid-svg-icons";
import "../css/header.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function Normal() {
  const [logoVisible, setLogoVisible] = useState(true); // للتحكم في عرض الشعار
  const [message, setMessage] = useState(null); // JSX للرسالة
  const [messageAction, setMessageAction] = useState(null); // دالة الرسالة
  const [messageClass, setMessageClass] = useState(""); // كلاس الرسالة للأنيميشن
  const [avatarRotation, setAvatarRotation] = useState(0); // زاوية دوران الصورة
  const [isSearchMode, setIsSearchMode] = useState(false); // التحكم في وضع البحث

  // Notification
  const showMessage = (jsxContent, duration, action) => {
    setMessage(jsxContent); // تمرير JSX بدل النص
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

  // Notification Examples
  const addToCartMessage = () => {
    showMessage(
      <div className="message">
        <div className="messageText card">Product Added</div>
        <div className="messageIcon card">
          <FontAwesomeIcon icon={faBox} className="productIcon" />
          <FontAwesomeIcon icon={faShoppingCart} className="cartIcon" />
        </div>
      </div>,
      4000,
      () => {
        console.log("Message clicked!");
      },
    );
  };

  const welcomeMessage = () => {
    showMessage(
      <div className="message">
        Welcome Ali 
      </div>,
      2000, // وقت عرض الرسالة (5 ثواني)
      () => {
        console.log("Welcome message clicked!");
      },
    );
  };

  useEffect(()=>addToCartMessage(),[])


  // Handle clicks outside the header to exit search mode
  useEffect(() => {
    const handleOutsideClick = (e) => {
      const clickedElement = e.target;

      // إذا لم يكن العنصر جزءًا من البحث أو الصورة الرمزية أو القائمة، أعد الهيدر العادي
      if (
        !clickedElement.closest(".meAvatar") &&
        !clickedElement.closest(".menu") &&
        !clickedElement.closest(".searchBar")
      ) {
        setIsSearchMode(false);
      }
    };

    // إضافة استماع للنقر على مستوى الصفحة
    window.addEventListener("click", handleOutsideClick);
    return () => {
      // تنظيف الاستماع عند إلغاء المكون
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  // Handle double-click to toggle search mode
  const handleDoubleClick = (e) => {
    const clickedElement = e.target;

    // تفعيل وضع البحث إذا لم يكن الضغط على القائمة أو الصورة الرمزية
    if (
      !clickedElement.closest(".meAvatar") &&
      !clickedElement.closest(".menu")
    ) {
      setIsSearchMode(true);
    }
  };

  // Search bar
  const search = () => (
    <div className="searchBar">
      <FontAwesomeIcon icon={faSearch} className="searchIcon" />
      <input type="text" placeholder="Search..." />
    </div>
  );

  // Avatar rotate
  useEffect(() => {
    let lastScrollPosition = 0;

    const handleScroll = () => {
      const currentScrollPosition = window.scrollY;
      const maxScrollPosition =
        document.documentElement.scrollHeight - window.innerHeight;

      // التحقق من إذا كنا عند القمة أو القاع
      if (
        currentScrollPosition <= 0 ||
        currentScrollPosition >= maxScrollPosition
      ) {
        return; // لا يتم الدوران إذا كنا عند القمة أو القاع
      }

      // حساب الفرق في التمرير
      const scrollDifference = currentScrollPosition - lastScrollPosition;

      if (scrollDifference !== 0) {
        // تحويل التمرير إلى درجة دوران بناءً على التغيير في التمرير
        const rotationChange = scrollDifference * (0.0001 / 0.0005); // 0.1deg لكل 0.5px
        setAvatarRotation((prev) => prev + rotationChange);
        lastScrollPosition = currentScrollPosition; // تحديث آخر موقع تم التمرير منه
      }
    };

    window.addEventListener("scroll", handleScroll); // إضافة استماع للتمرير
    return () => window.removeEventListener("scroll", handleScroll); // تنظيف الاستماع
  }, []);

  return (
    <div
      className={`contain ${isSearchMode ? "search-active" : ""}`}
      onDoubleClick={handleDoubleClick}
    >
      {isSearchMode ? (
        search()
      ) : (
        <>
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
                {message} {/* عرض JSX هنا */}
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
                transform: `rotate(${avatarRotation}deg)`,
                transition: "transform 0.1s linear",
              }}
            >
              <img src="/assets/images/Profile.png" alt="Profile" />
            </div>
          </div>
        </>
      )}
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
