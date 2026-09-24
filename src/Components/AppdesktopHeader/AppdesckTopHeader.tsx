import { Link } from "react-router-dom";
import SearchComponent from "../SearchComponent/SearchComponent";
import "./AppdesckTop.css";
import { useAppSelector } from "../../Hooks/hooks";
import { ResturantIMG } from "../../EndPoints/EndPoints";
import MenuBottom from "../MenuBottom/MenuBottom";
import HeaderLinks from "../HeaderLinks/HeaderLinks";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../LanguageSwitchButton/LanguageSwitcher";

const AppdesckTopHeader = () => {
  const { resturantdata } = useAppSelector((state) => state.restaurantSettingsSlice);
  const logoImage = `${ResturantIMG}/${resturantdata?.restaurant_logo}`;
  const { categories } = useAppSelector((state) => state.CategoriesSlice);
  const MainCategories = categories.filter((el) => el.parent_id === 0);
  const { t } = useTranslation();

  return (
    <div
      className="w-100 desctop-header container justify-content-between align-items-center px-3"
      style={{ height: "100px", padding: "0 6rem" }}
    >
      
      <div className="d-flex align-items-center" style={{ flex: 1 }}>
        <div className="descktop-lodo me-3">
          <Link to="/">
            <img
              src={logoImage}
              alt={t("AppDesktopHeader.logo_alt")}
              style={{ width: "120px", objectFit: "contain" }}
            />
          </Link>
        </div>

        <Link
          to="/"
          className="mx-3 text-decoration-none Grarcolor"
          style={{ color: "gray" }}
        >
          {t("AppDesktopHeader.home")}
        </Link>

        <div className="dropdown-custom mx-3 position-relative">
          <span
            className="text-decoration-none Grarcolor dropdown-toggle-custom"
            style={{ color: "gray", cursor: "pointer" }}
          >
            {t("AppDesktopHeader.categories")}
          </span>

          <div className="dropdown-menu-custom shadow-sm">
            {MainCategories.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.id}/${cat.name}`}
                className="dropdown-item-custom text-decoration-none text-dark"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 🔹 البحث */}
      <div
        className="d-flex justify-content-center Grarcolor align-items-center"
        style={{ flex: 2 }}
      >
        <SearchComponent />
      </div>


      <HeaderLinks />
      <LanguageSwitcher/>
      <MenuBottom />
    </div>
  );
};

export default AppdesckTopHeader;
