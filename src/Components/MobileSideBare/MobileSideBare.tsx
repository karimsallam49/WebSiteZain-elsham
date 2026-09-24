import { useState } from "react";
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
} from "lucide-react";
import { Link } from "react-router-dom";
import "./MobileSideBare.css";
import { useAppSelector, useAppDispatch } from "../../Hooks/hooks";
import SideBareLanguageSwithcer from "../SideBareLanguageSwitcher/SideBareLanguageSwithcer";
import { useTranslation } from "react-i18next";
import CartImage from "../../assets/icon/shopping-cart.png";
import ConfirmPopup from "../confirmPopup/ConfirmPopup"; 
import { logout } from "../../store/Auth/OTP/LoginSlice";

const MobileSideBare = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const { UserData } = useAppSelector((state) => state.UserInfoSLice);
  const {OTPToken}=useAppSelector((state)=>state.OTPauthconfigration)
  const { i18n, t } = useTranslation();
  const dispatch = useAppDispatch();

  const dir = i18n.language === "ar" ? "rtl" : "ltr";

  // ✅ تنفيذ تسجيل الخروج
  const handleLogout = () => {
    dispatch(logout());
    setIsOpen(false);
  };

  const menuItems = [
    { label: t("Profile"), icon: <User size={20} />, path: "/profile" },
    { label: t("My Orders"), icon: <ClipboardList size={20} />, path: "/MyOrders" },
    { label: t("Favourite"), icon: <Heart size={20} />, path: "/wishlist" },
    { label: t("Notification"), icon: <Bell size={20} />, path: "/notifications" },
    { label: t("Coupon"), icon: <Tag size={20} />, path: "/Coupon" },
    
    { label: t("Address"), icon: <MapPin size={20} />, path: "/AdressPageInfo" },
    { label: t("Branchs"), icon: <Map size={20} />, path: "/selectbranch" },
    { label: t("Help & Support"), icon: <Info size={20} />, path: "/support" },
    { label: t("About Us"), icon: <Info size={20} />, path: "/about-us" },
    { label: t("Privacy Policy"), icon: <Shield size={20} />, path: "/privacy-policy" },
    { label: t("Terms & Conditions"), icon: <FileText size={20} />, path: "/terms-and-conditions" },
    { label: t("Refund Policy"), icon: <FileText size={20} />, path: "/refund-policy" },
    { label: t("Cancellation Policy"), icon: <FileText size={20} />, path: "/cancellation-policy" },
  ];

  return (
    <>
      {/* زر فتح القائمة */}
      <Button
        variant="light"
        className="rounded-3 shadow-sm"
        style={{ fontSize: "x-large", color: "gray" }}
        onClick={() => setIsOpen(true)}
      >
        ☰
      </Button>

      {/* Overlay */}
      {isOpen && <div className="overlay" onClick={() => setIsOpen(false)} />}

      {/* القائمة الجانبية */}
      <div className={`mobile-sidebar ${dir} ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header text-light p-4 backgroundMainColor">
          <div className="d-flex text-light justify-content-between align-items-center">
            <h5 className="m-0 text-capitalize text-light ">
             {`${UserData?.f_name ?? t("guest")} ${UserData?.l_name ?? ""}`}
            </h5>
            {
              !OTPToken&&(

                <Link to="register-otp" className="TextMainColor">
            {t("login")}
            </Link>
              )
          }
            <X size={28} className="close-icon" onClick={() => setIsOpen(false)} />
          </div>
          <small className="text-light">{UserData?.email ?? ""}</small>

          <div className="d-flex justify-content-between align-items-center mt-3 text-muted small">
            <div>
              <Link style={{ color: "gray" }} to="/cart">
                <img src={CartImage} width={25} alt="cart" />
              </Link>
            </div>
            <div>
              <span className="fw-semibold text-dark">
                <SideBareLanguageSwithcer />
              </span>
            </div>
            <div>
              <div className="position-relative">
                <Link style={{ color: "white" }} to="wishlist">
                  <Heart className="Grarcolor cursor-pointer" size={22} strokeWidth={1.6} />
                </Link>
              </div>
            </div>
          </div>
        </div>

   
        <div className="sidebar-links p-3">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="sidebar-link d-flex align-items-center gap-3"
              onClick={() => setIsOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}


        {
         OTPToken&&(

           <div
           className="sidebar-link d-flex align-items-center gap-3 text-danger  cursor-pointer"
           onClick={() => setShowLogoutConfirm(true)}
           >
            <LogOut size={20} />
            <span>{t("Logout")}</span>
          </div>
          )
          }
        </div>
      </div>

      
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
