import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import DoneImage from "../../assets/image/check_circle.png";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import "./OrderComplete.css";

const OrderComplete = () => {
  const params = useParams();
  const orderid = params.order_id;
  const navigae = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (!orderid) navigae("/");
  }, []);

  const Trackorder = () => {
    navigae(`/OrderTracking/${orderid}`);
  };

  return (
    <div className="w-100 d-flex align-items-center justify-content-center order-complete-page">
      <div className="oder-container-status w-100 text-center" style={{ maxWidth: "500px" }}>
        <div className="w-100 p-1">
          <img width={120} className="object-fit-contain p-1" src={DoneImage} alt="" />
        </div>

        <h4>
          {t("order_complete.success_message")} #{orderid} {t("order_complete.order_submitted")}
        </h4>

        <Button onClick={Trackorder} className="backgroundMainColor border-0 mt-2 mb-2 w-100">
          {t("order_complete.track_order")}
        </Button>

        <h5 onClick={() => navigae("/")}>{t("order_complete.back_home")}</h5>
      </div>
    </div>
  );
};

export default OrderComplete;
