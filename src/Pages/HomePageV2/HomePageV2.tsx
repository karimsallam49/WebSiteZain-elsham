import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../Hooks/hooks";
import type { Category } from "../../DTO/CategoriesDTO";
import {
  GoodTimeProductUrL,
  recommendedProductUrL,
} from "../../EndPoints/EndPoints";
import LazyRender from "../../Components/LazyRender/LazyRender";
import V2TopBar from "../../Components/V2/V2TopBar";
import V2AddressSearch from "../../Components/V2/V2AddressSearch";
import V2HeroSlider from "../../Components/V2/V2HeroSlider";
import V2CategoryGrid from "../../Components/V2/V2CategoryGrid";
import V2MenuList from "../../Components/V2/V2MenuList";
import V2ProductSection from "../../Components/V2/V2ProductSection";
import V2CartBar from "../../Components/V2/V2CartBar";
import V2Marquee from "../../Components/V2/V2Marquee";
import "./v2.css";

const HomePageV2 = () => {
  const { t } = useTranslation();
  const { categories } = useAppSelector((state) => state.CategoriesSlice);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handlePillSelect = (cat: Category | null) => {
    setActiveCategory(cat);
    menuRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="v2-shell">
      <div className="v2-inner">
        <V2TopBar />
        <V2AddressSearch />
        <V2HeroSlider />
        <V2CategoryGrid
          categories={categories}
          activeId={activeCategory?.id ?? null}
          onSelect={handlePillSelect}
        />

        {/* العروض + الريكومنديد — بتتخبى لما قسم يتختار ومنتجاته تيجي مكانهم */}
        {activeCategory === null && (
          <>
            <LazyRender minHeight={240}>
              <V2ProductSection
                title={t("Good_Time")}
                url={GoodTimeProductUrL}
                limit={6}
              />
            </LazyRender>

            <LazyRender minHeight={240}>
              <V2ProductSection
                title={t("Recommendation")}
                url={recommendedProductUrL}
                limit={6}
              />
            </LazyRender>
          </>
        )}

        {/* المنتجات — 10 عناصر وزرار عرض الكل */}
        <div className="v2-section-title" ref={menuRef}>
          <span className="dash" />
          <h2 className="txt">
            {activeCategory ? activeCategory.name : t("v2.ourMenu")}
          </h2>
        </div>
        <V2MenuList category={activeCategory} />

        <V2Marquee />
      </div>

      <V2CartBar />
    </div>
  );
};

export default HomePageV2;
