import { useState, type CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import { LayoutGrid } from "lucide-react";
import type { Category } from "../../DTO/CategoriesDTO";

interface Props {
  categories: Category[];
  activeId: number | null;
  onSelect: (cat: Category | null) => void;
}

const V2CategoryGrid = ({ categories, activeId, onSelect }: Props) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const parents = categories.filter((c) => c.parent_id?.toString() === "0");

  if (parents.length === 0) return null;

  const handleAll = () => {
    if (expanded) {
      // لو الـ grid مفتوح → الضغط على "الكل" بيرجّع الفلتر ويقفل
      onSelect(null);
      setExpanded(false);
    } else {
      // لو مغلق → يفتح الـ grid ويعرض كل الأقسام
      setExpanded(true);
    }
  };

  const handleSelect = (cat: Category) => {
    onSelect(cat);
    setExpanded(false);
  };

  return (
    <div
      key={expanded ? "grid" : "rail"}
      className={expanded ? "v2-cat-grid" : "v2-cat-rail"}
      role="list"
    >
      <div
        className={`v2-cat-tile ${activeId === null ? "active" : ""}`}
        style={{ "--i": 0 } as CSSProperties}
        onClick={handleAll}
        role="listitem"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleAll()}
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
            onClick={() => handleSelect(cat)}
            role="listitem"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleSelect(cat)}
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
