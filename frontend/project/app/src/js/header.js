import React from "react";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUser , faTags , faFire , faCoins , faChild , faHeartPulse , faWheatAwnCircleExclamation , faHamburger,faBowlFood,faDrumSteelpan,faArrowRightFromBracket , faListDots, faHeart} from "@fortawesome/free-solid-svg-icons";
import "../css/header.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
const app = initializeApp(firebaseConfig);

function Normal(){
  return(
    <div className="contain">
      <div className="contain-left">
        <div className="menu">
          <FontAwesomeIcon icon={faBars} />
        </div>
      </div>
      <div className="contain-center">
        <div className="logo">PIZZA Time</div>
      </div>
      <div className="contain-right">
        <div className="meAvatae">
          <img src="/assets/images/Profile.png"/>
        </div>
      </div>
    </div>
  )
}
function Header() {
  return (
    <div className="header">
      <Normal/>
    </div>
  );
}

export default Header;
