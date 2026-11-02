import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../Hooks/hooks";
import type { Category } from "../../DTO/CategoriesDTO";
import {
  offersUrl,
  recommendedProductUrL,
  GoodTimeProductUrL,
} from "../../EndPoints/EndPoints";
import LazyRender from "../../Components/LazyRender/LazyRender";
import V2GoodTime from "../../Components/V2/V2GoodTime";
import V2TopBar from "../../Components/V2/V2TopBar";
import V2AddressSearch from "../../Components/V2/V2AddressSearch";
import V2HeroSlider from "../../Components/V2/V2HeroSlider";
import V2CategoryGrid from "../../Components/V2/V2CategoryGrid";
import V2MenuList from "../../Components/V2/V2MenuList";
import V2OrderAgain from "../../Components/V2/V2OrderAgain";
import V2HappyHour from "../../Components/V2/V2HappyHour";
import V2ProductSection from "../../Components/V2/V2ProductSection";
import V2SpinFab from "../../Components/V2/V2SpinFab";
import "./v2.css";

const HomePageV2 = () => {
  const { t } = useTranslation();
  const { categories } = useAppSelector((state) => state.CategoriesSlice);
  const { selectedBranch } = useAppSelector(
    (state) => state.restaurantSettingsSlice
  );
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [activeSub, setActiveSub] = useState<Category | null>(null);
  // القايمة مش بتظهر إلا لما اليوزر يختار قسم أو يدوس "الكل"
  const [menuVisible, setMenuVisible] = useState(false);

  const subCats = activeCategory
    ? categories.filter(
        (c) => String(c.parent_id) === String(activeCategory.id)
      )
    : [];
  const menuRef = useRef<HTMLDivElement | null>(null);

  const allActive = menuVisible && activeCategory === null;

  const handlePillSelect = (cat: Category | null) => {
    if (cat === null) {
      // "الكل" — لو قايمة الكل مفتوحة أصلًا يقفلها ويرجع للسكاشن
      if (allActive) {
        setMenuVisible(false);
        return;
      }
      setActiveCategory(null);
      setMenuVisible(true);
    } else {
      setActiveCategory(cat);
      setActiveSub(null);
      setMenuVisible(true);
    }
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
          allActive={allActive}
          onSelect={handlePillSelect}
        />

        {!menuVisible ? (
          <>
            <LazyRender minHeight={200}>
              <V2OrderAgain />
            </LazyRender>

            <LazyRender minHeight={220}>
              <V2HappyHour />
            </LazyRender>

            <LazyRender minHeight={240}>
              <V2ProductSection
                title={t("v2.offers")}
                url={`${offersUrl}?branch_id=${selectedBranch ?? ""}&serving_type=takeaway`}
                limit={6}
                excludeOfferSource="happy_hour"
              />
            </LazyRender>

            <LazyRender minHeight={240}>
              <V2GoodTime
                title={t("Recommendation")}
                url={recommendedProductUrL}
              />
            </LazyRender>

            <LazyRender minHeight={240}>
              <V2GoodTime
                title={t("v2.recommended")}
                url={GoodTimeProductUrL}
              />
            </LazyRender>
          </>
        ) : (
          <>
            <div ref={menuRef} />
            {subCats.length > 0 && (
              <div className="v2-sub-pills" dir="ltr">
                <button
                  type="button"
                  className={`v2-sub-pill ${activeSub === null ? "active" : ""}`}
                  onClick={() => setActiveSub(null)}
                >
                  {t("v2.all")}
                </button>
                {subCats.map((sub) => (
                  <button
                    key={sub.id}
                    type="button"
                    className={`v2-sub-pill ${
                      activeSub?.id === sub.id ? "active" : ""
                    }`}
                    onClick={() => setActiveSub(sub)}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            )}
            <V2MenuList category={activeSub ?? activeCategory} />
          </>
        )}

      </div>

      <V2SpinFab />
    </div>
  );
};

export default HomePageV2;
