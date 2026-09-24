import "./CategoriesSideList.css";
import type { Category } from "../../DTO/CategoriesDTO";
import { FaChevronRight } from "react-icons/fa";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  categories: Category[];
  onSelectCategory: (category: Category) => void;
}

export const CategoriesSideList = ({ categories, onSelectCategory }: Props) => {
  const { t } = useTranslation();

  const parentCategories = useMemo(
    () => categories.filter((cat) => cat.parent_id?.toString() === "0"),
    [categories]
  );

  return (
    <div className="accordion acc-des" id="categoriesAccordion">
      {parentCategories.map((category) => {
        const subCategories = useMemo(() => {
          if (category?.childes?.length > 0) {
            return category.childes;
          } else {
            return categories.filter(
              (sub) => sub.parent_id?.toString() === category.id.toString()
            );
          }
        }, [categories, category]);

        return (
          <div className="accordion-item" key={category.id}>
            <h2 className="accordion-header" id={`heading-${category.id}`}>
              <button
                className="accordion-button collapsed d-flex align-items-center"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#collapse-${category.id}`}
                aria-expanded="false"
                aria-controls={`collapse-${category.id}`}
                onClick={() => onSelectCategory(category)}
              >
                <div className="d-flex align-items-center w-100 category-content">
                  <img
                    src={
                      category.banner_image_full_path ??
                      "https://media-files.tryordersystem.com/menu/zainalsham/creating/689e5613691c1.jpg"
                    }
                    alt={category.name}
                  />
                  <div className="d-flex flex-column text-start">
                    <span className="category-name mb-1 d-block">{category.name}</span>
                    {subCategories.length > 0 && (
                      <span
                        className="subcategory-count w-100 text-muted"
                        style={{ fontSize: "13px" }}
                      >
                        {t("number-of-subcategories")} {subCategories.length}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            </h2>

            {subCategories.length > 0 && (
              <div
                id={`collapse-${category.id}`}
                className="accordion-collapse collapse"
                aria-labelledby={`heading-${category.id}`}
                data-bs-parent="#categoriesAccordion"
              >
                <div className="accordion-body py-2">
                  <ul className="list-group list-group-flush">
                    {subCategories.map((sub) => (
                      <li
                        key={sub.id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                        style={{ cursor: "pointer" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCategory(sub);
                        }}
                      >
                        {sub.name}
                        <FaChevronRight size={14} className="text-muted" />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
