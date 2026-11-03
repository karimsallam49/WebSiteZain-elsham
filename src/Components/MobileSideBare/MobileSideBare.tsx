import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "react-bootstrap";
import {
  Heart,
  X,
  User,
  ClipboardList,
  Bell,
  Tag,
  MapPin,
  Info,
  Shield,
  Map,
  FileText,
  LogOut,
  Sun,
  Moon,
  Headphones,
  Star,
  Languages,
  Wallet,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./MobileSideBare.css";
import { useAppSelector, useAppDispatch } from "../../Hooks/hooks";
import { useTranslation } from "react-i18next";
import ConfirmPopup from "../confirmPopup/ConfirmPopup";
import { logout } from "../../store/Auth/OTP/LoginSlice";
import { clearuserinfo } from "../../store/User/userSlice";
import { addadress, clearadress } from "../../store/Adress/AdressSlice";
import { useV2Theme } from "../../Hooks/useV2Theme";
import { setLanguage } from "../../store/Language/LanguageSlice";
import i18n from "../../i18n";

const MobileSideBare = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const { UserData } = useAppSelector((state) => state.UserInfoSLice);
  const { OTPToken } = useAppSelector((state) => state.OTPauthconfigration);
  const { resturantdata } = useAppSelector(
    (state) => state.restaurantSettingsSlice
  );
  const { i18n: i18nInst, t } = useTranslation();
  const dispatch = useAppDispatch();
  const { mode, toggle: toggleTheme } = useV2Theme();

  // i18n.dir() بيرجع دايركشن اللغة الحالية — بيتحدّث فورًا مع تبديل اللغة
  const dir = i18nInst.dir();
  const isAr = i18nInst.language === "ar";

  // الـ topbar بتاع V2 بيبعت event يفتح الـ drawer
  useEffect(() => {
    const open = () => setIsOpen(true);
    window.addEventListener("v2:open-sidebar", open);
    return () => window.removeEventListener("v2:open-sidebar", open);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    // صفّر بيانات اليوزر والعناوين — الـ sidebar يرجع guest فورًا بدون ريفريش
    dispatch(clearuserinfo());
    dispatch(clearadress());
    dispatch(addadress(null));
    setIsOpen(false);
  };

  const toggleLanguage = () => {
    const newLang = isAr ? "en" : "ar";
    i18n.changeLanguage(newLang);
    document.dir = newLang === "ar" ? "rtl" : "ltr";
    dispatch(setLanguage(newLang));
  };

  const gridItems = [
    { label: t("Profile"), icon: <User size={20} />, path: "/profile" },
    { label: t("My Orders"), icon: <ClipboardList size={20} />, path: "/MyOrders" },
    { label: t("Notification"), icon: <Bell size={20} />, path: "/notifications" },
    { label: t("Favourite"), icon: <Heart size={20} />, path: "/wishlist" },
    { label: t("Coupon"), icon: <Tag size={20} />, path: "/Coupon" },
    { label: t("Address"), icon: <MapPin size={20} />, path: "/AdressPageInfo" },
    { label: t("Branchs"), icon: <Map size={20} />, path: "/selectbranch" },
  ];

  // المحفظة بتظهر بس لما الباك إند يفعلها
  const walletEnabled = resturantdata?.wallet_status === 1;
  const sidebarGrid = walletEnabled
    ? [
        ...gridItems.slice(0, 6),
        {
          label: t("walletPage.title"),
          icon: <Wallet size={20} />,
          path: "/wallet",
        },
        gridItems[6],
      ]
    : gridItems;

  const listItems = [
    { label: t("Help & Support"), icon: <Headphones size={20} />, path: "/support" },
    { label: t("About Us"), icon: <Info size={20} />, path: "/about-us" },
    { label: t("Privacy Policy"), icon: <Shield size={20} />, path: "/privacy-policy" },
    { label: t("Terms & Conditions"), icon: <FileText size={20} />, path: "/terms-and-conditions" },
    { label: t("Refund Policy"), icon: <FileText size={20} />, path: "/refund-policy" },
    { label: t("Cancellation Policy"), icon: <FileText size={20} />, path: "/cancellation-policy" },
  ];

  const hotline = resturantdata?.restaurant_phone;

  return (
    <>
      {/* زر فتح القائمة */}
      <Button
        variant="light"
        className="rounded-3"
        style={{ fontSize: "x-large", color: "gray" }}
        onClick={() => setIsOpen(true)}
      >
        ☰
      </Button>

      {/* الـ overlay + الـ drawer بيترندروا على الـ body عشان ميتحبسوش
          جوه الـ stacking context بتاع الـ bottomNav */}
      {createPortal(
        <>
          {isOpen && (
            <div className="overlay" onClick={() => setIsOpen(false)} />
          )}
          <div className={`mobile-sidebar ${dir} ${isOpen ? "open" : ""}`}>
            {/* الهيدر — أفاتار + اسم + نقاط + زر قفل */}
            <div className="msb-header">
              <div className="msb-avatar">
                <User size={26} strokeWidth={1.8} />
              </div>
              <div className="msb-user">
                <div className="msb-name">
                  {`${UserData?.f_name ?? t("guest")} ${UserData?.l_name ?? ""}`}
                </div>
                {OTPToken && UserData?.point != null && (
                  <div className="msb-points">
                    <Star size={13} fill="currentColor" />
                    {UserData.point} {t("points")}
                  </div>
                )}
                {!OTPToken && (
                  <Link to="/register-otp" className="msb-login" onClick={() => setIsOpen(false)}>
                    {t("login")}
                  </Link>
                )}
              </div>
              <button
                type="button"
                className="msb-close"
                onClick={() => setIsOpen(false)}
                aria-label="close"
              >
                <X size={22} />
              </button>
            </div>

            {/* جريد الاختصارات */}
            <div className="msb-grid">
              {sidebarGrid.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="msb-tile"
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
              <button
                type="button"
                className="msb-tile msb-icon-tile"
                onClick={toggleTheme}
                aria-label={mode === "v2" ? t("v2.lightMode") : t("v2.darkMode")}
              >
                {mode === "v2" ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button type="button" className="msb-tile" onClick={toggleLanguage}>
                <Languages size={20} />
                <span>{isAr ? "English" : "العربية"}</span>
              </button>
            </div>

            {/* الخط الساخن */}
            {hotline && (
              <a className="msb-hotline" href={`tel:${hotline}`}>
                <Headphones size={18} />
                {t("hotline")} <span dir="ltr">{hotline}</span>
              </a>
            )}

            {/* صفوف الروابط */}
            <div className="msb-list">
              {listItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="msb-row"
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}

              {OTPToken && (
                <button
                  type="button"
                  className="msb-row msb-danger"
                  onClick={() => {
                    setIsOpen(false);
                    setShowLogoutConfirm(true);
                  }}
                >
                  <LogOut size={20} />
                  <span>{t("Logout")}</span>
                </button>
              )}
            </div>
          </div>
        </>,
        document.body
      )}

      <ConfirmPopup
        show={showLogoutConfirm}
        message={t("Are_you_sure_you_want_to_log_out?")}
        onConfirm={handleLogout}
        onClose={() => setShowLogoutConfirm(false)}
      />
    </>
  );
};

export default MobileSideBare;
