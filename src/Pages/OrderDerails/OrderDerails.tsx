import "./OrderDetailsPage.css";
import { useNavigate, useParams } from "react-router-dom";
import { useFetch } from "../../Hooks/useFetch";
import { useAppDispatch, useAppSelector } from "../../Hooks/hooks";
import { TrackordersUrl, ImageUrl } from "../../EndPoints/EndPoints";
import type { OrderDetailsDTO } from "../../DTO/OrderDTO";
import processingImage from "../../assets/image/processing_animation.gif";
import ConfirmPopup from "../../Components/confirmPopup/ConfirmPopup";
import { useState } from "react";
import { actCancellOrde } from "../../store/PlaceOrder/actCancellOrder";
import FeedbackToast from "../../Components/FeedbackToast/FeedbackToast";
import { useTranslation } from "react-i18next";

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
    return <div className="text-center p-5">{t("order_details.loading")}</div>;
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

  const total =
    order_amount +
    delivery_charge -
    (coupon_discount_amount ?? 0) -
    Number(extra_discount ?? 0);

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
    <div className="order-details container">
      {/* Header */}
      <div className="order-header d-flex justify-content-between flex-column align-items-center">
        <span>{t("order_details.order_number")} #{order_id}</span>
        <span>{new Date(created_at).toLocaleString()}</span>
      </div>

      <div className="w-100 d-flex flex-column flex-lg-row align-items-start justify-content- detail-contaner g-3">
        <div className="w-100 p-1">
          <div className="order-status-card w-100 text-center">
            <img
              src={order_status === "pending" ? processingImage : processingImage}
              alt="Order status"
            />
            <h5>
              {t("order_details.your_order")}{" "}
              {order_status === "confirmed"
                ? t("order_details.confirmed")
                : order_status}
            </h5>
            <p>
              {t("order_details.preparation_time")}: {preparation_time}{" "}
              {t("order_details.minutes")}
            </p>
            <p>
              {t("order_details.payment_status")}:{" "}
              {payment_status === "unpaid"
                ? t("order_details.unpaid")
                : t("order_details.paid")}
            </p>
          </div>

          <div className="order- p-2  w-100 ">
            {/* Delivery Info */}
            <div className="delivery-info  w-100 mt-4 section-bordered">
              <h6>📦 {t("order_details.delivery_info")}</h6>
              <div className="from-to  d-flex flex-column w-100">
                <div>
                  <span>{t("order_details.from")}</span>
                  <h4>{branch?.name ?? t("order_details.no_branch")}</h4>
                </div>
                <div>
                  <span>{t("order_details.to")}</span>
                  <p>{delivery_address?.address ?? t("order_details.no_address")}</p>
                </div>
              </div>

              {/* Items */}
              <h6 className="mt-4 section-bordered">🛍️ {t("order_details.items")}</h6>
              <div className="items-list">
                {details.map((item, i) => (
                  <div
                    key={i}
                    className="item-card d-flex align-items-center justify-content-between"
                  >
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={`${ImageUrl}/${item.product_details.image}`}
                        alt={item.product_details.name}
                        className="item-img"
                      />
                      <div>
                        <p className="mb-1 fw-bold">
                          {item.product_details.name}
                        </p>
                        <span className="small text-muted">
                          {t("order_details.quantity")}: {item.quantity}
                        </span>
                      </div>
                    </div>
                    <span className="price">{item.price} EGP</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="order-summart-container p-2" style={{ width: "50%" }}>
          <div className="order-summary-section w-100 section-bordered">
            <h6>💰 {t("order_details.cost_summary")}</h6>
            <ul>
              <li>
                <span>{t("order_details.order_total")}</span>
                <span>{order_amount} EGP</span>
              </li>
              <li>
                <span>{t("order_details.coupon_discount")}</span>
                <span>{coupon_discount_amount} EGP</span>
              </li>
              <li>
                <span>{t("order_details.extra_discount")}</span>
                <span>{extra_discount} EGP</span>
              </li>
              <li>
                <span>{t("order_details.delivery_fee")}</span>
                <span>{delivery_charge} EGP</span>
              </li>
              <li className="total">
                <span>{t("order_details.total_amount")}</span>
                <span>{total} EGP</span>
              </li>
            </ul>

            {order_status === "pending" && !isCancelled ? (
              <button
                onClick={() => {
                  setSelectedId(order_id);
                  setShowConfirm(true);
                }}
                className="track-btn w-100"
              >
                {t("order_details.cancel_order")}
              </button>
            ) : isCancelled ? (
              <button className="track-btn w-100" disabled>
                {t("order_details.order_cancelled")}
              </button>
            ) : (
              <button onClick={handleTrackOrder} className="track-btn w-100">
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
