import { useState } from "react";
import { FaBars, FaList, FaTh } from "react-icons/fa";
import type { Category } from "../../DTO/CategoriesDTO";
import { MobileCategoriesList } from "../MobileCategoryList/MobileCategoryList";
import "./CategoriesMenu.css"
import { useTranslation } from "react-i18next";
interface Props {
  categories: Category[];
  onSelectCategory: (category: Category) => void;
  selectedCategory?: Category | null;
  OnToggleGrid: (action: boolean) => void;
}

const MobileCategories = ({ categories, onSelectCategory,OnToggleGrid }: Props) => {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedCategory, SetselectedCategory] = useState<Category>();
  const { t } = useTranslation();
  const handleSelect = (category: Category) => {
    onSelectCategory(category);
    SetselectedCategory(category);
    setShowMenu(false); 
  };
const [isGrid, setIsGrid] = useState(true);
const toggleGrid = (action:boolean) => {
  setIsGrid(action);
  OnToggleGrid(action);
}
const { i18n } = useTranslation();
const direction = i18n.language === "ar" ? "rtl" : "ltr";
  return (
    <div className="mobile-categories-container w-100 position-relative">
      {/* Header bar */}
      <div className="d-flex justify-content-between align-items-center  rounded px-3 py-2" style={{direction:direction}}>
        <div className="d-flex align-items- align-baseline gap-2">

        <h4 className="fw-semibold text-truncate">
          {selectedCategory?.name ?? t("All-products")}
        </h4>
        <div className="d-flex align-items-center gap-2">
            <button
              className={`btn btn-sm ${isGrid ? "backgroundMainColor text-light" : "btn-outline-danger"}`}
              onClick={() => toggleGrid(true)}
              title="Grid View"
            >
              <FaTh />
            </button>
            <button
              className={`btn btn-sm ${!isGrid ? "btn-danger" : "btn-outline-danger"}`}
              onClick={() => toggleGrid(false)}
              title="List View"
            >
              <FaList />
            </button>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">

        <button
          className="btn btn-outline-secondary TextMainColor border-0"
          onClick={() => setShowMenu(true)}
          >
          <FaBars size={20} />
        </button>
           
          </div>
      </div>

      
      <div
        className={`offcanvas offcanvas-bottom ${showMenu ? "show" : ""}`}
        style={{
          height: "70vh",
          visibility: showMenu ? "visible" : "hidden",
          transition: "transform 0.3s ease-in-out",
        }}
        tabIndex={-1}
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Select Category</h5>
          <button type="button" className="btn-close" onClick={() => setShowMenu(false)}></button>
        </div>
        <div className="offcanvas-body overflow-auto">
          <MobileCategoriesList categories={categories} onSelectCategory={handleSelect} />
        </div>
      </div>

      
      {showMenu && (
        <div
          className="offcanvas-backdrop fade show"
          onClick={() => setShowMenu(false)}
        ></div>
      )}
    </div>
  );
};

export default MobileCategories;
