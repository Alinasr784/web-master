import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faChevronLeft , faChevronRight} from "@fortawesome/free-solid-svg-icons";

import "../css/carousel.css"
function Carousel(){
  return(
    <div className="carousel">
      <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1" id="carouselBtn"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2" id="carouselBtn"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3" id="carouselBtn"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="3" aria-label="Slide 3" id="carouselBtn"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="4" aria-label="Slide 3" id="carouselBtn"></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src="/assets/images/bannar1.gif" class="d-block w-100" alt="..."/>
          </div>
          <div className="carousel-item">
            <img src="/assets/images/bannar2.jpg" class="d-block bannar" alt="..."/>
          </div>
          <div className="carousel-item">
            <img src="/assets/images/bannar3.jpg" class="d-block bannar" alt="..."/>
          </div>
          <div className="carousel-item">
            <img src="/assets/images/bannar4.jpg" class="d-block bannar" alt="..."/>
          </div>
          <div className="carousel-item">
            <img src="/assets/images/bannar5.jpg" class="d-block bannar" alt="..."/>
          </div>
          
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
          <FontAwesomeIcon icon={faChevronLeft} style={{color:"inherit",fontSize:"inherit"}}/>
          </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
          <FontAwesomeIcon icon={faChevronRight} style={{color:"inherit",fontSize:"inherit"}}/>
        </button>
      </div>
    </div>
  )
}

export default Carousel;