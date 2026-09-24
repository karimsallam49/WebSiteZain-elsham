import { useState, useMemo } from "react";
import type { Category } from "../../DTO/CategoriesDTO";
import { FaChevronDown } from "react-icons/fa";
import "./MobileCategoriesList.css";
import { useTranslation } from "react-i18next";

interface Props {
  categories: Category[];
  onSelectCategory: (category: Category) => void;
}

export const MobileCategoriesList = ({ categories, onSelectCategory }: Props) => {
  const { t } = useTranslation();

  // الكاتيجوري الأب
  const parentCategories = useMemo(
    () => categories.filter((cat) => cat.parent_id?.toString() === "0"),
    [categories]
  );

  const [openCategories, setOpenCategories] = useState<number[]>([]);

  const toggleCategory = (categoryId: number) => {
    setOpenCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <div className="mobile-categories-wrapper">
      <div
        className="categories-list"
        style={{
          direction: (document.body.dir as "ltr" | "rtl") || "ltr",
        }}
      >
        {parentCategories.map((category) => {
          // نفس فكرة childes
          const subCategories = useMemo(() => {
            if (category?.childes?.length > 0) {
              return category.childes;
            } else {
              return categories.filter(
                (sub) => sub.parent_id?.toString() === category.id.toString()
              );
            }
          }, [categories, category]);

          const isOpen = openCategories.includes(category.id);

          return (
            <div key={category.id} className="category-item">
              <div className="category-header">
                <div className="d-flex align-items-center gap-3">
                  <img
                    src={
                      category.banner_image_full_path ??
                      "https://media-files.tryordersystem.com/menu/zainalsham/creating/689e5613691c1.jpeg"
                    }
                    alt={category.name}
                    className="category-img"
                  />
                  <span className="category-name">{category.name}</span>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <span
                    className="view-all"
                    onClick={() => onSelectCategory(category)}
                  >
                    {t("view-all")}
                  </span>

                  <button
                    className="btn p-0 border-0 bg-transparent"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCategory(category.id);
                    }}
                  >
                    <FaChevronDown
                      size={14}
                      className={`chevron-icon ${isOpen ? "rotate" : ""}`}
                    />
                  </button>
                </div>
              </div>

              {isOpen && subCategories.length > 0 && (
                <div className="subcategory-list">
                  {subCategories.map((sub) => (
                    <div
                      key={sub.id}
                      className="subcategory-item"
                      onClick={() => onSelectCategory(sub)}
                    >
                      <span>{sub.name}</span>
                      <FaChevronDown size={12} className="chevron-icon small" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
