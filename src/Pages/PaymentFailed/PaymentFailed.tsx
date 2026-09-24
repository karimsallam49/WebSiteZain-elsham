import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const PaymentFailed: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center text-center"
      style={{ minHeight: "80vh" }}
    >
      <img
        src="https://cdn-icons-png.flaticon.com/512/463/463612.png"
        alt="failed"
        style={{ width: "120px", marginBottom: "20px" }}
      />
      <h3 className="text-danger mb-3">{t("payment_failed_title")}</h3>
      <p className="text-muted mb-4">{t("payment_failed_message")}</p>

      <Button
        className="backgroundMainColor border-0"
        onClick={() => navigate("/cart")}
      >
        {t("back_to_cart")}
      </Button>
    </div>
  );
};

export default PaymentFailed;
