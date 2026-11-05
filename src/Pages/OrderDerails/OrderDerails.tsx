import "./OrderDetailsPage.css";
import { useNavigate, useParams } from "react-router-dom";
import { useFetch } from "../../Hooks/useFetch";
import { useAppDispatch, useAppSelector } from "../../Hooks/hooks";
import { TrackordersUrl, ImageUrl } from "../../EndPoints/EndPoints";
import type { OrderDetailsDTO } from "../../DTO/OrderDTO";
import processingImage from "../../assets/image/processing_animation.webp";
import ConfirmPopup from "../../Components/confirmPopup/ConfirmPopup";
import { useState } from "react";
import { actCancellOrde } from "../../store/PlaceOrder/actCancellOrder";
import FeedbackToast from "../../Components/FeedbackToast/FeedbackToast";
import { useTranslation } from "react-i18next";
import {
  Bike,
  Clock,
  CreditCard,
  Gift,
  MapPin,
  Package,
  Receipt,
  Store,
} from "lucide-react";

const OrderDetailsPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.order_id;
  const { currentLanguage } = useAppSelector((state) => state.LanguageSlice);
  const { OTPToken } = useAppSelector((state) => state.OTPauthconfigration);
  const [selectedId, setSelectedId] = useState<any | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const API = `${TrackordersUrl}track?order_id=${id}`;
  const { data } = useFetch<OrderDetailsDTO>(
    currentLanguage,
    API,
    { enabled: true },
    OTPToken ?? "null"
  );

  if (!data) {
    return <div className="od-loading">{t("order_details.loading")}</div>;
  }

  const {
    id: order_id,
    order_status,
    created_at,
    delivery_address,
    branch,
    delivery_charge,
    order_amount,
    coupon_discount_amount,
    extra_discount,
    details,
    preparation_time,
    payment_status,
  } = data;

  const n = (v: any) => Number(v) || 0;
  const egp = (v: any) => `${n(v).toFixed(2)} ${t("currency", "EGP")}`;

  const total =
    order_amount +
    delivery_charge -
    (coupon_discount_amount ?? 0) -
    Number(extra_discount ?? 0);

  const tts = data.totals;
  const dsc = data.discounts;
  const grandTotal = tts ? n(tts.grand_total) : total;
  const deliveryFee = tts ? n(tts.delivery_charge) : n(delivery_charge);
  const freeDelivery = Boolean(data.spin_free_delivery);

  const statusLabel =
    order_status === "confirmed"
      ? t("order_details.confirmed")
      : order_status;

  const handleTrackOrder = () => {
    if (!order_id) return alert(t("order_details.no_order_id"));
    navigate(`/OrderTracking/${order_id}`);
  };

  const Deleteaction = async (id: any) => {
    try {
      await dispatch(actCancellOrde(id)).unwrap();
      setShowToast(true);
      setIsCancelled(true);
    } catch (err) {
      console.error(t("order_details.cancel_failed"), err);
    } finally {
      setShowConfirm(false);
    }
  };

  return (
    <div className="od-page">
      {/* Header */}
      <div className="v2-rail-head od-head">
        <h2 className="v2-rail-title">
          {t("order_details.order_number")} #{order_id}
        </h2>
        <span className="od-date">{new Date(created_at).toLocaleString()}</span>
      </div>

      <div className="od-grid">
        <div className="od-col">
          {/* Status card */}
          <div className="od-card od-status">
            <img src={processingImage} alt="" aria-hidden="true" />
            <div className="od-status-body">
              <h5>{t("order_details.your_order")} {statusLabel}</h5>
              <div className="od-meta">
                <span className="od-chip">
                  <Clock size={14} /> {t("order_details.preparation_time")}:{" "}
                  {preparation_time} {t("order_details.minutes")}
                </span>
                <span className="od-chip">
                  <CreditCard size={14} />{" "}
                  {payment_status === "unpaid"
                    ? t("order_details.unpaid")
                    : t("order_details.paid")}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery info */}
          <div className="od-card">
            <div className="od-card-head">
              <Bike size={16} />
              <h6>{t("order_details.delivery_info")}</h6>
            </div>
            <div className="od-route">
              <div className="od-route-point">
                <Store size={15} />
                <div>
                  <span>{t("order_details.from")}</span>
                  <strong>{branch?.name ?? t("order_details.no_branch")}</strong>
                </div>
              </div>
              <div className="od-route-line" aria-hidden="true" />
              <div className="od-route-point">
                <MapPin size={15} />
                <div>
                  <span>{t("order_details.to")}</span>
                  <p>{delivery_address?.address ?? t("order_details.no_address")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="od-card">
            <div className="od-card-head">
              <Package size={16} />
              <h6>{t("order_details.items")}</h6>
              <span className="od-chip">{details.length}</span>
            </div>
            <div className="od-items">
              {details.map((item, i) => (
                <div key={i} className="od-item">
                  <img
                    src={`${ImageUrl}/${item.product_details.image}`}
                    alt={item.product_details.name}
                    loading="lazy"
                  />
                  <div className="od-item-info">
                    <p>{item.product_details.name}</p>
                    <span>
                      {t("order_details.quantity")}: {item.quantity}
                    </span>
                  </div>
                  <span className="od-item-price">
                    {n(item.discount_on_product) > 0 ? (
                      <>
                        <del>{egp(item.price)}</del>
                        {egp(n(item.price) - n(item.discount_on_product))}
                      </>
                    ) : (
                      egp(item.price)
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary column */}
        <div className="od-col od-col-side">
          <div className="od-card">
            <div className="od-card-head">
              <Receipt size={16} />
              <h6>{t("order_details.cost_summary")}</h6>
            </div>

            {data.applied_offer && (
              <div className="od-offer">
                <Gift size={13} /> {data.applied_offer.label || t("cart.spin_prizes")}
                {data.applied_offer.product_name &&
                  ` — ${data.applied_offer.product_name}`}
                {n(data.applied_offer.discount) > 0 &&
                  ` (${egp(data.applied_offer.discount)})`}
                {data.applied_offer.free_delivery &&
                  ` — ${t("cart.free_delivery_spin")}`}
              </div>
            )}

            <ul className="od-lines">
              <li>
                <span>{t("order_details.items_subtotal")}</span>
                <span>{egp(tts?.items_subtotal ?? order_amount)}</span>
              </li>

              {tts && n(tts.line_discounts) > 0 && (
                <li className="disc">
                  <span>{t("order_details.line_discounts")}</span>
                  <span>(-) {egp(tts.line_discounts)}</span>
                </li>
              )}

              {dsc ? (
                <>
                  {n(dsc.coupon) > 0 && (
                    <li className="disc">
                      <span>{t("order_details.coupon_discount")}</span>
                      <span>(-) {egp(dsc.coupon)}</span>
                    </li>
                  )}
                  {n(dsc.extra) > 0 && (
                    <li className="disc">
                      <span>{t("order_details.extra_discount")}</span>
                      <span>(-) {egp(dsc.extra)}</span>
                    </li>
                  )}
                  {n(dsc.referral) > 0 && (
                    <li className="disc">
                      <span>{t("cart.referral")}</span>
                      <span>(-) {egp(dsc.referral)}</span>
                    </li>
                  )}
                  {n(dsc.loyalty) > 0 && (
                    <li className="disc">
                      <span>{t("cart.loyalty")}</span>
                      <span>(-) {egp(dsc.loyalty)}</span>
                    </li>
                  )}
                  {n(dsc.first_order) > 0 && (
                    <li className="disc">
                      <span>{t("cart.first_order")}</span>
                      <span>(-) {egp(dsc.first_order)}</span>
                    </li>
                  )}
                  {n(dsc.spin_prize) > 0 && (
                    <li className="disc">
                      <span>{t("cart.spin_prizes")}</span>
                      <span>(-) {egp(dsc.spin_prize)}</span>
                    </li>
                  )}
                </>
              ) : (
                <>
                  <li>
                    <span>{t("order_details.coupon_discount")}</span>
                    <span>{egp(coupon_discount_amount)}</span>
                  </li>
                  <li>
                    <span>{t("order_details.extra_discount")}</span>
                    <span>{egp(extra_discount)}</span>
                  </li>
                </>
              )}

              <li>
                <span>{t("order_details.delivery_fee")}</span>
                <span>
                  {freeDelivery
                    ? t("cart.free_delivery_spin")
                    : egp(deliveryFee)}
                </span>
              </li>
              <li className="od-total">
                <span>{t("order_details.total_amount")}</span>
                <span>{egp(grandTotal)}</span>
              </li>
            </ul>

            {data.spin_prizes && data.spin_prizes.length > 0 && (
              <div className="od-prizes">
                {data.spin_prizes.map((p) => (
                  <div key={p.id} className="od-prize">
                    <Gift size={12} /> {p.label}
                    {p.product_name ? ` — ${p.product_name}` : ""}
                    {n(p.value) > 0 ? ` (${egp(p.value)})` : ""}
                  </div>
                ))}
              </div>
            )}

            {data.loyalty &&
              (n(data.loyalty.earned) > 0 || n(data.loyalty.redeemed) > 0) && (
                <div className="od-foot-note">
                  {n(data.loyalty.earned) > 0 && (
                    <div>
                      ⭐ {t("order_details.points_earned")}:{" "}
                      {data.loyalty.earned}
                    </div>
                  )}
                  {n(data.loyalty.redeemed) > 0 && (
                    <div>
                      💎 {t("order_details.points_redeemed")}:{" "}
                      {data.loyalty.redeemed} (-{egp(data.loyalty.discount_amount)})
                    </div>
                  )}
                </div>
              )}

            {data.order_partial_payments &&
              data.order_partial_payments.length > 0 && (
                <div className="od-foot-note">
                  {data.order_partial_payments.map((p, i) => (
                    <div key={i}>
                      💳 {p.paid_with}: {egp(p.paid_amount)} —{" "}
                      {t("order_details.due_amount")}: {egp(p.due_amount)}
                    </div>
                  ))}
                </div>
              )}

            {order_status === "pending" && !isCancelled ? (
              <button
                onClick={() => {
                  setSelectedId(order_id);
                  setShowConfirm(true);
                }}
                className="od-btn od-btn-danger"
              >
                {t("order_details.cancel_order")}
              </button>
            ) : isCancelled ? (
              <button className="od-btn" disabled>
                {t("order_details.order_cancelled")}
              </button>
            ) : (
              <button onClick={handleTrackOrder} className="od-btn">
                {t("order_details.track_order")}
              </button>
            )}
          </div>
        </div>
      </div>

      <ConfirmPopup
        show={showConfirm}
        message={t("order_details.confirm_cancel")}
        onConfirm={() => {
          if (selectedId) Deleteaction(selectedId);
        }}
        onClose={() => setShowConfirm(false)}
      />

      <FeedbackToast
        show={showToast}
        message={t("order_details.cancel_success")}
        onClose={() => setShowToast(false)}
        type="success"
      />
    </div>
  );
};

export default OrderDetailsPage;
