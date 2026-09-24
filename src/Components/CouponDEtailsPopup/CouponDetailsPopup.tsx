import React from "react";
import { Button, Modal } from "react-bootstrap";
import promoimage from "../../assets/svg/coupon_icon.svg";
import "./CouponPopupStyle.css";
import { useTranslation } from "react-i18next";

interface CouponDetailsPopupProps {
  show: boolean;
  onClose: () => void;
  selectedCoupon: {
    title: string;
    code: string;
    discount: number;
    discount_type: string;
    start_date: string;
    expire_date: string;
    min_purchase: number;
  } | null;
}

const CouponDetailsPopup: React.FC<CouponDetailsPopupProps> = ({
  show,
  onClose,
  selectedCoupon,
}) => {
  const { t } = useTranslation();

  if (!selectedCoupon) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    return `${day} ${month}`;
  };

  const handleCopyAll = () => {
    const fullText = `
🎟️ ${t("couponPopup.coupon")}: ${selectedCoupon.title}
💰 ${t("couponPopup.discount")}: ${selectedCoupon.discount}${selectedCoupon.discount_type === "percent" ? "%" : ""}
📅 ${t("couponPopup.valid")}: ${formatDate(selectedCoupon.start_date)} - ${formatDate(selectedCoupon.expire_date)}
🔢 ${t("couponPopup.code")}: ${selectedCoupon.code}
🛒 ${t("couponPopup.minPurchase")}: ${selectedCoupon.min_purchase}
    `.trim();
    navigator.clipboard.writeText(fullText);
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Body className="p-4" style={{ height: "50vh" }}>
        <div className="w-100 text-center">
          <div className="promoimage-popup w-100 d-flex align-items-start justify-content-center">
            <img
              className="object-fit-contain"
              width={30}
              height={30}
              src={promoimage}
              alt=""
            />
            <div className="promotitle-pop d-flex h-100 fw-bold">
              {selectedCoupon.discount}
              {selectedCoupon.discount_type === "percent" ? "%" : ""}
            </div>
            <div className="promoname">{selectedCoupon.title}</div>
          </div>
        </div>

        <div className="d-flex flex-column gap-2">
          <div>
            <strong>{t("couponPopup.code")}:</strong> {selectedCoupon.code}
          </div>
          <div>
            <strong>{t("couponPopup.discount")}:</strong> {selectedCoupon.discount}
            {selectedCoupon.discount_type === "percent" ? "%" : ""}
          </div>
          <div>
            <strong>{t("couponPopup.validPeriod")}:</strong>{" "}
            {formatDate(selectedCoupon.start_date)} -{" "}
            {formatDate(selectedCoupon.expire_date)}
          </div>
          <div>
            <strong>{t("couponPopup.minPurchase")}:</strong>{" "}
            {selectedCoupon.min_purchase}
          </div>
        </div>
      </Modal.Body>

      <div className="w-100 m-2 d-flex align-items-center justify-content-center">
        <Button
          variant=" backgroundMainColor text-light"
          style={{ maxWidth: "200px" }}
          onClick={handleCopyAll}
        >
          {t("couponPopup.copyAll")} 📋
        </Button>
      </div>
    </Modal>
  );
};

export default CouponDetailsPopup;
