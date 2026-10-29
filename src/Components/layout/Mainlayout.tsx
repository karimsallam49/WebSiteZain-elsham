import { Outlet, useLocation } from "react-router";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../Hooks/hooks";
import { actRestaurantSettings } from "../../store/ResturantConfiq/aCtResturant";
import { fetchCategories } from "../../store/categories/CategoriesSlice";
import { actWishList } from "../../store/WishList/actWishList";
import { actNotifications } from "../../store/Notificatons/actNotification";
import { actDeliveryFee } from "../../store/DeliveyFee/DeliveryFee";
import { actGetUser } from "../../store/User/actGetUser";
import { actGetCopoun } from "../../store/Coupon/actgetcoupon/actgetcoupon";
import { GetPromoUrl } from "../../EndPoints/EndPoints";
import { actGetadress } from "../../store/Adress/actGetAddress";
import { addadress } from "../../store/Adress/AdressSlice";
import { FetchPages } from "../../store/Pages/PagesSlice";
import { actGetBranch } from "../../store/Branch/BranchSlice";
import { selectAbranch } from "../../store/ResturantConfiq/ResturantConfiqSlice";
import AppdesckTopHeader from "../AppdesktopHeader/AppdesckTopHeader";
import MobilePageHeader from "../MobilePageHeader/MobilePageHeader";
import Footer from "../Footer/Footer";
import BottomNav from "../BottomNav/BottomNav";
import AdressInfo from "../AdressInfo/AdressInfo";
import ChatMealFab from "../ChatMeal/ChatMealFab";
import "./MainLayoutstyle.css";
import i18n from "../../i18n";
import { actBanner } from "../../store/Banner/aCtBanner";
import { loadServerCart } from "../../store/Cart/serverCartSlice";

const Mainlayout = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { currentLanguage } = useAppSelector((state) => state.LanguageSlice);
  const { OTPToken } = useAppSelector((state) => state.OTPauthconfigration);
  const { AdressData } = useAppSelector((state) => state.adressSlice);
const {selectedBranch} =useAppSelector((state)=>state.restaurantSettingsSlice)

  const HideBottom = location.pathname !== "/selectBranch";
  const isV2Home = location.pathname === "/";


  useEffect(() => {
    dispatch(actRestaurantSettings())
      .unwrap()
      .then((res) => {
        const branches = res.branches || [];
        const currentBranchId = branches[0].id;
        dispatch(selectAbranch(currentBranchId));
      })
      .catch((err) => {
        console.error("Error fetching restaurant settings:", err);
        dispatch(selectAbranch(1));
      });



    if (AdressData && AdressData.length > 0) {
      dispatch(addadress(AdressData[0]));
    }
  }, []);
  useEffect(()=>{
    if(!selectedBranch) return
    dispatch(actBanner())
    dispatch(actGetBranch());

    const defer = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 800));
    defer(() => {
      dispatch(actDeliveryFee());
      dispatch(FetchPages());
    });
  },[selectedBranch])

  useEffect(() => {
    document.documentElement.dataset.theme = "v2";

    if (!document.getElementById("v2-fonts")) {
      const link = document.createElement("link");
      link.id = "v2-fonts";
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Marcellus&family=Amiri:wght@400;700&family=Inter:wght@300;400;500;600&family=Almarai:wght@300;400;700;800&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  useEffect(() => {
    i18n.changeLanguage(currentLanguage);
  }, []);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [currentLanguage]);

  useEffect(() => {
    if (!OTPToken) return;

    dispatch(actGetUser());
    dispatch(actWishList());
    dispatch(actNotifications());
    dispatch(actGetCopoun(GetPromoUrl));
    dispatch(actGetadress());
    dispatch(loadServerCart({}));
  }, [OTPToken]);

  return (
    <div className="w-100 all-layout">

      <MobilePageHeader />

      <div className="w-100 container position-relative all-container" style={{ minHeight: "100vh" }}>
        {!isV2Home && (
          <div className="adress-desktop-only w-100">
            <AdressInfo />
          </div>
        )}

        {!isV2Home && <AppdesckTopHeader />}
        <Outlet />
      </div>

      {HideBottom && <BottomNav />}

      {!isV2Home && (
        <div className="d-none d-lg-block">
          <Footer />
        </div>
      )}

      <ChatMealFab />
    </div>
  );
};

export default Mainlayout;
