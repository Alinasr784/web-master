import React from "react";
import { Link } from "react-router-dom";
import "../css/thanks.css"; // Ensure you create this CSS file

function Thanks() {
  return (
    <div className="thanks-page">
      <div className="thanks-container">
        <h1 className="thanks-title">Thank You!</h1>
        <p className="thanks-message">
          Your order has been successfully placed. We appreciate your trust in us!
        </p>
        <div className="thanks-animation">
          <div className="heart-animation">
            <div className="heart"></div>
          </div>
        </div>
        <Link to="/" className="home-btn">
          Go Back to Home
        </Link>
      </div>
    </div>
  );
}

export default Thanks;