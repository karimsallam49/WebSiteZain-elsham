import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import "./MobilePageHeader.css";

const HIDDEN_PATHS = ["/", "/selectbranch", "/cuisine"];
const HIDDEN_PREFIXES = ["/category/", "/cuisineproductspage"];

const PATH_TITLES: Record<string, string> = {
  "/categories": "categories",
  "/cuisine": "cuisine",
  "/search": "search",
  "/cart": "cart",
  "/wishlist": "wishlist",
  "/about-us": "about",
  "/privacy-policy": "privacy",
  "/terms-and-conditions": "terms",
  "/refund-policy": "refund",
  "/support": "support",
  "/cancellation-policy": "cancellation",
  "/login": "login",
  "/register-otp": "register",
  "/forget-password": "forget_password",
  "/notifications": "notifications",
  "/profile": "profile",
  "/checkout": "checkout",
  "/coupon": "coupon",
  "/adresspage": "address_form",
  "/adresspageinfo": "addresses",
  "/myorders": "my_orders",
  "/payment-success": "payment",
  "/payment-fail": "payment",
};

const MobilePageHeader = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const path = location.pathname.toLowerCase();
  if (
    HIDDEN_PATHS.includes(path) ||
    HIDDEN_PREFIXES.some((prefix) => path.startsWith(prefix))
  )
    return null;

  let title = "";
  if (path.startsWith("/category/") || path.startsWith("/orderdetails/") || path.startsWith("/ordertracking/")) {
    const prefix = path.startsWith("/category/") ? "" : path.startsWith("/orderdetails/") ? "order_details" : "order_tracking";
    title = prefix ? t(`mobile_header.${prefix}`) : decodeURIComponent(location.pathname.split("/").pop() || "");
  } else if (path.startsWith("/cuisineproductspage")) {
    title = t("mobile_header.products");
  } else if (path.startsWith("/order-completed")) {
    title = t("mobile_header.order_completed");
  } else {
    const key = PATH_TITLES[path];
    title = key ? t(`mobile_header.${key}`) : "";
  }

  return (
    <div className="mobile-page-topbar">
      <button
        className="mobile-back-btn"
        onClick={() => navigate(-1)}
        aria-label="back"
      >
        {i18n.language === "ar" ? (
          <ArrowRight size={22} />
        ) : (
          <ArrowLeft size={22} />
        )}
      </button>
      <h6 className="mb-0 fw-bold text-truncate">{title}</h6>
    </div>
  );
};

export default MobilePageHeader;
