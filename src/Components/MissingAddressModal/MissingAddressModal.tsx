import { useEffect, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import type { AddressDTO } from "../../DTO/AdressDTO";

interface MissingAddressModalProps {
  show: boolean;
  address: AddressDTO | null;
  onClose: () => void;
  onSave: (updatedAddress: AddressDTO) => void;
}

const MissingAddressModal = ({
  show,
  address,
  onClose,
  onSave,
}: MissingAddressModalProps) => {
  const { t, i18n } = useTranslation();
  const [house, setHouse] = useState("");
  const [floor, setFloor] = useState("");
  const [road, setRoad] = useState("");
  const [addressText, setAddressText] = useState("");

  const needAddressText = !address?.address?.trim();

  useEffect(() => {
    if (show) {
      setHouse(address?.house ?? "");
      setFloor(address?.floor ?? "");
      setRoad(address?.road && address.road !== "1" ? address.road : "");
      setAddressText(address?.address ?? "");
    }
  }, [show, address]);

  const isValid =
    house.trim() !== "" &&
    floor.trim() !== "" &&
    road.trim() !== "" &&
    (!needAddressText || addressText.trim() !== "");

  const handleSave = () => {
    if (!isValid) return;
    onSave({
      ...address,
      id: address?.id ?? null,
      house: house.trim(),
      floor: floor.trim(),
      road: road.trim(),
      address: addressText.trim() || address?.address || "",
    } as AddressDTO);
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header
        closeButton
        style={{ direction: i18n.language === "ar" ? "rtl" : "ltr" }}
      >
        <Modal.Title>{t("checkout.complete_address")}</Modal.Title>
      </Modal.Header>

      <Modal.Body
        style={{
          direction: i18n.language === "ar" ? "rtl" : "ltr",
          textAlign: i18n.language === "ar" ? "right" : "left",
        }}
      >
        <p className="text-muted small">{t("checkout.address_required_note")}</p>

        {needAddressText && (
          <Form.Group className="mb-3">
            <Form.Label>{t("address.delivery_address")}</Form.Label>
            <Form.Control
              value={addressText}
              onChange={(e) => setAddressText(e.target.value)}
              placeholder={t("address.enter_delivery_address")}
            />
          </Form.Group>
        )}

        <Form.Group className="mb-3">
          <Form.Label>{t("address.house_number")}</Form.Label>
          <Form.Control
            value={house}
            onChange={(e) => setHouse(e.target.value)}
            placeholder={t("address.enter_house_number")}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>{t("address.floor_number")}</Form.Label>
          <Form.Control
            value={floor}
            onChange={(e) => setFloor(e.target.value)}
            placeholder={t("address.enter_floor_number")}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>{t("address.street_name")}</Form.Label>
          <Form.Control
            value={road}
            onChange={(e) => setRoad(e.target.value)}
            placeholder={t("address.enter_street_name")}
          />
        </Form.Group>
      </Modal.Body>

      <Modal.Footer>
        <Button
          className="w-100 backgroundMainColor border-0"
          disabled={!isValid}
          onClick={handleSave}
        >
          {t("checkout.save_and_continue")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MissingAddressModal;
