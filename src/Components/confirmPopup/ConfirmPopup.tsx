// src/components/ConfirmPopup.tsx
import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import "../../App.css";

interface ConfirmPopupProps {
  show: boolean;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmPopup: React.FC<ConfirmPopupProps> = ({
  show,
  message,
  onConfirm,
  onClose,
}) => {
  const { t, i18n } = useTranslation();
  const dir = i18n.language === "ar" ? "rtl" : "ltr";

  return (
    <Modal show={show} onHide={onClose} centered dir={dir}>
      <Modal.Header>
        <Modal.Title>{t("Confirm")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>
      <Modal.Footer className="w-100 d-flex align-items-center justify-content-center">
        <Button variant="secondary" onClick={onClose}>
          {t("Cancel")}
        </Button>
        <Button
          className="backgroundMainColor border-0"
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {t("Confirm")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmPopup;
