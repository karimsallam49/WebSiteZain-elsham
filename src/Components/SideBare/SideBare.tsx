import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import {
  Trash2,
  User,
  Heart,
  Bell,
  Tag,
  MapPin,
  FileText,
  Info,
  Map,
  Shield,
  ClipboardList,
  LogOut,
} from "lucide-react";
import "./sidebarestyle.css";
import LanguageSwitcher from "../LanguageSwitchButton/LanguageSwitcher";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../Hooks/hooks";
import { useTranslation } from "react-i18next";
import { logout } from "../../store/Auth/OTP/LoginSlice";
import ConfirmPopup from "../confirmPopup/ConfirmPopup";


export default function SideBare() {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const {OTPToken}=useAppSelector((state)=>state.OTPauthconfigration)
  const { UserData } = useAppSelector((state) => state.UserInfoSLice);
  const { wishlistData } = useAppSelector((state) => state.wishlistSlice);
  const { t, i18n } = useTranslation();
  const dir = i18n.dir();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    document.body.dir = dir;
  }, [dir]);

 
  const handleLogout = () => {
   
    dispatch(logout());
    navigate("/login");
  };

  const menuItems = [
    { label: t("Profile"), icon: <User size={34} />, path: "/profile" },
    { label: t("My Orders"), icon: <ClipboardList size={34} />, path: "/MyOrders" },
    { label: t("Favourite"), icon: <Heart size={34} />, path: "/wishlist" },
    { label: t("Notification"), icon: <Bell size={34} />, path: "/notifications" },
    { label: t("Coupon"), icon: <Tag size={34} />, path: "/Coupon" },
      { label: t("Branchs"), icon: <Map size={34} />, path: "/selectbranch" },

    { label: t("Address"), icon: <MapPin size={34} />, path: "/AdressPageInfo" },
    { label: t("Help & Support"), icon: <Info size={34} />, path: "/support" },
    { label: t("About Us"), icon: <Info size={34} />, path: "/about-us" },
    { label: t("Privacy Policy"), icon: <Shield size={34} />, path: "/privacy-policy" },
    { label: t("Terms & Conditions"), icon: <FileText size={34} />, path: "/terms-and-conditions" },
    { label: t("Refund Policy"), icon: <FileText size={34} />, path: "/refund-policy" },
    { label: t("Cancellation Policy"), icon: <FileText size={34} />, path: "/cancellation-policy" },
  ];

  return (
    <aside
      className={`sidebar-container ${dir === "rtl" ? "open-right" : "open-left"}`}
      style={{
        width: "100%",
        borderRadius: "30px",
        direction: dir as "ltr" | "rtl",
        textAlign: dir === "rtl" ? "right" : "left",
      }}
    >
      {/* ✅ الهيدر */}
      <div
        style={{ padding: "1rem" }}
        className={`d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4 ${
          dir === "rtl" ? "flex-row-reverse" : ""
        }`}
      >
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <div
            className="rounded-circle bg-secondary bg-opacity-25 d-flex align-items-center justify-content-center"
            style={{ width: "70px", height: "70px" }}
          ></div>

          <div className="d-flex align-items-center flex-wrap gap-3">
            <div>
              <h6 className="mb-0 text-capitalize">
                {`${UserData?.f_name ?? t("guest")} ${UserData?.l_name ?? ""}`}
              </h6>            
                {
              !OTPToken&&(

                <Link to="register-otp" className="TextMainColor">
            {t("login")}
            </Link>
              )
          }
                <small className="text-muted">{UserData?.email}</small>
            </div>

            <div className="vr mx-2 d-none d-md-block" />

            <div className="d-flex align-items-center gap-3 text-muted small">
              <div>
                <span className="fw-semibold text-dark">{UserData?.orders_count}</span>{" "}
                {t("Orders")}
              </div>
              <div className="vr" />
              <div>
                <span className="fw-semibold text-dark">{wishlistData?.total_size}</span>{" "}
                {t("Favourites")}
              </div>
              <div>
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </div>

        {/* 🌙 الوضع الليلي + حذف الحساب + تسجيل الخروج */}
        <div className="d-flex align-items-center gap-3 flex-wrap">
          {
            OTPToken&&(

              <Button
              variant="link"
              onClick={() => setShowLogoutConfirm(true)}
              className="text-danger text-decoration-none p-0 d-flex align-items-center gap-1"
              >
            <Trash2 size={20} /> {t("Delete Account")}
          </Button>
            )
          }

          <div className="vr" />

       
        </div>
      </div>

     
      <div className="row g-3 p-1">
        {menuItems.map((item) => (<>
        
          <div key={item.label} className="col-2 col-sm-3 ">
            <Link to={item.path} className="text-decoration-none w-100 h-100 d-block ">
              <Button
                variant="light"
                className="w-100  h-100 d-flex flex-column align-items-center justify-content-center py-4 rounded-4 border-1 shadow-sm bg-white hover-danger"
                style={{ minHeight: "190px" }}
                >
                {item.icon}
                <small className="mt-2 text-truncate fs-6 text-dark">{item.label}</small>
              </Button>
            </Link>
          </div>
          
                </>
        ))}

        {
        OTPToken&&(
        <div className="col-2 col-sm-3 ">
                  <div className="w-100 h-100 text-decoration-none w-100 h-100 d-block">

                    <button
                      className="w-100 text-decoration-none w-100 h-100 d-block   h-100 d-flex flex-column align-items-center border-0 justify-content-center py-4 rounded-4 border-1 shadow-sm bg-white hover-danger"
                    onClick={() => setShowLogoutConfirm(true)}
                    >
                    <LogOut size={20} /> 
                    
                    {t("Logout")}
                  </button>
                    </div>

                      </div>
        )
                }
        

      </div>

 
      <ConfirmPopup
        show={showLogoutConfirm}
        message={t("Are_you_sure_you_want_to_log_out?")}
        onConfirm={handleLogout}
        onClose={() => setShowLogoutConfirm(false)}
      />

      <style>
        {`
          .hover-danger:hover {
            color: #dc3545 !important;
            background-color: #f8d7da !important;
            transition: 0.3s;
            transform: translateY(-2px);
          }
        `}
      </style>
    </aside>
  );
}
