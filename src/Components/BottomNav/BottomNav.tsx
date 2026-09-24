import { Link, useLocation } from "react-router-dom";
import { useAppSelector } from "../../Hooks/hooks";
import MobileSideBare from "../MobileSideBare/MobileSideBare";
import CartImage from "../../assets/icon/shopping-cart.png";
import { Heart, Home, User } from "lucide-react";
import "./BottomNavStyle.css";

const BottomNav = () => {
  const location = useLocation();
  const { CartData } = useAppSelector((state) => state.cartSlice);
  const { wishlistData } = useAppSelector((state) => state.wishlistSlice);


  const isCartOrCheckout =
    location.pathname === "/cart" || location.pathname === "/checkout";

  return (
    <div
      className="w-100 d-lg-none bottomNav d-md-flex position-fixed"
      style={{ display: "flex" }}
    >
      <div className="justify-content-between align-items-center w-100 d-flex bottomNav-container position-relative">
        <div className="w-100 d-flex justify-content-between mobile-nav-contain-right  h-100 align-items-center">
          <div className="descktop-lodo">
            <Link to="/" style={{ color: "gray" }}>
                <Home
                className="Grarcolor cursor-pointer"
                size={22}
                strokeWidth={1.6}
                style={{ opacity: isCartOrCheckout ? 0 : 1, transition: "opacity 0.3s ease" }}
              />            </Link>
          </div>

          <div className="position-relative">
            <Link style={{ color: "gray" }} to="/wishlist">
              <Heart className="Grarcolor cursor-pointer" size={22} strokeWidth={1.6} />
            </Link>
            <span
              className="badge bg-danger position-absolute top-0 start-100 translate-middle rounded-pill"
              style={{
                fontSize: "9px",
                padding: "2px 4px",
                minWidth: "14px",
                minHeight: "14px",
              }}
            >
              {wishlistData?.total_size}
            </span>
          </div>

        </div>

        <div className="w-100 d-flex justify-content-between mobile-nav-contain-left  h-100 align-items-center">
          <div className="position-relative">
            <Link style={{ color: "gray" }} to="/profile">
              <User className="Grarcolor cursor-pointer" size={22} strokeWidth={1.6} />
            </Link>
          </div>

          {/* 👇 هنا التبديل بين الكارت والهوم */}
          <div className="mobile-cart-container backgroundMainColor position-absolute">
            <div className="position-relative w-100 h-100 d-flex align-items-center justify-content-center">
              {isCartOrCheckout ? (
                <Link style={{ color: "gray" }} to="/">
                  <Home size={32} strokeWidth={1.6} color="white" />
                </Link>
              ) : (
                <Link style={{ color: "gray" }} to="/cart">
                  <img src={CartImage} width={40} alt="cart" />
                  <span
                    className="badge bg-danger position-absolute translate-middle rounded-pill"
                    style={{
                      fontSize: "17px",
                      padding: "2px 6px",
                      minWidth: "14px",
                      minHeight: "14px",
                      top: "-10px",
                      right: "-25px",
                    }}
                  >
                    {CartData.length}
                  </span>
                </Link>
              )}
            </div>
          </div>

          <MobileSideBare />
        </div>
      </div>
    </div>
  );
};

export default BottomNav;
