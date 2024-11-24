import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faSearch,
  faBox,
  faShoppingCart,
  faSmile,
  faHome,
  faPalette,
  faShapes,
  faEnvelope,
  faSignInAlt,
  faUser,
  faCogs,
  faEllipsisH,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import Offcanvas from "react-bootstrap/Offcanvas";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../css/header.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
function Normal() {
  const [logoVisible, setLogoVisible] = useState(true); // للتحكم في عرض الشعار
  const [message, setMessage] = useState(null); // JSX للرسالة
  const [messageAction, setMessageAction] = useState(null); // دالة الرسالة
  const [messageClass, setMessageClass] = useState(""); // كلاس الرسالة للأنيميشن
  const [avatarRotation, setAvatarRotation] = useState(0); // زاوية دوران الصورة
  const [isSearchMode, setIsSearchMode] = useState(false); // التحكم في وضع البحث
  const [offcanvas, setOffcanvas] = useState(false);
  const [user, setUser] = useState(null); // لحفظ حالة المستخدم
  const [login, setLogin] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(true); // لتبديل الوضع

  const handleShowCanvas = () => setOffcanvas(true);
  const handleCloseCanvas = () => setOffcanvas(false);
  const canvas = () => {
    return (
      <>
        <Offcanvas
          show={offcanvas}
          onHide={handleCloseCanvas}
          backdropClassName="Offcanvas"
        >
          <Offcanvas.Header>
            <Offcanvas.Title className="navTitle">Brand AD</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <div className="menu">
              <button className="menu-item">
                <FontAwesomeIcon icon={faHome} className="menu-icon" />
                <span>Home page</span>
              </button>
              <button className="menu-item">
                <FontAwesomeIcon icon={faPalette} className="menu-icon" />
                <span>Your designs</span>
              </button>
              <button className="menu-item">
                <FontAwesomeIcon icon={faShapes} className="menu-icon" />
                <span>Ready made designs</span>
              </button>
              <button className="menu-item">
                <FontAwesomeIcon icon={faEnvelope} className="menu-icon" />
                <span>Contact us</span>
              </button>
              <button className="menu-item login">
                <FontAwesomeIcon
                  icon={faSignInAlt}
                  className="menu-icon login-icon"
                />
                <span>{user ? "Logout" : "Login"}</span>
              </button>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      </>
    );
  };

  // Login popup
  const loginpopup = () => {
    return (
      <>
        <div className="form">
          {/* زر الإغلاق أعلى يمين الـ popup */}
          <div className="close-popup" onClick={handleClosePopup}>
            <FontAwesomeIcon icon={faTimes} />
          </div>

          {isSignUpMode ? (
            // نموذج إنشاء حساب
            <form className="login-form" onSubmit={handleSignUp}>
              <input type="email" name="email" placeholder="Email" required />
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
              />
              <button type="submit" className="createAccount">
                Create Account
              </button>
              <p className="message">
                Already have an account?{" "}
                <a href="#" onClick={() => setIsSignUpMode(false)}>
                  Login
                </a>
              </p>
            </form>
          ) : (
            // نموذج تسجيل الدخول
            <form className="login-form" onSubmit={handleLogin}>
              <h1>True</h1>
              <input type="email" name="email" placeholder="Email" required />
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
              />
              <button type="submit" className="sign-in">
                Sign In
              </button>
              <p className="message">
                Don't have an account?{" "}
                <a href="#" onClick={() => setIsSignUpMode(true)}>
                  Sign Up
                </a>
              </p>
            </form>
          )}
        </div>
      </>
    );
  };
  const handleSignUp = (e) => {
    e.preventDefault(); // منع إعادة تحميل الصفحة
    const email = e.target.email.value; // الحصول على البريد من الفورم
    const password = e.target.password.value; // الحصول على كلمة المرور من الفورم

    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Account created successfully", user);
        setUser(user); // حفظ المستخدم في الحالة
        setLogin(false); // إغلاق نافذة تسجيل الدخول
        alert("Account created successfully!");
      })
      .catch((error) => {
        console.error("Sign-up failed:", error.message);
        alert("Sign-up failed: " + error.message);
      });
  };
  const handleLogin = (e) => {
    e.preventDefault(); // منع التحديث الافتراضي
    const email = e.target.email.value;
    const password = e.target.password.value;

    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setUser(user); // تحديث حالة المستخدم
        setLogin(false); // إغلاق نافذة تسجيل الدخول
        console.log("Logged in successfully:", user);
      })
      .catch((error) => {
        console.error("Login failed:", error.message);
        alert("Login failed: " + error.message); // عرض رسالة خطأ
      });
  };

  // دالة إغلاق الـ popup
  const handleClosePopup = () => {
    // قم بتعريف setShowPopup حسب حالتك لإخفاء الـ popup
    setLogin(false);
  };

  //Login check
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // إذا كان هناك مستخدم مسجل دخول، سيُحدث الحالة
    });
    return () => unsubscribe(); // التنظيف عند إزالة المكون
  }, []);

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
  // Handle horizontal scroll for Offcanvas
  useEffect(() => {
    let touchStartX = 0;
    let currentX = 0;
    const activationThreshold = 100; // المسافة اللازمة لتنفيذ الفتح/الإغلاق
    const maxOffcanvasMovement = window.innerWidth * 0.7; // 70% من العرض

    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
      currentX = e.touches[0].clientX;
      const deltaX = currentX - touchStartX;

      const offcanvasElement = document.querySelector(".offcanvas");
      if (!offcanvas && deltaX > 0) {
        // السحب يمينًا لفتح
        const translateValue = Math.min(deltaX, maxOffcanvasMovement);
        if (offcanvasElement) {
          offcanvasElement.style.transition = "none";
          offcanvasElement.style.transform = `translateX(${translateValue}px)`;
        }
      } else if (offcanvas && deltaX < 0) {
        // السحب يسارًا للإغلاق
        const translateValue = Math.max(deltaX, -maxOffcanvasMovement);
        if (offcanvasElement) {
          offcanvasElement.style.transition = "none";
          offcanvasElement.style.transform = `translateX(${translateValue}px)`;
        }
      }
    };

    const handleTouchEnd = () => {
      const deltaX = currentX - touchStartX;
      const offcanvasElement = document.querySelector(".offcanvas");

      if (!offcanvas && deltaX > activationThreshold) {
        // فتح إذا تجاوز المستخدم العتبة
        setOffcanvas(true);
      } else if (offcanvas && deltaX < -activationThreshold) {
        // إغلاق إذا تجاوز المستخدم العتبة
        setOffcanvas(false);
      }

      if (offcanvasElement) {
        offcanvasElement.style.transition = ""; // استعادة الانتقالات
        offcanvasElement.style.transform = offcanvas
          ? "translateX(0)"
          : "translateX(-100%)";
      }
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [offcanvas]);
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
      <div className="message">Welcome Ali</div>,
      2000, // وقت عرض الرسالة (5 ثواني)
      () => {
        console.log("Welcome message clicked!");
      },
    );
  };

  useEffect(() => addToCartMessage(), []);

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
            <div className="menunav">
              <FontAwesomeIcon
                icon={faBars}
                onClick={() => handleShowCanvas()}
              />
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
                Brand Ad
              </div>
            )}
          </div>

          <div className="contain-right">
            {user ? (
              <div className="meAvatar dropdown">
                <img
                  src="/assets/images/Profile.png"
                  alt="Profile"
                  className="dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                />
                <ul className="dropdown-menu">
                  <li>
                    <a className="dropdown-item" href="#">
                      <FontAwesomeIcon
                        icon={faUser}
                        style={{ marginRight: "10px" }}
                      />{" "}
                      Profile
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      <FontAwesomeIcon
                        icon={faCogs}
                        style={{ marginRight: "10px" }}
                      />{" "}
                      Wishlist
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      <FontAwesomeIcon
                        icon={faEllipsisH}
                        style={{ marginRight: "10px" }}
                      />{" "}
                      Orders
                    </a>
                  </li>
                </ul>
              </div>
            ) : (
              <div
                onClick={() => {
                  setLogin(true);
                }}
              >
                Login
              </div>
            )}
          </div>
          {offcanvas && canvas()}
          {login && loginpopup()}
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
