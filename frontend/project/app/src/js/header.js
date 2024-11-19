import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSearch } from "@fortawesome/free-solid-svg-icons";
import Lottie from "lottie-react"; // استيراد المكتبة
import CheckMark from "../animations/checkmark.json"; // مسار ملف الأنيميشن
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
    setMessage(jsxContent);  // تمرير JSX بدل النص
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

  // Notification Tester
  useEffect(() => {
    showMessage(
      <div className="message">
        Added To Cart
      </div>,
      3000,
      () => {
        console.log("Message clicked!");
      }
    );

    const tes = setTimeout(() => {
      showMessage(
        <div className="message">
          <div className="messageText">Done Ali</div>
        </div>,
        3000,
        () => {
          console.log("Message clicked!");
        }
      );
    }, 8000);

    return () => {
      clearTimeout(tes);
    };
  }, []);

  // Handle double-click to toggle search mode
  const handleDoubleClick = (e) => {
    const clickedElement = e.target;
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