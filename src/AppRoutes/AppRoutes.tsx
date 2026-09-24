import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import Mainlayout from "../Components/layout/Mainlayout";
import ProtectedRoutes from "../Components/ProtectedRoutes/ProtectedRoutes";
import LoadingPage from "../Components/LoadingPage/LoadingPage";
import AllCuisinePage from "../Pages/CuisinePage/CuisinePage";
import CuisineProductsPage from "../Pages/cuisineProductsPage/CuisineProductsPage";
import ForgotPassword from "../Pages/ForgotPasswordScreen/ForgotPassword";


const HomePage = lazy(() => import("../Pages/HomePage/HomePage"));
const AllCategoriesPage = lazy(() => import("../Pages/AllCategoriesPage/AllCategoriesPage"));
const CategoryPage = lazy(() => import("../Pages/CategoryPage/CategoryPage"));
const SearchResultPage = lazy(() => import("../Pages/SearchResultPage/SearchResalutage"));
const CartPage = lazy(() => import("../Pages/CartPage/CartPage"));
const WishList = lazy(() => import("../Pages/WishListPage/WishList"));
const NotificationPage = lazy(() => import("../Pages/NotificationPage/NotificationPage"));
const ProfilePage = lazy(() => import("../Pages/ProfilePage/ProfilePage"));
const CheckOutPage = lazy(() => import("../Pages/CheckoutPage/CheckOutPage"));
const CouponPage = lazy(() => import("../Pages/CouponPage/CouponPage"));
const AdressPage = lazy(() => import("../Pages/AdressPage/AdressPage"));
const AdressPageInfo = lazy(() => import("../Pages/adressPageInfo/AdressPageInfo"));
const OrderComplete = lazy(() => import("../Pages/OrderComplete/OrderComplete"));
const PaymentSuccess = lazy(() => import("../Pages/PaymentSuccess/PaymentSuccess"));
const PaymentFail = lazy(() => import("../Pages/PaymentFail/PaymentFail"));
const OrderDetailsPage = lazy(() => import("../Pages/OrderDerails/OrderDerails"));
const OrderTrackingPage = lazy(() => import("../Pages/OrderTrackingPage/OrderrackingPage"));
const MyOrdersPage = lazy(() => import("../Pages/MyOrders/MyOrders"));
const SelectBranch = lazy(() => import("../Pages/SelectBranchPage/SelectBranch"));
const AboutUs = lazy(() => import("../Pages/AboutUs/AboutUs"));
const PrivacyPolicy = lazy(() => import("../Pages/PrivacyPolicy/PrivacyPolicy"));
const TermsAndConditions = lazy(() => import("../Pages/TermsAndConditions/TermsAndConditions"));
const RefundPolicy = lazy(() => import("../Pages/RefundPolicy/RefundPolicy"));
const CancellationPolicy = lazy(() => import("../Pages/CancellationPolicy/CancellationPolicy"));
const Support = lazy(() => import("../Pages/Support/Support"));
const Login = lazy(() => import("../Pages/Login/LoginPage"));
const RegisterWithOTP = lazy(() => import("../Pages/OTPLogin/OTPLoginPage"));


const Loader = () => <LoadingPage/>;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Mainlayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loader />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: "categories",
        element: (
          <Suspense fallback={<Loader />}>
            <AllCategoriesPage />
          </Suspense>
        ),
      },
      {
        path: "category/:categoryId/:name",
        element: (
          <Suspense fallback={<Loader />}>
            <CategoryPage />
          </Suspense>
        ),
      },
      {
        path: "cuisine",
        element: (
          <Suspense fallback={<Loader />}>
            <AllCuisinePage />
          </Suspense>
        ),
      },
      {
        path: "CuisineProductsPage/:id",
        element: (
          <Suspense fallback={<Loader />}>
            <CuisineProductsPage />
          </Suspense>
        ),
      },
      {
        path: "search",
        element: (
          <Suspense fallback={<Loader />}>
            <SearchResultPage />
          </Suspense>
        ),
      },
      {
        path: "cart",
        element: (
          <Suspense fallback={<Loader />}>
            <CartPage />
          </Suspense>
        ),
      },
      {
        path: "wishlist",
        element: (
          <Suspense fallback={<Loader />}>
            <ProtectedRoutes>
              <WishList />
            </ProtectedRoutes>
          </Suspense>
        ),
      },
      {
        path: "about-us",
        element: (
          <Suspense fallback={<Loader />}>
            <AboutUs />
          </Suspense>
        ),
      },
      {
        path: "privacy-policy",
        element: (
          <Suspense fallback={<Loader />}>
            <PrivacyPolicy />
          </Suspense>
        ),
      },
      {
        path: "terms-and-conditions",
        element: (
          <Suspense fallback={<Loader />}>
            <TermsAndConditions />
          </Suspense>
        ),
      },
      {
        path: "refund-policy",
        element: (
          <Suspense fallback={<Loader />}>
            <RefundPolicy />
          </Suspense>
        ),
      },
      {
        path: "support",
        element: (
          <Suspense fallback={<Loader />}>
            <Support />
          </Suspense>
        ),
      },
      {
        path: "cancellation-policy",
        element: (
          <Suspense fallback={<Loader />}>
            <CancellationPolicy />
          </Suspense>
        ),
      },
      {
        path: "login",
        element: (
          <Suspense fallback={<Loader />}>
            <Login />
          </Suspense>
        ),
      },
      {
        path: "register-otp",
        element: (
          <Suspense fallback={<Loader />}>
            <RegisterWithOTP />
          </Suspense>
        ),
      },
      {
        path: "forget-password",
        element: (
          <Suspense fallback={<Loader />}>
            <ForgotPassword />
          </Suspense>
        ),
      },
      {
        path: "notifications",
        element: (
          <Suspense fallback={<Loader />}>
            <NotificationPage />
          </Suspense>
        ),
      },
      {
        path: "profile",
        element: (
          <Suspense fallback={<Loader />}>
            <ProtectedRoutes>
              <ProfilePage />
            </ProtectedRoutes>
          </Suspense>
        ),
      },
      {
        path: "checkout",
        element: (
          <Suspense fallback={<Loader />}>
            <CheckOutPage />
          </Suspense>
        ),
      },
      {
        path: "coupon",
        element: (
          <Suspense fallback={<Loader />}>
            <CouponPage />
          </Suspense>
        ),
      },
      {
        path: "adresspage",
        element: (
          <Suspense fallback={<Loader />}>
            <ProtectedRoutes>
              <AdressPage />
            </ProtectedRoutes>
          </Suspense>
        ),
      },
      {
        path: "adresspageinfo",
        element: (
          <Suspense fallback={<Loader />}>
            <ProtectedRoutes>
              <AdressPageInfo />
            </ProtectedRoutes>
          </Suspense>
        ),
      },
      {
        path: "orderdetails/:order_id",
        element: (
          <Suspense fallback={<Loader />}>
            <ProtectedRoutes>
              <OrderDetailsPage />
            </ProtectedRoutes>
          </Suspense>
        ),
      },
      {
        path: "ordertracking/:order_id",
        element: (
          <Suspense fallback={<Loader />}>
            <OrderTrackingPage />
          </Suspense>
        ),
      },
      {
        path: "selectbranch",
        element: (
          <Suspense fallback={<Loader />}>
            <SelectBranch />
          </Suspense>
        ),
      },
      {
        path: "myorders",
        element: (
          <Suspense fallback={<Loader />}>
            <ProtectedRoutes>
              <MyOrdersPage />
            </ProtectedRoutes>
          </Suspense>
        ),
      },
      {
        path: "order-completed/:order_id",
        element: (
          <Suspense fallback={<Loader />}>
            <OrderComplete />
          </Suspense>
        ),
      },
      {
        path: "payment-success",
        element: (
          <Suspense fallback={<Loader />}>
            <PaymentSuccess />
          </Suspense>
        ),
      },
      {
        path: "payment-fail",
        element: (
          <Suspense fallback={<Loader />}>
            <PaymentFail />
          </Suspense>
        ),
      },
    ],
  },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
