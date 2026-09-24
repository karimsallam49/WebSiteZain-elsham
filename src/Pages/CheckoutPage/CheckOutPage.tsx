import { useAppDispatch, useAppSelector } from "../../Hooks/hooks";
import { Card, Row, Col, Form } from "react-bootstrap";
import "./CheckOutPage.css";
import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next"; 

import FavTimeSelectForOrder from "../../Components/FaveTimeSelectForOrder/FavTimeSelectForOrder";
import ChangePaymentSection from "../../Components/ChangePaymentPopup/ChangePaymentPopup";
import UserInformation from "../../Components/UserInformation/UserInformation";
import PlaceOrderDeliverType from "../../Components/PlaceOrderDeliverType/PlaceOrderDeliverType";
import ButtonComponent from "../../Components/Button/ButtonComponent";

import type { PlaceOrderDTO } from "../../DTO/CheckouDTO";
import { actPlaceOrder } from "../../store/PlaceOrder/actPlaceOrder";
import { DeleteCard } from "../../store/Cart/CartSlice";
import React from "react";
import i18n from "../../i18n";
import FeedbackToast from "../../Components/FeedbackToast/FeedbackToast";

const CheckOutPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation(); 
 const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
const [toastType, setToastType] = useState<"success" | "error">("success");
  const { CartData } = useAppSelector((state) => state.cartSlice);
  const { CouponData } = useAppSelector((state) => state.CouponSlice);
  const { deliverfeeData } = useAppSelector((state) => state.DeliveryFeeSlice);
  const { selectedAdress } = useAppSelector((state) => state.adressSlice);

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
  const { itemsPrice, totalAmount, currentAreaCharge, isFreeDelivery } = useMemo(() => {
    const itemsPrice = CartData.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const currentArea = deliverfeeData?.delivery_charge_by_area.find(
      (el) => el.id === CurrentedArea
    );

    const setup = deliverfeeData?.delivery_charge_setup;
    const isFreeDelivery =
      setup?.free_delivery_over_status === 1 &&
      setup.free_delivery_over_amount > 0 &&
      itemsPrice >= setup.free_delivery_over_amount;

    const deliveryCharge = isFreeDelivery ? 0 : currentArea?.delivery_charge ?? 0;
    const totalAmount = itemsPrice + deliveryCharge;

    return {
      itemsPrice,
      totalAmount,
      currentAreaCharge: deliveryCharge,
      isFreeDelivery,
    };
  }, [CartData, deliverfeeData, CurrentedArea]);
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
    const cartBody = CartData.map((el) => ({
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
      coupon_discount_amount: CouponData?.available[0]?.discount ?? 0,
      coupon_discount_title: CouponData?.available[0]?.title ?? "",
      order_amount: itemsPrice,
      order_type: selectedType,
      delivery_address_id: selectedAdress?.id ?? null,
      payment_method: paymentMethod,
      payment_platform: paymentMethod === "cash_on_delivery" ? undefined : "web",
      order_note: deliveryNotes,
      coupon_code: CouponData?.available[0]?.code ?? "",
      delivery_time: UserSelectedTime,
      delivery_date: UserSelectedDate,
      branch_id: 1,
      selected_delivery_area: CurrentedArea ?? 0,
      is_partial: "0",
      is_cutlery_required: "0",
      bring_change_amount: ChangeAmount,
      distance: 0,
      delivery_address: selectedAdress,
    };
  }, [
    CartData,
    CouponData,
    totalAmount,
    selectedType,
    paymentMethod,
    deliveryNotes,
    UserSelectedTime,
    UserSelectedDate,
    CurrentedArea,
    ChangeAmount,
    selectedAdress,
  ]);

  const handleCheckout = useCallback(async () => {
    if (!paymentMethod) {
      alert(t("checkout.select_payment_method"));
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
      }
    } catch (err) {
      console.error("Order failed:", err);
      alert(t("checkout.error_placing_order"));
    } finally {
      setLoading(false);
    }
  }, [prepareOrderBody, dispatch, navigate, paymentMethod, t]);

  return (
    <div className="cart-page  overflow-auto container py-4">
      <Row>
        <Col lg={8}>
          <UserInformation />

          <PlaceOrderDeliverType
            setOnselec={setCurrentedArea}
            SetOnSelectedType={setSelectedType}
          />

          <FavTimeSelectForOrder
            SetSelectedDeliveryDate={SetUserselectedDate}
            SetSelectedDeliveryTime={SetUserselectedTime}
          />

          <ChangePaymentSection
            setBringChangeAmount={SetChangeAmount}
            onSelectPayment={setPaymentMethod}
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
              <div className="d-flex justify-content-between">
                <span>{t("checkout.subtotal")}</span>
                <span>{itemsPrice.toFixed(2)} EGP</span>
              </div>
              <div className="d-flex justify-content-between">
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
                  {t("checkout.free_delivery_applied")}
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
    </div>
  );
};

export default React.memo(CheckOutPage);
