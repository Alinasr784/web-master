import React from "react";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUser , faTags , faFire , faCoins , faChild , faHeartPulse , faWheatAwnCircleExclamation , faHamburger,faBowlFood,faDrumSteelpan,faArrowRightFromBracket , faListDots, faHeart} from "@fortawesome/free-solid-svg-icons";
import "../css/header.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
const app = initializeApp(firebaseConfig);

function Header() {
  return (
    <div className="header">
      <div className="offcanva">
        <FontAwesomeIcon
          icon={faBars}
          style={{ fontSize: "24px" }}
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasWithBothOptions"
        />
        <div
          className="offcanvas offcanvas-start"
          data-bs-scroll="true"
          tabIndex="-1"
          id="offcanvasWithBothOptions"
          aria-labelledby="offcanvasWithBothOptionsLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasWithBothOptionsLabel" style={{color:"gray"}}>
              Your site sections
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body">
            <div class="offcanvasBtn new">
              <FontAwesomeIcon icon={faTags} style={{marginRight:"13px",fontSize:"24px",width:"24px",height:"24px"}}/>
              <div style={{fontSize:"20px",fontWeight:"500"}}>Whats New?</div>
            </div>
            <div class="offcanvasBtn offers">
              <FontAwesomeIcon icon={faFire} style={{marginRight:"13px",fontSize:"24px",width:"24px",height:"24px"}}/>
              <div style={{fontSize:"20px",fontWeight:"500"}}>Offers</div>
            </div>
            <div class="offcanvasBtn best">
              <FontAwesomeIcon icon={faCoins} style={{marginRight:"13px",fontSize:"24px",width:"24px",height:"24px"}}/>
              <div style={{fontSize:"20px",fontWeight:"500"}}>Best sellers</div>
            </div>
            <div class="offcanvasBtn kid">
              <FontAwesomeIcon icon={faChild} style={{marginRight:"13px",fontSize:"24px",width:"24px",height:"24px"}}/>
              <div style={{fontSize:"20px",fontWeight:"500"}}>Kid's Menu</div>
            </div>
            <div class="offcanvasBtn health">
              <FontAwesomeIcon icon={faHeartPulse} style={{marginRight:"13px",fontSize:"24px",width:"24px",height:"24px"}}/>
              <div style={{fontSize:"20px",fontWeight:"500"}}>Healthy choices</div>
            </div>
            <div class="offcanvasBtn vegetarian">
              <FontAwesomeIcon icon={faWheatAwnCircleExclamation} style={{marginRight:"13px",fontSize:"24px",width:"24px",height:"24px"}}/>
              <div style={{fontSize:"20px",fontWeight:"500"}}>Vegetarian Menu</div>
            </div>
            <div class="offcanvasBtn combos">
              <FontAwesomeIcon icon={faHamburger} style={{marginRight:"13px",fontSize:"24px",width:"24px",height:"24px"}}/>
              <div style={{fontSize:"20px",fontWeight:"500"}}>Special combos</div>
            </div>
            <div class="offcanvasBtn seasonal">
              <FontAwesomeIcon icon={faBowlFood} style={{marginRight:"13px",fontSize:"24px",width:"24px",height:"24px"}}/>
              <div style={{fontSize:"20px",fontWeight:"500"}}>Seasonal Dishes</div>
            </div>
            <div class="offcanvasBtn allmenu">
              <FontAwesomeIcon icon={faDrumSteelpan} style={{marginRight:"13px",fontSize:"24px",width:"24px",height:"24px"}}/>
              <div style={{fontSize:"20px",fontWeight:"500"}}>All Menu</div>
            </div>
          </div>
        </div>
      </div>
      <div className="logo">
        <div className="logoContent">
          <img src="/assets/images/PIZZA.png"></img>
        </div>
      </div>
      <div className="profile dropdown">
        <FontAwesomeIcon
          icon={faUser}
          style={{ fontSize: "24px" }}
          className="dropdown-toggle"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        />
        <ul className="dropdown-menu">
          <li>
            <a className="dropdown-item" href="#" style={{display:"flex",alignItems:"center"}}>
              <FontAwesomeIcon icon={faUser} style={{marginRight:"13px"}}/>
              My profile 
            </a>
          </li>
          <li>
            <a className="dropdown-item" href="#" style={{display:"flex",alignItems:"center"}}>
              <FontAwesomeIcon icon={faListDots} style={{marginRight:"13px",color:"gray"}}/>
              My orders
            </a>
          </li>
          <li>
            <a className="dropdown-item" href="#" style={{display:"flex",alignItems:"center"}}>
              <FontAwesomeIcon icon={faHeart} style={{marginRight:"13px",color:"red"}}/>
              My wishlist
            </a>
          </li>
          <li>
            <a className="dropdown-item" href="#" style={{display:"flex",alignItems:"center",color:"white",background:"indianred"}}>
              <FontAwesomeIcon icon={faArrowRightFromBracket} style={{marginRight:"10px",color:"white"}}/>
              Log out
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Header;
