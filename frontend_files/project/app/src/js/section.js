import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../css/sections.css";
function Sections() {
  return (
    <div className="sections">
      <div className="single-row-container">
        <div className="section">
          <FontAwesomeIcon className="section-icon" icon={faFire} />
          <div className="section-text">New</div>
        </div>
        <div className="section">    
          <FontAwesomeIcon className="section-icon" icon={faFire}/>
          <div className="section-text">Popular</div>
        </div>
        <div className="section">
          <FontAwesomeIcon className="section-icon" icon={faFire} />
          <div className="section-text">Offers</div>
        </div>
        <div className="section">
          <FontAwesomeIcon className="section-icon" icon={faFire} />
          <div className="section-text">kids</div>
        </div>
        <div className="section">
          <FontAwesomeIcon className="section-icon" icon={faFire} />
          <div className="section-text">Healthy</div>
        </div>
        <div className="section">
          <FontAwesomeIcon className="section-icon" icon={faFire} />
          <div className="section-text">Seasonal</div>
        </div>
        <div className="section">
          <FontAwesomeIcon className="section-icon" icon={faFire} />
          <div className="section-text">Vegetarian</div>
        </div>
        <div className="section">
          <FontAwesomeIcon className="section-icon" icon={faFire} />
          <div className="section-text">Combos</div>
        </div>
        <div className="section">
          <FontAwesomeIcon className="section-icon" icon={faFire} />
          <div className="section-text">All</div>
        </div>
      </div>
    </div>
  );
}
export default Sections;
