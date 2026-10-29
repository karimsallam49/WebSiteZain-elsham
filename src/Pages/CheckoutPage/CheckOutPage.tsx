import { useAppDispatch, useAppSelector } from "../../Hooks/hooks";
import { Card, Row, Col, Form, Modal } from "react-bootstrap";
import "./CheckOutPage.css";
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next"; 

import FavTimeSelectForOrder from "../../Components/FaveTimeSelectForOrder/FavTimeSelectForOrder";
import ChangePaymentSection from "../../Components/ChangePaymentPopup/ChangePaymentPopup";
import UserInformation from "../../Components/UserInformation/UserInformation";
import PlaceOrderDeliverType from "../../Components/PlaceOrderDeliverType/PlaceOrderDeliverType";
import ButtonComponent from "../../Components/Button/ButtonComponent";

import type { PlaceOrderDTO } from "../../DTO/CheckouDTO";
import { actPlaceOrder } from "../../store/PlaceOrder/actPlaceOrder";
import { actGetUser } from "../../store/User/actGetUser";
import { DeleteCard } from "../../store/Cart/CartSlice";
import { loadServerCart, clearServerCart } from "../../store/Cart/serverCartSlice";
import { editeAdressAction } from "../../store/Adress/AdressSlice";
import React from "react";
import i18n from "../../i18n";
import FeedbackToast from "../../Components/FeedbackToast/FeedbackToast";
import AddressForm from "../../Components/AdressForm/AdressForm";
import { getItemUnitPrice } from "../../utilities/cartPricing";

const CheckOutPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation(); 
 const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
const [toastType, setToastType] = useState<"success" | "error">("success");
  const { CartData } = useAppSelector((state) => state.cartSlice);
  const { CouponVerifyData } = useAppSelector((state) => state.CouponSlice);
  const { data: serverCart } = useAppSelector((state) => state.serverCartSlice);
  const { OTPToken } = useAppSelector((state) => state.OTPauthconfigration);
  const { UserData } = useAppSelector((state) => state.UserInfoSLice);
  const { deliverfeeData } = useAppSelector((state) => state.DeliveryFeeSlice);
  const { selectedAdress } = useAppSelector((state) => state.adressSlice);
  const { resturantdata } = useAppSelector((state) => state.restaurantSettingsSlice);

  const [CurrentedArea, setCurrentedArea] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [selectedType, setSelectedType] = useState<
    "delivery" | "take_away" | "dine_in"
  >("delivery");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [UserSelectedTime, SetUserselectedTime] = useState("");
  const [UserSelectedDate, SetUserselectedDate] = useState("");
  const [Loading, setLoading] = useState(false);
  const [ChangeAmount, SetChangeAmount] = useState(0);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [areaError, setAreaError] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [isPartial, setIsPartial] = useState(false);
  const [redeemPoints, setRedeemPoints] = useState(false);
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loyaltyEnabled =
    resturantdata?.loyalty_point_status === 1 && (UserData?.point ?? 0) > 0;

  useEffect(() => {
    if (!OTPToken) return;
    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => {
      dispatch(
        loadServerCart({
          order_type: selectedType,
          coupon_code: CouponVerifyData?.code || undefined,
          redeem_points: redeemPoints ? UserData?.point : undefined,
        })
      );
    }, 300);
    return () => {
      if (syncTimer.current) clearTimeout(syncTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [OTPToken, selectedType, redeemPoints, CouponVerifyData?.code]);

  const selectedBranch = useMemo(
    () => resturantdata?.branches?.find((b) => b.id === selectedBranchId) ?? null,
    [resturantdata, selectedBranchId]
  );

  const requiredFields = useMemo(() => {
    const missing: string[] = [];
    if (!selectedAdress?.contact_person_name?.trim()) missing.push("contact_person_name");
    if (!selectedAdress?.contact_person_number?.trim()) missing.push("contact_person_number");
    if (!selectedAdress?.address?.trim()) missing.push("address");
    if (!selectedAdress?.house?.trim()) missing.push("house");
    if (!selectedAdress?.floor?.trim()) missing.push("floor");
    return missing;
  }, [selectedAdress]);
  const { itemsPrice, totalAmount, currentAreaCharge, isFreeDelivery } = useMemo(() => {
    // لو ملخص السيرفر موجود هو المرجع (شامل الكوبونات والجوائز والضريبة)
    const itemsPrice = serverCart
      ? serverCart.payable_total
      : CartData.reduce(
          (sum, item) => sum + getItemUnitPrice(item) * item.quantity,
          0
        );

    const currentArea = deliverfeeData?.delivery_charge_by_area.find(
      (el) => el.id === CurrentedArea
    );

    const setup = deliverfeeData?.delivery_charge_setup;
    const isFreeDelivery =
      serverCart?.discounts.spin_free_delivery === true ||
      (setup?.free_delivery_over_status === 1 &&
        setup.free_delivery_over_amount >= 0 &&
        itemsPrice >= setup.free_delivery_over_amount);

    const deliveryCharge =
      selectedType === "delivery"
        ? isFreeDelivery
          ? 0
          : currentArea?.delivery_charge ?? 0
        : 0;
    const totalAmount = itemsPrice + deliveryCharge;

    return {
      itemsPrice,
      totalAmount,
      currentAreaCharge: deliveryCharge,
      isFreeDelivery,
    };
  }, [CartData, deliverfeeData, CurrentedArea, serverCart, selectedType]);
  const areProductsAvailable = useCallback(() => {
    if (!UserSelectedTime) return true; 

    const [selectedHour, selectedMinute] = UserSelectedTime.split(":").map(Number);

    return CartData.every((product) => {
      if (!product.available_time_starts || !product.available_time_ends)
        return true;

      const [startHour, startMinute] = product.available_time_starts.split(":").map(Number);
      const [endHour, endMinute] = product.available_time_ends.split(":").map(Number);

      const selected = selectedHour * 60 + selectedMinute;
      const start = startHour * 60 + startMinute;
      const end = endHour * 60 + endMinute;

      return selected >= start && selected <= end;
    });
  }, [CartData, UserSelectedTime]);

  const prepareOrderBody = useCallback(():  PlaceOrderDTO | null => {
        const isAvailable = areProductsAvailable();

    if (!isAvailable) {
      setToastMessage(
        i18n.language === "ar"
          ? "بعض المنتجات غير متاحة في الوقت الذي اخترته."
          : "Some products are not available at the selected time."
      );
      setToastType("error");
      setToastVisible(true);
      return null; 
    }
    const cartBody = serverCart
      ? // مستخدم مسجّل → ابعت سلة السيرفر زي ما هي
        serverCart.items.map((si) => ({
          product_id: `${si.product_id}`,
          price: `${si.final_unit_price}`,
          variant: [],
          variations: si.variations ?? [],
          add_ons: si.addons ?? [],
          selected_addons: si.addons ?? [],
          add_on_ids: si.add_on_ids ?? [],
          add_on_qtys: si.add_on_qtys ?? [],
          discount_amount: si.discount_per_unit ?? 0,
          quantity: si.quantity,
          tax_amount: si.tax_per_unit ?? 0,
        }))
      : CartData.map((el) => ({
          ...el,
          product_id: `${el.id}`,
          price: `${el.price}`,
          variant: [],
          variations: el.variations?.map((v: any) => ({
            ...v,
            label: v.label ?? v.name,
            ar_label: v.ar_label ?? v.ar_name,
          })) ?? [],
          add_ons: el.add_ons?.map((a: any) => ({
            ...a,
            label: a.label ?? a.name,
          })) ?? [],
          selected_addons: el.selected_addons?.map((a: any) => ({
            ...a,
            label: a.label ?? a.name,
          })) ?? [],
          discount_amount: el.discount ?? 0,
          quantity: el.quantity,
          tax_amount: el.tax ?? 0,

        }));

    return {
      cart: cartBody,
      coupon_discount_amount: CouponVerifyData?.discount ?? 0,
      coupon_discount_title: CouponVerifyData?.title ?? "",
      order_amount: itemsPrice,
      order_type: selectedType,
      delivery_address_id: selectedAdress?.id ?? null,
      payment_method: paymentMethod,
      payment_platform:
        paymentMethod === "cash_on_delivery" ||
        paymentMethod === "wallet_payment"
          ? undefined
          : "web",
      order_note: deliveryNotes,
      coupon_code: CouponVerifyData?.code ?? "",
      redeem_points: redeemPoints ? UserData?.point : undefined,
      delivery_time: UserSelectedTime,
      delivery_date: UserSelectedDate,
      branch_id: selectedBranchId ?? 1,
      selected_delivery_area: CurrentedArea ?? 0,
      is_partial: isPartial ? "1" : "0",
      is_cutlery_required: "0",
      bring_change_amount: ChangeAmount,
      distance: 0,
      delivery_address: selectedAdress,
      order_source: "web",
    };
  }, [
    CartData,
    serverCart,
    CouponVerifyData,
    totalAmount,
    itemsPrice,
    selectedType,
    paymentMethod,
    deliveryNotes,
    UserSelectedTime,
    UserSelectedDate,
    CurrentedArea,
    ChangeAmount,
    selectedAdress,
    selectedBranchId,
    isPartial,
    redeemPoints,
    UserData?.point,
  ]);

  const handleCheckout = useCallback(async () => {
    if (!paymentMethod) {
      alert(t("checkout.select_payment_method"));
      return;
    }

    if (
      selectedType === "delivery" &&
      (deliverfeeData?.delivery_charge_by_area?.length ?? 0) > 0 &&
      !CurrentedArea
    ) {
      setAreaError(true);
      setToastMessage(t("checkout.select_area_first"));
      setToastType("error");
      setToastVisible(true);
      return;
    }

    if (
      selectedType === "take_away" &&
      (resturantdata?.branches?.length ?? 0) > 0 &&
      !selectedBranchId
    ) {
      setToastMessage(t("checkout.select_branch_first"));
      setToastType("error");
      setToastVisible(true);
      setShowBranchModal(true);
      return;
    }

    if (selectedType === "delivery" && requiredFields.length > 0) {
      dispatch(editeAdressAction(selectedAdress ?? null));
      setToastMessage(t("checkout.complete_address"));
      setToastType("error");
      setToastVisible(true);
      setShowAddressModal(true);
      return;
    }

    const unavailableItem = serverCart?.items.find((i) => i.available === false);
    if (unavailableItem) {
      setToastMessage(
        unavailableItem.reason ||
          (i18n.language === "ar"
            ? `${unavailableItem.product_name} غير متاح حالياً`
            : `${unavailableItem.product_name} is unavailable`)
      );
      setToastType("error");
      setToastVisible(true);
      return;
    }

    setLoading(true);
    try {
      const body = prepareOrderBody();
      if(!body) return
      const res = await dispatch(actPlaceOrder(body)).unwrap();

      if (res.payment_required && res.payment_url) {
        window.location.href = res.payment_url;
        return;
      }

      if (res.order_id) {
        navigate(`/order-completed/${res.order_id}`);
        dispatch(DeleteCard());
        dispatch(clearServerCart());
        // حدّث بيانات المستخدم (رصيد المحفظة / نقاط الولاء ممكن تكون اتغيرت)
        dispatch(actGetUser());
      }
    } catch (err) {
      console.error("Order failed:", err);
      alert(t("checkout.error_placing_order"));
    } finally {
      setLoading(false);
    }
  }, [prepareOrderBody, dispatch, navigate, paymentMethod, t, selectedType, requiredFields, selectedAdress, deliverfeeData, CurrentedArea, resturantdata, selectedBranchId]);

  return (
    <div className="cart-page  overflow-auto container py-4">
      <Row>
        <Col lg={8}>
          <UserInformation />

          <PlaceOrderDeliverType
            setOnselec={(area) => {
              setCurrentedArea(area);
              setAreaError(false);
            }}
            SetOnSelectedType={(type) => {
              setSelectedType(type);
              setAreaError(false);
              if (type === "take_away" && (resturantdata?.branches?.length ?? 0) > 0) {
                setShowBranchModal(true);
              }
            }}
            areaInvalid={areaError}
          />

          {selectedType === "take_away" && (
            <div className="w-100 mb-4">
              <h4 className="mb-3 fw-semibold">{t("checkout.pickup_branch")}</h4>
              {selectedBranch ? (
                <div className="d-flex justify-content-between align-items-center border rounded p-3">
                  <div>
                    <div className="fw-semibold">{selectedBranch.name}</div>
                    <div className="small text-muted">{selectedBranch.address}</div>
                  </div>
                  <span
                    className="text-primary fw-semibold"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowBranchModal(true)}
                  >
                    {t("change")}
                  </span>
                </div>
              ) : (
                <div
                  className="border rounded p-3 text-muted"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowBranchModal(true)}
                >
                  {t("checkout.select_branch_first")}
                </div>
              )}
            </div>
          )}

          <FavTimeSelectForOrder
            SetSelectedDeliveryDate={SetUserselectedDate}
            SetSelectedDeliveryTime={SetUserselectedTime}
          />

          <ChangePaymentSection
            setBringChangeAmount={SetChangeAmount}
            onSelectPayment={setPaymentMethod}
            onPartialChange={setIsPartial}
            totalAmount={totalAmount}
          />

          
          <h4 className="mt-4 mb-3 fw-semibold text-dark">
            {t("checkout.add_delivery_notes")}
          </h4>
          <Form.Group controlId="deliveryNotes">
            <Form.Control
              as="textarea"
              rows={3}
              placeholder={t("checkout.delivery_notes_placeholder")}
              value={deliveryNotes}
              onChange={(e) => setDeliveryNotes(e.target.value)}
              className="delivery-textarea"
            />
          </Form.Group>
        </Col>

        <Col lg={4}>
          <Card className="p-3 shadow-sm border-0 rounded-4 z-2 sticky-top">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="fw-semibold">{t("checkout.cost_summary")}</span>
            </div>

            <div className="small text-muted mb-2">
              {serverCart ? (
                <>
                  <div className="d-flex justify-content-between">
                    <span>{t("checkout.subtotal")}</span>
                    <span>{serverCart.subtotal.toFixed(2)} EGP</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>{t("tax")}</span>
                    <span>(+) {serverCart.total_tax.toFixed(2)} EGP</span>
                  </div>
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
                      <span>{t("cart.spin_prizes") || "جوائز عجلة الحظ"} 🎡</span>
                      <span>
                        (-) {(serverCart.discounts.spin_prize + serverCart.discounts.spin_free_product).toFixed(2)} EGP
                      </span>
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
                </>
              ) : (
                <div className="d-flex justify-content-between">
                  <span>{t("checkout.subtotal")}</span>
                  <span>{itemsPrice.toFixed(2)} EGP</span>
                </div>
              )}

              {loyaltyEnabled && (
                <Form.Check
                  type="checkbox"
                  className="mt-2"
                  checked={redeemPoints}
                  onChange={(e) => setRedeemPoints(e.target.checked)}
                  label={`${t("checkout.redeem_points") || "استبدل نقاط الولاء"} (${UserData?.point})`}
                />
              )}

              <div className="d-flex justify-content-between mt-2">
                <span>{t("checkout.delivery_fee")}</span>
                <span>
                  {isFreeDelivery ? (
                    <span className="text-success fw-semibold">
                      {t("checkout.free")}
                    </span>
                  ) : (
                    `(+) ${currentAreaCharge.toFixed(2)} EGP`
                  )}
                </span>
              </div>
              {isFreeDelivery && (
                <div className="text-success fw-semibold mt-1">
                  {serverCart?.discounts.spin_free_delivery
                    ? t("cart.free_delivery_spin") || "🚚 توصيل مجاني من عجلة الحظ"
                    : t("checkout.free_delivery_applied")}
                </div>
              )}
              {isPartial && UserData?.wallet_balance && (
                <div className="d-flex justify-content-between mt-2">
                  <span>{t("payment.wallet") || "المحفظة"}</span>
                  <span>(-) {Number(UserData.wallet_balance).toFixed(2)} EGP</span>
                </div>
              )}
              <hr />
              <div className="d-flex justify-content-between fw-semibold">
                <span>{t("checkout.total_amount")}</span>
                <span style={{ color: "var(--MainColor)" }}>
                  {totalAmount.toFixed(2)} EGP
                </span>
              </div>
            </div>

            <ButtonComponent
              text={t("checkout.place_order")}
              loading={Loading}
              onClick={handleCheckout}
            />
          </Card>
        </Col>
      </Row>
      <FeedbackToast
        message={toastMessage}
        show={toastVisible}
        onClose={() => setToastVisible(false)}
        type={toastType}
      />
      <Modal
        show={showAddressModal}
        onHide={() => setShowAddressModal(false)}
        size="lg"
        centered
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>{t("updateInfo")}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-2 p-md-3">
          {showAddressModal && (
            <AddressForm
              requiredFields={requiredFields}
              onSaved={() => {
                setShowAddressModal(false);
                setToastMessage(t("checkout.address_updated"));
                setToastType("success");
                setToastVisible(true);
              }}
            />
          )}
        </Modal.Body>
      </Modal>

      <Modal
        show={showBranchModal}
        onHide={() => setShowBranchModal(false)}
        size="lg"
        centered
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>{t("checkout.select_pickup_branch")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3">
            {resturantdata?.branches?.map((branch) => (
              <Col key={branch.id} xs={12} md={6}>
                <Card
                  className={`h-100 ${
                    selectedBranchId === branch.id ? "border-primary border-2" : ""
                  }`}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setSelectedBranchId(branch.id);
                    setShowBranchModal(false);
                  }}
                >
                  {branch.image && (
                    <Card.Img
                      variant="top"
                      src={`${resturantdata?.base_urls?.branch_image_url}/${branch.image}`}
                      style={{ height: 120, objectFit: "cover" }}
                    />
                  )}
                  <Card.Body className="text-center">
                    <Card.Title className="fw-bold fs-6">{branch.name}</Card.Title>
                    <Card.Text className="text-muted small mb-1">
                      {branch.address}
                    </Card.Text>
                    <div className="text-secondary small">
                      ⏱️ {branch.preparation_time} {t("SelectBranch.preparation_time")}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default React.memo(CheckOutPage);
