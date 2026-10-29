import type { CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import { LayoutGrid } from "lucide-react";
import type { Category } from "../../DTO/CategoriesDTO";

interface Props {
  categories: Category[];
  activeId: number | null;
  /** "الكل" active — قايمة كل المنتجات معروضة */
  allActive: boolean;
  onSelect: (cat: Category | null) => void;
}

const V2CategoryGrid = ({ categories, activeId, allActive, onSelect }: Props) => {
  const { t } = useTranslation();
  const parents = categories.filter((c) => c.parent_id?.toString() === "0");

  if (parents.length === 0) return null;

  return (
    <div className="v2-cat-rail" role="list">
      <div
        className={`v2-cat-tile ${allActive ? "active" : ""}`}
        style={{ "--i": 0 } as CSSProperties}
        onClick={() => onSelect(null)}
        role="listitem"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onSelect(null)}
      >
        <span className="v2-tile-name">{t("v2.all")}</span>
        <LayoutGrid size={18} className="v2-tile-icon" />
      </div>

      {parents.map((cat, idx) => {
        const img = cat.banner_image_full_path || cat.image_full_path;

        return (
          <div
            key={cat.id}
            className={`v2-cat-tile ${activeId === cat.id ? "active" : ""}`}
            style={{ "--i": idx + 1 } as CSSProperties}
            onClick={() => onSelect(cat)}
            role="listitem"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onSelect(cat)}
          >
            <span className="v2-tile-name">{cat.name}</span>
            {img && <img src={img} alt={cat.name} loading="lazy" />}
          </div>
        );
      })}
    </div>
  );
};

export default V2CategoryGrid;
