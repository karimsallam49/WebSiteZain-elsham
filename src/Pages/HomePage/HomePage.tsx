import { useEffect, useRef, useState } from "react";
import "./menu.css";
import { CategoriesComponents } from "../../Components/CategoreisComponent/CategoriesComponents";
import { HeaderComponent } from "../../Components/HeaderComponent/HeaderComponent";
import { BackGroundImage } from "../../Components/BackGroundImage/BackGrounImage";
import CategorisHomePage from "../../Components/CategoriesHomePage/CategorisHomePage";
import type { Category } from "../../DTO/CategoriesDTO";
import RecommindationSection from "../../Components/RecommendationSection/RecommindationSection";
import BannerComponent from "../../Components/BannerComponent/BannerComponent";
import SearchComponent from "../../Components/SearchComponent/SearchComponent";
// import AppdesckTopHeader from "../../Components/AppdesktopHeader/AppdesckTopHeader";
import CategoriesBoxs from "../../Components/CategoriesBoxs/CategoriesBoxs";
import AdressInfo from "../../Components/AdressInfo/AdressInfo";
import GoodTimeSection from "../../Components/GoodTimeSection/GoodTimeSection";
import LanguageSwitcher from "../../Components/LanguageSwitchButton/LanguageSwitcher";
import PromotComponent from "../../Components/PromotComponent/PromotComponent";

const MenuPage = () => {
  const [CurrentCategory, setCurrentCategory] = useState<Category>();
  const [ToggleView, settoggleView] = useState<boolean>(true);
  const [showBanner, setShowBanner] = useState(false);
  useEffect(() => {
    const bannerShownThisSession = sessionStorage.getItem("promoBannerShown");

    if (!bannerShownThisSession) {
      const timer = setTimeout(() => {
        setShowBanner(true);
        sessionStorage.setItem("promoBannerShown", "true");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, []);
 
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="menu-page-container container position-relative p-0">
       {showBanner && <PromotComponent />}

     
      <div
        ref={scrollRef}
        className="menu-page-content w-100 d-flex flex-column align-items-center position-relative"
        style={{ overflowY: "auto", maxHeight: "100vh",padding:"0" }} 
      >
    
          <div className="d-block d-md-none position-absolute top-0 start-0 z-3 m-2">
          <LanguageSwitcher />
        </div>
        <div className="menu-banner w-100">
          <BackGroundImage />
        </div>

        <div className="menu-content w-100">
          <div className="menu-header">
            <HeaderComponent />
          </div>

          <div className="w-100 menu-home-body d-flex flex-column align-items-center">
            <div style={{ marginTop: "0rem",display:"flex" }} className="w-100 d-lg-none d-md-flex d-sm-flex flex-column align-items-center justify-content-center">
              <div style={{ width:"90%" }}>
              <AdressInfo/>

              </div>
              <SearchComponent />
            </div>

            <BannerComponent BannerType="banner" />
            <CategoriesBoxs />
            <GoodTimeSection/>
            <RecommindationSection />
            <BannerComponent BannerType="ads" />

            <div className="menu-categories-mobile w-100">
              <CategoriesComponents
                toggleGrid={settoggleView}
                onSelectCategory={(category) => setCurrentCategory(category)}
              />
            </div>

            <div className="w-100 d-flex justify-content-center">
              <div className="menu-categories-descktop">
                <CategoriesComponents
                  toggleGrid={settoggleView}
                  onSelectCategory={(category) => setCurrentCategory(category)}
                />
              </div>

              
              <CategorisHomePage
                isGrid={ToggleView}
                category={CurrentCategory}
                scrollRef={scrollRef}
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
