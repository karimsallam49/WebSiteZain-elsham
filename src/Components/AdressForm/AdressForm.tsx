import { useEffect, useState } from "react";
import "./AddressForm.css";
import GoogleMapComponent from "../GoogleMap/GoogleMap";
import { useAppDispatch, useAppSelector } from "../../Hooks/hooks";
import { actAddadress } from "../../store/Adress/actAddAdress";
import type { AddressDTO } from "../../DTO/AdressDTO";
import { actGetadress } from "../../store/Adress/actGetAddress";
import { Spinner } from "react-bootstrap";
import { addadress, editeAdressAction } from "../../store/Adress/AdressSlice";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

const AddressForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [addressType, setAddressType] = useState("Home");
  const [address, setAddress] = useState("");
  const [house, setHouse] = useState("");
  const [floor, setFloor] = useState("");
  const [lat, setLat] = useState(30.096528);
  const [lng, setLng] = useState(31.072488);

  const { AdressData, loading, editeAdress } = useAppSelector(
    (state) => state.adressSlice
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (editeAdress) {
      const latest = editeAdress;
      setContactName(latest.contact_person_name ?? "");
      setPhone(latest.contact_person_number?.replace("+20", "") ?? "");
      setAddressType(latest.address_type ?? "Home");
      setAddress(latest.address ?? "");
      setHouse(latest.house ?? "");
      setFloor(latest.floor ?? "");
      setLat(Number(latest.latitude) || 30.096528);
      setLng(Number(latest.longitude) || 31.072488);
    } else {
      if (AdressData && AdressData.length > 0) {
        const latest = AdressData[0];
        setContactName(latest.contact_person_name ?? "");
        setPhone(latest.contact_person_number?.replace("+20", "") ?? "");
        setAddressType(latest.address_type ?? "Home");
        setAddress(latest.address ?? "");
        setHouse(latest.house ?? "");
        setFloor(latest.floor ?? "");
        setLat(Number(latest.latitude) || 30.096528);
        setLng(Number(latest.longitude) || 31.072488);
      }
    }
  }, [AdressData]);

  const handleSave = () => {
    const payload: AddressDTO = {
      id: null,
      address_type: addressType,
      contact_person_number: `+20${phone}`,
      floor: floor || null,
      house: house || null,
      road: "1",
      address,
      latitude: lat.toString(),
      longitude: lng.toString(),
      created_at: null,
      updated_at: null,
      user_id: null,
      is_guest: 0,
      contact_person_name: contactName,
      is_default: 0,
    };

    dispatch(actAddadress(payload)).then(() => {
      dispatch(actGetadress()).then(() => {
        navigate("/AdressPageInfo");
      });
      dispatch(addadress(payload));
      if (editeAdress) {
        dispatch(editeAdressAction(null));
      }
    });
  };

  const tabs = [
    { key: "Home", label: t("address.home") },
    { key: "Workplace", label: t("address.work") },
    { key: "Other", label: t("address.other") },
  ];

  return (
    <div className="address-page">
      <div className="section card card-form">
        <h5 className="section-title">{t("address.contact_info")}</h5>
        <div className="form-grid">
          <div className="form-group">
            <label>{t("address.contact_name")}</label>
            <input
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder={t("address.enter_name")}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>{t("address.phone_number")}</label>
            <div className="phone-input">
              <span className="flag">🇪🇬 +20</span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t("address.phone_placeholder")}
                className="form-control phone"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="w-100">
        <div className="headeer mb-3 text-muted">
          <h5>{t("address.details_title")}</h5>
        </div>

        <div className="tabs-container flex-row">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`tab-btn ${addressType === tab.key ? "active" : ""}`}
              onClick={() => setAddressType(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div
          className="d-flex flex-lg-row flex-column w-100 justify-content-between align-items-center p-2"
          style={{ gap: "1rem" }}
        >
          <div className="section card h-100 w-100 p-3">
            <h5 className="section-title mb-3">{t("address.details_title")}</h5>

            <div className="row g-3">
              <div className="col-12 col-md-6">
                <div className="form-group">
                  <label className="form-label fw-semibold text-muted">
                    {t("address.delivery_address")}
                  </label>
                  <input
                    type="text"
                    placeholder={t("address.enter_delivery_address")}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="form-group">
                  <label className="form-label fw-semibold text-muted">
                    {t("address.house_number")}
                  </label>
                  <input
                    type="text"
                    placeholder={t("address.enter_house_number")}
                    value={house}
                    onChange={(e) => setHouse(e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="form-group">
                  <label className="form-label fw-semibold text-muted">
                    {t("address.floor_number")}
                  </label>
                  <input
                    type="text"
                    placeholder={t("address.enter_floor_number")}
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="form-group">
                  <label className="form-label fw-semibold text-muted">
                    {t("address.street_name")}
                  </label>
                  <input
                    type="text"
                    placeholder={t("address.enter_street_name")}
                    className="form-control border-1"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-100">
            <GoogleMapComponent
              lat={lat}
              lng={lng}
              onLocationChange={(newLat, newLng, newAddress) => {
                setLat(newLat);
                setLng(newLng);
                if (newAddress) setAddress(newAddress);
              }}
            />
          </div>
        </div>
      </div>

      <button className="save-btn" onClick={handleSave}>
        {loading ? (
          <Spinner size="sm" animation="border" />
        ) : (
          t("address.save_button")
        )}
      </button>
    </div>
  );
};

export default AddressForm;
