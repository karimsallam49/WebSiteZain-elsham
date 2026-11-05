import "./OrderTrackingStyle.css";
import { useParams } from "react-router-dom";
import { useFetch } from "../../Hooks/useFetch";
import { useAppSelector } from "../../Hooks/hooks";
import { TrackordersUrl } from "../../EndPoints/EndPoints";
import type { OrderDetailsDTO } from "../../DTO/OrderDTO";
import {
  Check,
  Clock,
  Bike,
  Package,
  CookingPot,
  Truck,
} from "lucide-react";
import DeliverMan from "../../assets/image/delivery-man-260.webp";
import { useTranslation } from "react-i18next";

const OrderTrackingPage = () => {
  const { order_id } = useParams();
  const { currentLanguage } = useAppSelector((state) => state.LanguageSlice);
  const { OTPToken } = useAppSelector((state) => state.OTPauthconfigration);
  const { t } = useTranslation();

  const API = `${TrackordersUrl}track?order_id=${order_id}`;
  const { data } = useFetch<OrderDetailsDTO>(
    currentLanguage,
    API,
    { enabled: true },
    OTPToken ?? "null"
  );

  if (!data) {
    return <div className="ot-loading">{t("order_tracking.loading")}</div>;
  }

  const { id, order_status, delivery_time, preparation_time } = data;

  const steps = [
    { key: "pending", label: t("order_tracking.pending"), Icon: Clock },
    { key: "confirmed", label: t("order_tracking.confirmed"), Icon: Package },
    { key: "processing", label: t("order_tracking.processing"), Icon: CookingPot },
    { key: "out_for_delivery", label: t("order_tracking.out_for_delivery"), Icon: Truck },
    { key: "delivered", label: t("order_tracking.delivered"), Icon: Bike },
  ];

  const isCancelled = order_status === "cancelled";
  const activeIndex = steps.findIndex((s) => s.key === order_status);
  const isAllInactive = activeIndex === -1 && !isCancelled;

  return (
    <div className="ot-page">
      {/* Hero */}
      <div className="ot-hero od-card">
        <img src={DeliverMan} alt="" aria-hidden="true" />
        <h2 className="ot-title">{t("order_tracking.confirmation")}</h2>
        <p className="ot-time">
          {delivery_time || `0 - ${preparation_time} ${t("order_tracking.minutes")}`}
        </p>
        <span className="od-chip">
          {t("order_tracking.your_order")} <b>#{id}</b>
        </span>
      </div>

      {/* Timeline */}
      {isCancelled ? (
        <div className="od-card ot-cancelled">
          <Package size={26} />
          <strong>{t("order_tracking.cancelled")}</strong>
        </div>
      ) : (
        <div className="od-card ot-steps">
          {steps.map((step, index) => {
            const done = !isAllInactive && index < activeIndex;
            const current = index === activeIndex;
            const { Icon } = step;
            return (
              <div
                key={step.key}
                className={`ot-step ${done ? "done" : ""} ${current ? "current" : ""}`}
              >
                <div className="ot-dot">
                  {done ? <Check size={14} /> : <Icon size={16} />}
                </div>
                {index < steps.length - 1 && <div className="ot-line" />}
                <span className="ot-label">{step.label}</span>
              </div>
            );
          })}
        </div>
      )}

      {isAllInactive && (
        <div className="od-card ot-cancelled">
          <Package size={22} />
          <strong>{order_status}</strong>
        </div>
      )}
    </div>
  );
};

export default OrderTrackingPage;
