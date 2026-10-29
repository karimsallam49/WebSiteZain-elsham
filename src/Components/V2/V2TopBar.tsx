import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Bell, ShoppingBag, User } from "lucide-react";
import { setLanguage } from "../../store/Language/LanguageSlice";
import { useAppSelector } from "../../Hooks/hooks";
import { useCart } from "../../Hooks/useCart";
import { LogoBaseUrl } from "../../EndPoints/EndPoints";

const V2TopBar = () => {
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  const { resturantdata } = useAppSelector(
    (state) => state.restaurantSettingsSlice
  );
  const { count: cartCount } = useCart();
  const { notificationsData } = useAppSelector(
    (state) => state.notificationsSlice
  );
  const isAr = i18n.language === "ar";

  const switchTo = (lang: "ar" | "en") => {
    if (lang === i18n.language) return;
    i18n.changeLanguage(lang);
    document.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = document.dir;
    dispatch(setLanguage(lang));
  };

  const logo = resturantdata?.restaurant_logo
    ? `${LogoBaseUrl}${resturantdata.restaurant_logo}`
    : null;

  const unreadCount = notificationsData?.length ?? 0;

  return (
    <div className="v2-topbar">
      <Link to="/" className="v2-brand">
        {logo ? (
          <img
            src={logo}
            alt={resturantdata?.restaurant_name || ""}
            className="v2-brand-logo"
          />
        ) : (
          <span className="v2-brand-name">
            {resturantdata?.restaurant_name || "زين الشام"}
          </span>
        )}
      </Link>

      <div className="v2-topbar-actions">
        <Link to="/notifications" className="v2-icon-btn" aria-label="notifications">
          <Bell size={19} strokeWidth={1.8} />
          {!!unreadCount && unreadCount > 0 && (
            <span className="v2-icon-badge">{unreadCount}</span>
          )}
        </Link>

        <Link to="/profile" className="v2-icon-btn" aria-label="profile">
          <User size={19} strokeWidth={1.8} />
        </Link>

        <Link to="/cart" className="v2-icon-btn" aria-label="cart">
          <ShoppingBag size={19} strokeWidth={1.8} />
          {cartCount > 0 && (
            <span className="v2-icon-badge">{cartCount}</span>
          )}
        </Link>

        <button
          type="button"
          className="v2-icon-btn v2-lang-btn"
          onClick={() => switchTo(isAr ? "en" : "ar")}
        >
          {isAr ? "EN" : "ع"}
        </button>
      </div>
    </div>
  );
};

export default V2TopBar;
