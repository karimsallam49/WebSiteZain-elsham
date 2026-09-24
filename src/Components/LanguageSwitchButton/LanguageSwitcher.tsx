import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { setLanguage } from "../../store/Language/LanguageSlice";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const dispatch = useDispatch();

  const toggleLanguage = () => {
    const newLang = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(newLang);
    document.dir = newLang === "ar" ? "rtl" : "ltr"; 
    dispatch(setLanguage(newLang)); 
  };


  return (
    <button
      className="btn text-light backgroundMainColor fw-bold rounded p-2"
      onClick={toggleLanguage}
      style={{ margin:"0 .5rem" }}
    >
      {i18n.language === "ar" ? "EN" : "العربيه"}
    </button>
  );
};

export default LanguageSwitcher;
