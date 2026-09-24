import { useNavigate } from "react-router";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import "./PaymentFail.css";

const PaymentFail = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="w-100 d-flex align-items-center justify-content-center payment-status-page">
      <div className="oder-container-status w-100 text-center" style={{ maxWidth: "500px" }}>
        <div className="w-100 p-1">
          <h1 className="display-1 text-danger">×</h1>
        </div>

        <h4>{t("payment_failed_title")}</h4>
        <p className="text-muted">{t("payment_failed_message")}</p>

        <Button
          onClick={() => navigate("/cart")}
          className="backgroundMainColor border-0 mt-2 mb-2 w-100"
        >
          {t("back_to_cart")}
        </Button>

        <h5 onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          {t("back_to_home")}
        </h5>
      </div>
    </div>
  );
};

export default PaymentFail;
