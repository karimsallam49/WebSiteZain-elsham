import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../Hooks/hooks";
import { addadress } from "../../store/Adress/AdressSlice";
import type { AddressDTO } from "../../DTO/AdressDTO";
import { Link } from "react-router-dom";
import "./locationpopupstyle.css"
interface LocationPopupProps {
  show: boolean;
  onClose: () => void;
  userLocation?: string | null;
  t: (key: string) => string;
}

const LocationPopup: React.FC<LocationPopupProps> = ({
  show,
  onClose,
  userLocation,
  t,
}) => {
  const { AdressData, selectedAdress } = useAppSelector(
    (state) => state.adressSlice
  );
  const [selectedAddress, setSelectedAddress] = useState<AddressDTO | null>(
    selectedAdress || null
  );
  const dispatch = useAppDispatch();


  useEffect(() => {
    if (selectedAdress) {
      setSelectedAddress(selectedAdress);
    }
  }, [selectedAdress]);

  const handleSelectAddress = (address: AddressDTO) => {
    setSelectedAddress(address);
  };

  const handleSelect = () => {
    if (selectedAddress) {
      dispatch(addadress(selectedAddress));
      onClose();
    }
  };

  
  const addressList = [
    ...(selectedAdress ? [selectedAdress] : []),
    ...(AdressData?.filter((a) => a.id !== selectedAdress?.id) || []),
  ];

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t("your_saved_addresses")}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {addressList && addressList.length > 0 ? (
          <Form>
            {addressList.map((el, index) => (
              <div
                key={el.id ?? index}
                className={`p-2 mb-2 border rounded d-flex align-items-start gap-2 ${
                  selectedAddress?.id === el.id ? "BorderMainColor bg-light" : ""
                }`}
                style={{ cursor: "pointer" }}
                onClick={() => handleSelectAddress(el)}
              >
                <Form.Check
                  type="radio"
                  name="selectedAddress"
                  checked={selectedAddress?.id === el.id}
                  onChange={() => handleSelectAddress(el)}
                  className="mt-1 custom-radio-fav "
                />
                <div className="d-flex flex-column w-100">
                  
                  <span className="fw-semibold">{el.address_type}</span>
                  <span className="text-muted small">{el.address}</span>
                </div>
              </div>
            ))}
          </Form>
        ) : (
          <div className="text-center text-muted py-3">
            {t("no_saved_addresses")}
          </div>
        )}

        <hr />

        {userLocation ? (
          <div className="text-secondary small text-center">
            {t("current_location")}: {userLocation}
          </div>
        ) : (
          <div className="text-muted text-center small">
            {t("no_location_address_message")}
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="d-flex flex-column gap-2">
        <Link
        onClick={onClose}
          to="/AdressPage"
          className="w-100 text-center border-0"
          style={{
            textDecoration: "none",
            color: "var(--main-color)",
            fontWeight: "500",
          }}
        >
          ➕ {t("add_new_address")}
        </Link>
        <Button
          className="w-100 backgroundMainColor border-0"
          disabled={!selectedAddress}
          onClick={handleSelect}
        >
          {t("select")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LocationPopup;
