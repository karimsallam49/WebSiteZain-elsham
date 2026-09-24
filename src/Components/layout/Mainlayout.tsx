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
import "./MainLayoutstyle.css";
import i18n from "../../i18n";
import { actBanner } from "../../store/Banner/aCtBanner";

const Mainlayout = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { currentLanguage } = useAppSelector((state) => state.LanguageSlice);
  const { OTPToken } = useAppSelector((state) => state.OTPauthconfigration);
  const { AdressData } = useAppSelector((state) => state.adressSlice);
const {selectedBranch} =useAppSelector((state)=>state.restaurantSettingsSlice)

  const HideBottom = location.pathname !== "/selectBranch";


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
      });



    if (AdressData && AdressData.length > 0) {
      dispatch(addadress(AdressData[0]));
    }
  }, []);
  useEffect(()=>{
    if(!selectedBranch) return  
    dispatch(actBanner())
    dispatch(actDeliveryFee());
    dispatch(actGetadress());
    dispatch(FetchPages());
    dispatch(actGetBranch());
  },[selectedBranch])

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
  }, [OTPToken]);

  return (
    <div className="w-100 all-layout">

      <MobilePageHeader />

      <div className="w-100 container position-relative all-container" style={{ minHeight: "100vh" }}>
        <div className="adress-desktop-only w-100">
          <AdressInfo />
        </div>

        <AppdesckTopHeader />
        <Outlet />
      </div>

      {HideBottom && <BottomNav />}

      <div className="d-none d-lg-block">
        <Footer />
      </div>
    </div>
  );
};

export default Mainlayout;
