import { useAppSelector, useAppDispatch } from "../../Hooks/hooks";
import {
  Card,
  Button,
  Row,
  Col,
  Image,
} from "react-bootstrap";
import { FaMinus, FaPlus, FaTrashAlt } from "react-icons/fa";
import {
  increaseQuantity,
  decreaseQuantity,
  RemoveFromCart,
} from "../../store/Cart/CartSlice";
import "./CartPage.css";
import { ImageUrl } from "../../EndPoints/EndPoints";
import { useNavigate } from "react-router";
import CArtEmptImage from "../../assets/image/empty-Cart.png";
import driving from "../../assets/svg/driving_svg.svg";
import walkingSvg from "../../assets/svg/walking_svg.svg";
import { useState } from "react";
import PromoCodePopup from "../../Components/PromoCodePopup/PromoCodePopup";
import coupon_svg from "../../assets/svg/coupon_icon.svg";
import { useTranslation } from "react-i18next"; 
import FeedbackToast from "../../Components/FeedbackToast/FeedbackToast";

const CartPage = () => {
  const { t } = useTranslation(); 

  const { CartData } = useAppSelector((state) => state.cartSlice);
  const dispatch = useAppDispatch();
  const Navigate = useNavigate();
  const [showPromoModal, setShowPromoModal] = useState(false);
  const { CouponVerifyData } = useAppSelector((state) => state.CouponSlice);
  const {resturantdata,selectedBranch}=useAppSelector((state)=>state.restaurantSettingsSlice)
  const {OTPToken}=useAppSelector((state)=>state.OTPauthconfigration)
  const CurrentBranch=resturantdata?.branches.find((el)=>el.id===selectedBranch)
  const [showToast, setShowToast] = useState(false); 
  // const addonsprice=CartData.map((el)=>el.)
 
const itemsPrice = CartData.reduce(
  (sum, item) => sum + item.price * item.quantity,
  0
);

const addonsPrice = CartData.reduce((sum, item) => {
  if (!item.selected_addons || item.selected_addons.length === 0) return sum;

 const itemAddonsTotal = (item.selected_addons as { price: number; qty: number }[]).reduce(
  (aSum, addon) => aSum + addon.price * addon.qty,
  0
);

  return sum + itemAddonsTotal * item.quantity;
}, 0);

const discount = CouponVerifyData ? CouponVerifyData.discount : 0;
const tax = 0;
const StartTime = CurrentBranch?.preparation_time;
const EndTime = (StartTime ?? 1) + 10;

const appliedDiscount =
  CouponVerifyData?.discount_type === "percent"
    ? ((itemsPrice + addonsPrice) * discount) / 100
    : discount;

const totalAmount = itemsPrice + addonsPrice - appliedDiscount + tax;

  const handleCheckout=()=>{
    if(!OTPToken){
       setShowToast(true);
    Navigate("/register-otp", { state: { fromCart: true } });


      }
      else{
     Navigate("/checkout")
    }
  }
  return (
    <div className="cart-page container py-4">
      <FeedbackToast
        message={t("please_login_first") || "يجب تسجيل الدخول أولاً"}
        show={showToast}
        onClose={() => setShowToast(false)}
        type="error"
      />
      {CartData.length === 0 ? (
        <div className="w-100 d-flex align-items-center justify-content-center" style={{ height: "30vh" }}>
          <div className="d-flex h-100 flex-column align-items-center justify-content-center">
            <img className="w-100 h-100 object-fit-contain" src={CArtEmptImage} alt="" />
            <Button onClick={()=>Navigate("/")} className="backgroundMainColor w-50 border-0">
              {t("exploreNow")}
            </Button>
          </div>
        </div>
      ) : (
        <Row>
          <Col lg={8}>
            <Card className="p-3 border-0 shadow-sm mb-3 rounded-4" style={{ backgroundColor: "#faf9f8" }}>
              <div className="d-flex justify-content-between align-items-start flex-column mb-4">
                <i className="bi bi-geo-alt text-danger"></i>
                <div className="d-flex justify-content-between align-items-start w-100 mb-4">
                  <strong className="mb-4"> {CurrentBranch?.name} </strong>
                  <Button
                  onClick={()=>Navigate("/selectBranch")}
                    variant="link"
                    className="p-0 text-decoration-none"
                    style={{ color: "var(--MainColor)" }}
                  >
                    {t("change")}
                  </Button>
                </div>

                <div className="w-100">
                  <div className="text-muted w-100 d-flex align-items-center justify-content-between gap-2">
                    <Image
                      src={walkingSvg}
                      alt="start icon"
                      style={{ width: "80px", height: "80px" }}
                    />
                    <h3>
                      {t("estimateDeliveryTime")}: <b>{StartTime}Min - {EndTime}Min</b>
                    </h3>
                    <Image
                      src={driving}
                      alt="end icon"
                      style={{ width: "80px", height: "80px" }}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {CartData.map((item) => (
              <Card
                key={item.id}
                className="p-3 border-0 shadow-sm mb-3 rounded-4"
              >
                <Row className="align-items-center">
                  <Col xs={3} md={2}>
                    <Image
                      src={`${ImageUrl}/${item.image}`}
                      alt={item.name}
                      thumbnail
                      className="rounded-3"
                      style={{
                        width: "100%",
                        height: "80px",
                        objectFit: "cover",
                      }}
                    />
                  </Col>

                  <Col xs={9} md={5}>
                    <h6 className="fw-semibold mb-1">{item.name}</h6>
                    <div className="text-muted small">
                      {item.description?.slice(0, 40)}...
                    </div>
                    <Button
                      variant="link"
                      className="text-danger p-0 mt-1 small"
                      onClick={() => dispatch(RemoveFromCart(item.id))}
                    >
                      <FaTrashAlt /> {t("remove")}
                    </Button>
                  </Col>

                  <Col
                    xs={12}
                    md={5}
                    className="d-flex justify-content-between align-items-center mt-3 mt-md-0"
                  >
                    <div className="fw-bold" style={{ color: "var(--MainColor)" }}>
                      {item.original_price && Number(item.original_price) !== Number(item.price) && (
                        <del className="text-secondary small me-2">
                          {Number(item.original_price).toFixed(2)} EGP
                        </del>
                      )}
                      {Number(item.price).toFixed(2)} EGP
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <Button
                        variant="light"
                        size="sm"
                        className="rounded-circle border"
                        onClick={() => dispatch(decreaseQuantity(item.id))}
                      >
                        <FaMinus />
                      </Button>
                      <span style={{ margin: "0 1rem", fontSize: "large" }}>
                        {item.quantity}
                      </span>
                      <Button
                        size="sm"
                        className="rounded-circle border backgroundMainColor text-light"
                        onClick={() => dispatch(increaseQuantity(item.id))}
                      >
                        <FaPlus />
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card>
            ))}
          </Col>

          <Col lg={4}>
            <Card className="p-3 shadow-sm border-0 rounded-4 sticky-top z-3" style={{ backgroundColor: "#faf9f8" }}>
              <div className="d-flex justify-content-between flex-column w-100 align-items-center mb-3 ">
                <div className="d-flex justify-content-between w-100 align-items-center ">
                  <span className="fw-semibold">{t("applyPromo")}</span>
                  <Button
                    variant="link"
                    className="text-decoration-none fw-bold p-0"
                    style={{ color: "var(--MainColor)" }}
                    onClick={() => setShowPromoModal(true)}
                  >
                    {t("addPromo")}
                  </Button>
                </div>

                {CouponVerifyData && (
                  <Card className="w-100 d-flex align-content-center " style={{ borderRadius: "5px" }}>
                    <div className="w-100 d-flex align-items-center p-2">
                      <img style={{ width: "18px", margin: "0 10px" }} src={coupon_svg} alt="" />
                      <span style={{ margin: "0 10px" }}>{CouponVerifyData.code}</span>
                      <span className="MainColor">({CouponVerifyData.discount})</span>
                    </div>
                  </Card>
                )}
              </div>

              <div className="small text-muted mb-2 "style={{ padding:"0 5px" }}>
                <div className="d-flex justify-content-between">
                  <span>{t("itemsPrice")}</span>
                  <span>{itemsPrice} EGP</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>{t("discount")}</span>
                  <span>(-) {discount} EGP</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>{t("tax")}</span>
                  <span>(+) {tax} EGP</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-semibold">
                  <span>{t("totalAmount")}</span>
                  <span style={{ color: "var(--MainColor)" }}>
                    {totalAmount} EGP
                  </span>
                </div>
              </div>

              <Button
                variant="dark"
                className="w-100 p-2 fw-semibold mt-3"
                style={{ backgroundColor: "var(--MainColor)", border: "none" }}
                onClick={handleCheckout}
              >
                {t("proceedToCheckout")}
              </Button>
            </Card>
          </Col>
        </Row>
      )}

      <PromoCodePopup
        showPromoModal={showPromoModal}
        setShowPromoModal={setShowPromoModal}
      />
    </div>
  );
};

export default CartPage;
