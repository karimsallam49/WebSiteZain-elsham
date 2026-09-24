import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistStore,persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
 } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import LoginSlice from './Auth/Login/LoginSlice'
import OTPLoginSlice from './Auth/OTP/LoginSlice'
import  restaurantSettingsSlice  from './ResturantConfiq/ResturantConfiqSlice'
import LanguageSlice from "./Language/LanguageSlice"
import CategoriesSlice from "./categories/CategoriesSlice"
import notificationsSlice from "./Notificatons/NotificationsSLice"
import wishlistSlice from "./WishList/WishListSlice"
import cartSlice from "./Cart/CartSlice"
import DeliveryFeeSlice from "./DeliveyFee/DeliveryFeeSlice"
import UserInfoSLice from "./User/userSlice"
import CouponSlice from "./Coupon/CouponSlice"
import adressSlice from "./Adress/AdressSlice"
import OrderdetailsSlice from"./OrderDetails/OrderDetailsSlice"
import PagesSlice from "./Pages/PagesSlice"
import BranchImages from "./Branch/BranchSlice"
import bannerSlice from "./Banner/BannerSlice"
// import oTPauthSlice from "./Auth/OTP/LoginSlice"
const authconfigration={
  key:"Authslice",
  storage,
  whitelist:["users","accsessToken"]

}
const ResturantConfiq={
  key:"restaurantSettings",
  storage,
  whitelist:["selectedBranch"]

}
const OTPauthconfigration={
  key:"OTPAuthslice",
  storage,
  whitelist:["users","OTPToken"]

}
const UserInfoConfiqration={
  key:"User",
  storage,
  whitelist:["userLocation"]

}
const cartconfigration={
  key:"cart",
  storage,
  whitelist:["CartData"]

}



const rootpersistconfgritaion={

key:"root",
storage,
whitelist:["cart","Authslice","OTPauthconfigration","User","restaurantSettings"]
}

const rootreducer= combineReducers({

 
  Authslice:persistReducer(authconfigration,LoginSlice),
    OTPauthconfigration:persistReducer(OTPauthconfigration,OTPLoginSlice),
    cartSlice:persistReducer(cartconfigration,cartSlice),
    restaurantSettingsSlice:persistReducer(ResturantConfiq,restaurantSettingsSlice),
    CategoriesSlice,
    notificationsSlice,
    wishlistSlice,
    CouponSlice,
    PagesSlice,
    bannerSlice,
    BranchImages,
    adressSlice,
    OrderdetailsSlice,
    DeliveryFeeSlice,
    UserInfoSLice:persistReducer(UserInfoConfiqration,UserInfoSLice),
    LanguageSlice
//   cartslices:persistReducer(cartconfigration,cartslices),
  
})
const persistedreducer=persistReducer(rootpersistconfgritaion,rootreducer)
export const store = configureStore({
  reducer:  persistedreducer,
  middleware:(getDefalutmiddleware)=>getDefalutmiddleware({
    serializableCheck:{
      ignoredActions:[  FLUSH,
        REHYDRATE,
        PAUSE,
        PERSIST,
        PURGE,
        REGISTER]
    },
  })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

const persistor=persistStore(store)
export default persistor