import { useAppSelector, useAppDispatch } from "../../Hooks/hooks";
import {
  Card,
  Button,
  Row,
  Col,
  Image,
} from "react-bootstrap";
import { Minus, Plus, Trash2 } from "lucide-react";
import { loadServerCart } from "../../store/Cart/serverCartSlice";
import CartOffersPicker from "../../Components/CartOffersPicker/CartOffersPicker";
import { useCart } from "../../Hooks/useCart";
import "./CartPage.css";
import { useNavigate } from "react-router";
import CArtEmptImage from "../../assets/image/empty-Cart.png";
import driving from "../../assets/svg/driving_svg.svg";
import walkingSvg from "../../assets/svg/walking_svg.svg";
import { useEffect, useRef, useState } from "react";
import PromoCodePopup from "../../Components/PromoCodePopup/PromoCodePopup";
import coupon_svg from "../../assets/svg/coupon_icon.svg";
import { useTranslation } from "react-i18next"; 
import FeedbackToast from "../../Components/FeedbackToast/FeedbackToast";
import { getItemVariationsTotal } from "../../utilities/cartPricing";

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
  const { items: cartItems, summary: serverCart, syncing: cartSyncing, increase, decrease, remove } = useCart();
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!OTPToken) return;
    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => {
      dispatch(
        loadServerCart({
          order_type: "delivery",
          coupon_code: CouponVerifyData?.code || undefined,
        })
      );
    }, 300);
    return () => {
      if (syncTimer.current) clearTimeout(syncTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [OTPToken, CouponVerifyData?.code]);
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

const variationsPrice = CartData.reduce((sum, item) => {
  const itemVariationsTotal = getItemVariationsTotal(item);
  if (itemVariationsTotal === 0) return sum;
  return sum + itemVariationsTotal * item.quantity;
}, 0);

const discount = CouponVerifyData ? CouponVerifyData.discount : 0;
const tax = 0;
const StartTime = CurrentBranch?.preparation_time;
const EndTime = (StartTime ?? 1) + 10;

const appliedDiscount =
  CouponVerifyData?.discount_type === "percent"
    ? ((itemsPrice + addonsPrice + variationsPrice) * discount) / 100
    : discount;

const totalAmount =
  itemsPrice + addonsPrice + variationsPrice - appliedDiscount + tax;

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
      {cartItems.length === 0 && !cartSyncing ? (
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

            {cartItems.map((item) => {
              return (
              <Card
                key={item.key}
                className={`p-3 border-0 shadow-sm mb-3 rounded-4 ${
                  item.locked ? "cart-prize-locked" : ""
                }`}
              >
                <Row className="align-items-center">
                  <Col xs={3} md={2}>
                    <Image
                      src={item.image || CArtEmptImage}
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
                    <h6 className="fw-semibold mb-1">
                      {item.name}
                      {item.isPrize && (
                        <span
                          className="badge ms-2"
                          style={{
                            backgroundColor: item.free
                              ? "var(--MainColor)"
                              : "transparent",
                            color: item.free ? "#fff" : "var(--MainColor)",
                            border: `1px solid var(--MainColor)`,
                            fontSize: "10px",
                          }}
                        >
                          {item.free
                            ? t("cart.free_prize") || "🎁 مجاني"
                            : t("cart.prize") || "جايزة"}
                        </span>
                      )}
                    </h6>
                    {item.description && (
                      <div className="text-muted small">
                        {item.description.slice(0, 40)}...
                      </div>
                    )}
                    {item.addonsText && (
                      <div className="d-flex flex-wrap gap-1 mt-1">
                        {item.addonsText.split("، ").map((a, i) => (
                          <span
                            key={i}
                            className="small px-2 py-1"
                            style={{
                              border: "1px solid var(--v2-hairline, #ddd)",
                              borderRadius: "8px",
                              background: "rgba(201, 163, 91, 0.08)",
                              color: "var(--v2-cream-dim, #888)",
                              fontSize: "0.7rem",
                            }}
                          >
                            + {a}
                          </span>
                        ))}
                      </div>
                    )}
                    {!item.available && (
                      <div className="text-danger small mt-1">
                        ⚠ {item.reason}
                      </div>
                    )}
                    {(item.prizeReason || item.prizeHint) && !item.free && (
                      <div className="cart-prize-reason">
                        <span className="cart-prize-reason-icon">🎁</span>
                        <div>
                          <div className="cart-prize-reason-title">
                            {t("cart.prize_almost") || "قريب من جايزتك!"}
                          </div>
                          <div className="cart-prize-reason-text">
                            {item.prizeReason ?? item.prizeHint}
                            {item.remainingToUnlock != null &&
                              ` — ${t("cart.remaining") || "فاضل"} ${item.remainingToUnlock}`}
                          </div>
                        </div>
                      </div>
                    )}
                    {!item.locked && (
                      <Button
                        variant="link"
                        className="text-danger p-0 mt-1 small"
                        onClick={() => remove(item)}
                      >
                        <Trash2 size={16} /> {t("remove")}
                      </Button>
                    )}
                  </Col>

                  <Col
                    xs={12}
                    md={5}
                    className="d-flex justify-content-between align-items-center mt-3 mt-md-0"
                  >
                    <div className="fw-bold" style={{ color: "var(--MainColor)" }}>
                      {item.free ? (
                        <span className="text-success">
                          {item.originalUnitPrice != null && (
                            <del className="text-secondary small me-2">
                              {item.originalUnitPrice.toFixed(2)} EGP
                            </del>
                          )}
                          {t("cart.free_prize") || "مجاني"}
                        </span>
                      ) : (
                        <>
                          {item.originalUnitPrice != null &&
                            item.originalUnitPrice > item.unitPrice && (
                              <del className="text-secondary small me-2">
                                {item.originalUnitPrice.toFixed(2)} EGP
                              </del>
                            )}
                          {item.unitPrice.toFixed(2)} EGP
                        </>
                      )}
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      {item.displayOnly ? (
                        <span className="badge" style={{ border: "1px solid var(--v2-hairline)", color: "var(--v2-cream-dim)", fontWeight: 500 }}>
                          {t("cart.display_only") || "للعرض فقط"}
                        </span>
                      ) : (
                        <>
                          <Button
                            variant="light"
                            size="sm"
                            className="rounded-circle border"
                            onClick={() => decrease(item)}
                          >
                            <Minus />
                          </Button>
                          <span style={{ margin: "0 1rem", fontSize: "large" }}>
                            {item.quantity}
                          </span>
                          <Button
                            size="sm"
                            className="rounded-circle border backgroundMainColor text-light"
                            onClick={() => increase(item)}
                          >
                            <Plus />
                          </Button>
                        </>
                      )}
                    </div>
                  </Col>
                </Row>
              </Card>
              );
            })}
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

              <CartOffersPicker />

              <div className="small text-muted mb-2 "style={{ padding:"0 5px" }}>
                {serverCart ? (
                  <>
                    <div className="d-flex justify-content-between">
                      <span>{t("itemsPrice")}</span>
                      <span>{serverCart.subtotal.toFixed(2)} EGP</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>{t("tax")}</span>
                      <span>(+) {serverCart.total_tax.toFixed(2)} EGP</span>
                    </div>
                    {serverCart.items.some((i) => (i.addons_tax ?? 0) > 0) && (
                      <div className="text-end" style={{ fontSize: "0.68rem", opacity: 0.7 }}>
                        {t("tax_addons_note") ||
                          "شامل ضريبة الإضافات"}
                      </div>
                    )}
                    {serverCart.discounts.coupon > 0 && (
                      <div className="d-flex justify-content-between">
                        <span>{t("discount")} — {t("cart.coupon") || "كوبون"}</span>
                        <span>(-) {serverCart.discounts.coupon.toFixed(2)} EGP</span>
                      </div>
                    )}
                    {serverCart.discounts.referral > 0 && (
                      <div className="d-flex justify-content-between">
                        <span>{t("cart.referral") || "خصم الإحالة"}</span>
                        <span>(-) {serverCart.discounts.referral.toFixed(2)} EGP</span>
                      </div>
                    )}
                    {serverCart.discounts.first_order > 0 && (
                      <div className="d-flex justify-content-between">
                        <span>{t("cart.first_order") || "خصم أول طلب"}</span>
                        <span>(-) {serverCart.discounts.first_order.toFixed(2)} EGP</span>
                      </div>
                    )}
                    {serverCart.discounts.loyalty > 0 && (
                      <div className="d-flex justify-content-between">
                        <span>{t("cart.loyalty") || "نقاط الولاء"}</span>
                        <span>(-) {serverCart.discounts.loyalty.toFixed(2)} EGP</span>
                      </div>
                    )}
                    {serverCart.discounts.spin_prize + serverCart.discounts.spin_free_product > 0 && (
                      <div className="d-flex justify-content-between">
                        <span>{t("cart.spin_prizes") || "جوائز عجلة الحظ"}</span>
                        <span>
                          (-) {(serverCart.discounts.spin_prize + serverCart.discounts.spin_free_product).toFixed(2)} EGP
                        </span>
                      </div>
                    )}
                    {serverCart.discounts.spin_free_delivery && (
                      <div className="text-success fw-semibold mt-1">
                        {t("cart.free_delivery_spin") || "🚚 توصيل مجاني من عجلة الحظ"}
                      </div>
                    )}
                    {serverCart.discounts.coupon_error && (
                      <div className="text-danger small mt-1">
                        {serverCart.discounts.coupon_error}
                      </div>
                    )}
                    {serverCart.discounts.loyalty_error && (
                      <div className="text-danger small mt-1">
                        {serverCart.discounts.loyalty_error}
                      </div>
                    )}
                    <hr />
                    <div className="d-flex justify-content-between fw-semibold">
                      <span>{t("totalAmount")}</span>
                      <span style={{ color: "var(--MainColor)" }}>
                        {serverCart.payable_total.toFixed(2)} EGP
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="d-flex justify-content-between">
                      <span>{t("itemsPrice")}</span>
                      <span>
                        {(itemsPrice + addonsPrice + variationsPrice).toFixed(2)} EGP
                      </span>
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
                        {totalAmount.toFixed(2)} EGP
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* عروض اتشالت أو اتمنعت — الباك بيشرحها وإحنا بنعرضها */}
              {serverCart?.dropped_offers && serverCart.dropped_offers.length > 0 && (
                <div className="alert alert-warning py-2 small mb-3" style={{ fontSize: "0.78rem" }}>
                  {serverCart.dropped_offers.map((o: any, i: number) => (
                    <div key={i}>
                      {o.label ?? o.name} — {o.reason ?? o.message}
                    </div>
                  ))}
                </div>
              )}
              {serverCart?.offer_conflicts && serverCart.offer_conflicts.length > 0 && (
                <div className="alert alert-warning py-2 small mb-3" style={{ fontSize: "0.78rem" }}>
                  {serverCart.offer_conflicts.map((c: any, i: number) => (
                    <div key={i}>
                      {c.message ?? c.offer}
                      {c.blocked_by?.length ? ` (${c.blocked_by.join(", ")})` : ""}
                    </div>
                  ))}
                </div>
              )}
              {serverCart && serverCart.pending_prizes.length > 0 && (
                <div className="w-100 mb-2" style={{ padding: "0 5px" }}>
                  <div className="fw-semibold small mb-1">
                    {t("cart.pending_prizes") || "جوائز معلّقة"} 🎁
                  </div>
                  {serverCart.pending_prizes.map((p) => (
                    <div
                      key={p.id}
                      className="small text-muted border rounded p-2 mb-1"
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-semibold">{p.label}</span>
                        {p.eligible ? (
                          <span className="badge bg-success">
                            {t("cart.prize_eligible") || "متاحة"}
                          </span>
                        ) : (
                          <span className="badge bg-secondary">
                            {t("cart.prize_locked") || "لم تُفعّل بعد"}
                          </span>
                        )}
                      </div>
                      {p.note && <div>{p.note}</div>}
                      {p.min_order_amount != null && p.min_order_amount > 0 && (
                        <div>
                          {t("cart.prize_min_order") || "الحد الأدنى للطلب"}:{" "}
                          {p.min_order_amount} EGP
                        </div>
                      )}
                      {p.order_type && (
                        <div>
                          {t("cart.prize_order_type") || "نوع الطلب"}:{" "}
                          {t(`orderType.${p.order_type}`) !== `orderType.${p.order_type}`
                            ? t(`orderType.${p.order_type}`)
                            : p.order_type}
                        </div>
                      )}
                      {p.expires_at && (
                        <div className="text-danger">
                          {t("cart.prize_expires") || "تنتهي في"}: {p.expires_at}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

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
