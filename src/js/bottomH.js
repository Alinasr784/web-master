import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faShoppingCart,
  faHeart,
  faClipboardList,
} from "@fortawesome/free-solid-svg-icons";
import "../css/bottomH.css";
import { useNavigate, useLocation } from "react-router-dom";

function Item({ text, icon, isActive, onClick }) {
  return (
    <div
      className={`item ${isActive ? "active" : ""}`} // Add active class if isActive is true
      onClick={onClick} // Trigger the onClick function
    >
      <div className="item-content">
        <div className={`icon ${isActive ? "active" : ""}`}>{icon}</div>
        <div className={`text ${isActive ? "active" : ""}`}>{text}</div>
      </div>
    </div>
  );
}

function BottomH() {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location

  const isActive = (path) => location.pathname === path; // Check if the current path matches

  return (
    <div className="bottom-header">
      <div className="containB">
        <Item
          text={"Home"}
          icon={<FontAwesomeIcon icon={faHome} />}
          isActive={isActive("/")}
          onClick={() => navigate("/")}
        />
        <Item
          text={"Cart"}
          icon={<FontAwesomeIcon icon={faShoppingCart} />}
          isActive={isActive("/cart")}
          onClick={() => navigate("/cart")}
        />
        <Item
          text={"Wish List"}
          icon={<FontAwesomeIcon icon={faHeart} />}
          isActive={isActive("/wish-list")}
          onClick={() => navigate("/wish-list")}
        />
        <Item
          text={"Orders"}
          icon={<FontAwesomeIcon icon={faClipboardList} />}
          isActive={isActive("/orders")}
          onClick={() => navigate("/orders")}
        />
      </div>
    </div>
  );
}

export default BottomH;