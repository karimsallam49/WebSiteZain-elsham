import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { setLanguage } from "../../store/Language/LanguageSlice";
import { useAppSelector } from "../../Hooks/hooks";
import { LogoBaseUrl } from "../../EndPoints/EndPoints";

const V2TopBar = () => {
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();
  const { resturantdata } = useAppSelector(
    (state) => state.restaurantSettingsSlice
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

  return (
    <div className="v2-topbar">
      <button
        type="button"
        className="v2-lang"
        onClick={() => switchTo(isAr ? "en" : "ar")}
      >
        <span className={isAr ? "active-lang" : ""}>ع</span>
        <span className="sep">|</span>
        <span className={!isAr ? "active-lang" : ""}>EN</span>
      </button>

      <Link to="/" className="v2-brand">
        {logo && (
          <img
            src={logo}
            alt=""
            style={{ height: 26, objectFit: "contain", marginBottom: 2 }}
          />
        )}
        <span className="v2-brand-name">
          {resturantdata?.restaurant_name || "زين الشام"}
        </span>
        <span className="v2-brand-sub">{t("v2.brandSub")}</span>
      </Link>

      <Link to="/" className="v2-backlink">
        {t("v2.backToSite")}
        <ArrowLeft size={14} className="v2-back-arrow" />
      </Link>
    </div>
  );
};

export default V2TopBar;
