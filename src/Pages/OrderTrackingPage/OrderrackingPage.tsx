import "./OrderTrackingStyle.css";
import { useParams } from "react-router-dom";
import { useFetch } from "../../Hooks/useFetch";
import { useAppSelector } from "../../Hooks/hooks";
import { TrackordersUrl } from "../../EndPoints/EndPoints";
import type { OrderDetailsDTO } from "../../DTO/OrderDTO";
import {
  CheckCircle,
  Clock,
  Bike,
  Package,
  CookingPot,
  Truck,
} from "lucide-react";
import DeliverMan from "../../assets/image/delivery-man.gif";
import { Button } from "react-bootstrap";
import ConfirmPic from "../../assets/image/check_circle.png";
import { useTranslation } from "react-i18next";
import"./OrderTrackingStyle.css"
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
    return <div className="text-center p-5">{t("order_tracking.loading")}</div>;
  }

  const { id, order_status, delivery_time, preparation_time } = data;

  const steps = [
    { key: "pending", label: t("order_tracking.pending"), icon: <Clock size={30} color="yellow" /> },
    { key: "out_for_delivery", label: t("order_tracking.out_for_delivery"), icon: <Truck color="yellow" size={30} /> },
    { key: "confirmed", label: t("order_tracking.confirmed"), icon: <CheckCircle size={30} color="yellow" /> },
    { key: "delivered", label: t("order_tracking.delivered"), icon: <Bike color="yellow" size={30} /> },
    { key: "processing", label: t("order_tracking.processing"), icon: <CookingPot color="yellow" size={30} /> },
    { key: "cancelled", label: t("order_tracking.cancelled"), icon: <Package color="yellow" size={30} /> },
  ];

  const activeIndex = steps.findIndex((s) => s.key === order_status);
  const isAllInactive = activeIndex === -1;

  return (
    <div className="order-tracking w-100 container py-5 text-center">
      <div className="tracking-header mb-5">
        <img src={DeliverMan} alt="Delivery" className="delivery-img mb-3" />
        <h5>{t("order_tracking.confirmation")}</h5>
        <p className="time-range text-danger">
          {delivery_time || `0 - ${preparation_time} ${t("order_tracking.minutes")}`}
        </p>
        <p className="order-id">
          {t("order_tracking.your_order")} <b>#{id}</b>
        </p>
      </div>

      <div className="tracking-grid w-100">
        <div className="row">
          {steps.map((step, index) => {
            const isActive = !isAllInactive && index <= activeIndex;
            const isCurrent = index === activeIndex;

            return (
              <div
                key={step.key}
                className={`tracking-step d-flex justify-content-between align-items-center col-12 col-md-6 col-sm-12 ${
                  isActive ? "active" : ""
                } ${isCurrent ? "current" : ""}`}
                style={{
                  opacity: isAllInactive ? 0.5 : isActive ? 1 : 0.5,
                }}
              >
                <div className="icon-wrapper d-flex align-items-sm-center justify-content-around w-100">
                  {step.icon}
                  <h5 className="label">{step.label}</h5>
                </div>
                <span
                  className="confirm-icon w-100"
                  style={{ opacity: isActive ? "1" : "0" }}
                >
                  <img width={35} src={ConfirmPic} alt="" />
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {isAllInactive && (
        <div className="mt-4">
          <Button variant="danger" className="cancel-btn">
            {t("order_tracking.cancel_order")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default OrderTrackingPage;
