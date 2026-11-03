import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import V2TopBar from "./V2TopBar";
import V2AddressSearch from "./V2AddressSearch";
import "../../Pages/HomePageV2/v2.css";

/* شيل الصفحات الداخلية — نفس كروم V2 بتاع الهوم (topbar + عنوان + بحث)
   على الديسكتوب. الموبايل بيفضل على الـ MobilePageHeader زي ما هو. */
const V2PageShell = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();
  // صفحة السيرش عندها الـ search bar بتاعها — نخفي سيرش الـ header عشان ميتكررش
  const isSearchPage = pathname.startsWith("/search");

  return (
    <div className="v2-shell">
      <div className="v2-inner">
        <div className="d-none d-lg-block">
          <V2TopBar />
          {!isSearchPage && <V2AddressSearch />}
        </div>
        {children}
      </div>
    </div>
  );
};

export default V2PageShell;
