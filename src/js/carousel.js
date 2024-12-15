import React, { useEffect, useState } from "react";
import { db } from "./firebase"; // تأكد من مسار Firebase الصحيح
import { doc, getDoc } from "firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import "../css/carousel.css";

function Carousel() {
  const [images, setImages] = useState([]); // حالة لتخزين URLs للصور
  const [loading, setLoading] = useState(true); // حالة التحميل

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const docRef = doc(db, "assets", "images");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data(); // جلب البيانات
          console.log("Document Data: ", data);

          // تحقق من وجود الحقل 'carousel' وأنه من النوع array
          if (data.carousel && Array.isArray(data.carousel) && data.carousel.length > 0) {
            console.log("Valid 'carousel' array found: ", data.carousel);
            setImages(data.carousel); // تحديث الصور
            setLoading(false); // إنهاء التحميل
          } else {
            console.error("Invalid 'carousel' array in the document!");
            setLoading(false);
          }
        } else {
          console.error("No such document found!");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching images: ", error.message);
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="carousel-container">
      {loading ? (
        <div className="loading-text">Loading...</div>
      ) : (
        <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
          {/* Indicators */}
          <div className="carousel-indicators">
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide-to={index}
                className={index === 0 ? "active" : ""}
                aria-label={`Slide ${index + 1}`}
              ></button>
            ))}
          </div>

          {/* Slides */}
          <div className="carousel-inner">
            {images.map((url, index) => (
              <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                <img src={url} className="bannar carousel-img" alt={`Slide ${index + 1}`} />
              </div>
            ))}
          </div>

          {/* Controls */}
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="prev"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="next"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      )}
    </div>
  );
}

export default Carousel;