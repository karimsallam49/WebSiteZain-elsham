import { useNavigate, useSearchParams } from "react-router";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import DoneImage from "../../assets/image/check_circle.png";
import "./PaymentSuccess.css";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  // token can be used here to verify the payment if needed
  void token;

  return (
    <div className="w-100 d-flex align-items-center justify-content-center payment-status-page">
      <div className="oder-container-status w-100 text-center" style={{ maxWidth: "500px" }}>
        <div className="w-100 p-1">
          <img width={120} className="object-fit-contain p-1" src={DoneImage} alt="" />
        </div>

        <h4>{t("payment_success_title")}</h4>
        <p className="text-muted">{t("payment_success_message")}</p>

        <Button
          onClick={() => navigate("/")}
          className="backgroundMainColor border-0 mt-2 mb-2 w-100"
        >
          {t("back_to_home")}
        </Button>

        <h5 onClick={() => navigate("/myorders")} style={{ cursor: "pointer" }}>
          {t("My Orders")}
        </h5>
      </div>
    </div>
  );
};

export default PaymentSuccess;
