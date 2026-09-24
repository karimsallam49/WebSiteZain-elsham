const baseUrl = import.meta.env.VITE_BaseUrl;
export const  latestProductUrl = `${baseUrl}api/v1/products/latest`;
export const  popularProductUrl = `${baseUrl}api/v1/products/popular`;
export const  setMenuUrl = `${baseUrl}api/v1/products/set-menu`;
export const  recommendedProductUrL = `${baseUrl}api/v1/products/recommended`;
export const  GoodTimeProductUrL = `${baseUrl}api/v1/products/good-time`;
export const  ALLproductUrl = `${baseUrl}api/v1/products/latest?`;
export const ImageUrl= `${baseUrl}storage/app/public/product`;
export const CategoryImg= `${baseUrl}storage/app/public/category`;
export const ResturantIMG= `${baseUrl}storage/app/public/restaurant`;
export const categoriesurl = `${baseUrl}api/v1/categories?limit=500&offset=1&name=`;
export const GetCategoriesProductUrl = `${baseUrl}api/v1/categories/products/`;
export const GetBannersURL = `${baseUrl}api/v1/banners`;
export const BannerImg= `${baseUrl}storage/app/public/banner`;
export const HeaderUrl= `${baseUrl}api/v1/config`;
export const BannnerUrl= `${baseUrl}api/v1/banners`;
export const SearchSuggestionAPI= `${baseUrl}api/v1/products/search-suggestion?`;
export const GetProductByNameAPI= `${baseUrl}api/v1/products/search?`;
export const ResturantConfiqURL= `${baseUrl}api/v1/config`;
export const notificationsUrl= `${baseUrl}api/v1/notifications`;
export const LogoBaseUrl= `${baseUrl}storage/app/public/restaurant/`;
export const OTPPhoneUrl= `${baseUrl}api/v1/auth/check-phone`
export const verifyOTPUrl= `${baseUrl}api/v1/auth/verify-otp`
export const WishListUrl= `${baseUrl}api/v1/customer/wish-list`
export const  addWishListUri = `${baseUrl}api/v1/customer/wish-list/add`;
export const  removeWishListUri = `${baseUrl}api/v1/customer/wish-list/remove`;
export const deliveryfeeUrl= `${baseUrl}api/v1/config/delivery-fee?branch_id=1`
export const frequentlyUrl= `${baseUrl}api/v1/products/frequently-bought?limit=4&&offset=1`
export const DeliveriinfoUrl= `${baseUrl}api/v1/config/delivery-fee?branch_id=1`
export const UserInfoUrl= `${baseUrl}api/v1/customer/info`
export const UpdateUserInfoUrl= `${baseUrl}api/v1/customer/update-profile`
export const PromoUrl= `${baseUrl}api/v1/coupon/apply?`
export const GetPromoUrl= `${baseUrl}api/v1/coupon/list?amount=`
export const PlaceOrderUrl=`${baseUrl}api/v1/customer/order/place`
export const GeOrderDetailsUrl=`${baseUrl}api/v1/customer/order/list`
export const TrackordersUrl=`${baseUrl}api/v1/customer/order/`
export const AddAdressURL=`${baseUrl}api/v1/customer/address/add`
export const DeleteAdress=`${baseUrl}api/v1/customer/address/delete?`
export const CancellOrderURl=`${baseUrl}api/v1/customer/order/cancel`
export const GetHeaderBackGrounImagesURl=`${baseUrl}api/v1/branch/show`
export const GetAdressURL=`${baseUrl}api/v1/customer/address/list?guest_id=null`
export const PagesUrl=`${baseUrl}api/v1/pages`
export const cuisineListUrl=`${baseUrl}api/v1/cuisine/list`
export const cuisineProductsURl=`${baseUrl}api/v1/cuisine/products`
export const LoginByPhoneUrl = `${baseUrl}api/v1/auth/loginbyphone`
export const RegisterByPhoneUrl = `${baseUrl}api/v1/auth/registration-with-otp`
export const ForgetPassordUrl = `${baseUrl}api/v1/auth/forgot-password`
export const verifyOTPForgetPasswordUrl = `${baseUrl}api/v1/auth/verify-token`
export const ResetPasswordUrl = `${baseUrl}api/v1/auth/reset-password`