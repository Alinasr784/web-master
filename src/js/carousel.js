import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase"; // تأكد من مسار ملف Firebase
import "../css/carousel.css";

function Carousel() {
  const [images, setImages] = useState([]); // حالة لحفظ الـ URLs

  useEffect(() => {
    const fetchCarouselImages = async () => {
      try {
        // الوصول إلى Collection "assets"
        const assetsCollectionRef = collection(db, "assets");
        const snapshot = await getDocs(assetsCollectionRef);

        // البحث عن carousel array في البيانات
        const carouselData = snapshot.docs
          .map((doc) => doc.data())
          .find((data) => data.carousel);

        if (carouselData && Array.isArray(carouselData.carousel)) {
          setImages(carouselData.carousel); // حفظ الـ URLs في الحالة
        } else {
          console.warn("Carousel data not found or is not an array.");
        }
      } catch (error) {
        console.error("Error fetching carousel images:", error);
      }
    };

    fetchCarouselImages();
  }, []);

  return (
    <div className="carousel-container">
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
          {images.map((image, index) => (
            <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
              <img src={image} className="bannar carousel-img" alt={`Slide ${index + 1}`} />
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
    </div>
  );
}

export default Carousel;