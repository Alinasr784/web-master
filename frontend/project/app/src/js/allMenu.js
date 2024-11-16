import React, { useEffect, useState } from "react";
import "../css/allMenu.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faShoppingCart,
  faSquare
} from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function products() {
  return [
    {
      id: 1,
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8WW-P0tTnrn196I6Oeki2ZuvbjTrJP8HH4jeAZHMo9Q&s",
      name: "beautiful cat",
      des: "description for this cat",
      price: 150,
      discount: 180
    },
    {
      id: 2,
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8WW-P0tTnrn196I6Oeki2ZuvbjTrJP8HH4jeAZHMo9Q&s",
      name: "beautiful cat",
      des: "description for this cat",
      price: 150,
      discount: 180
    },
    {
      id: 3,
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8WW-P0tTnrn196I6Oeki2ZuvbjTrJP8HH4jeAZHMo9Q&s",
      name: "beautiful cat",
      des: "description for this cat",
      price: 150,
      discount: 180
    }
  ];
}

// Boot ==> bootstrap
function BootCard(props) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [wishList, setWishList] = useState(
    JSON.parse(localStorage.getItem("wish")) || []
  );

  const toggleFavorite = () => {
    setIsFavorite((prevIsFavorite) => {
      if (prevIsFavorite) {
        setWishList((prevWishList) =>
          prevWishList.filter((itemId) => itemId !== props.id)
        );
      } else {
        setWishList((prevWishList) => [...prevWishList, props.id]);
      }
      return !prevIsFavorite;
    });
  };

  // تحديث localStorage عند تغيير wishList
  useEffect(() => {
    localStorage.setItem("wish", JSON.stringify(wishList));
    console.log(wishList); // للتحقق من القيمة في كل تحديث
  }, [wishList]);

  const toggleCart = () => {
    setAddedToCart(!addedToCart);
  };

  return (
    <div className="card-n">
      <div
        className="heart-icon"
        onClick={() => {
          toggleFavorite(props.id);
        }}
      >
        <FontAwesomeIcon
          icon={faHeart}
          style={{ color: isFavorite ? "#ff4d4d" : "#fff" }}
        />
      </div>
      <img src={props.img} alt="Pizza" />
      <div className="card-n-title">{props.name}</div>
      <div className="card-n-text">{props.des}</div>
      <div className="card-n-discount">{props.discount}</div>
      <div className="card-n-price">{props.price} EGP</div>
      <div className="card-n-btns">
        <div className="buttons">
          <button
            className={`cart-button ${addedToCart ? "clicked" : ""}`}
            onClick={toggleCart}
          >
            <span className={addedToCart ? "added" : "add-to-cart"}>
              {addedToCart ? "Added" : "Add to cart"}
            </span>
            <FontAwesomeIcon icon={faShoppingCart} className="fa-shopping-cart" />
            <FontAwesomeIcon icon={faSquare} className="fa-square" />
          </button>
        </div>
      </div>
    </div>
  );
}

function AllMenu() {
  return (
    <div>
      <div className="content">
        {products().map((item) => (
          <BootCard key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
}

export default AllMenu;