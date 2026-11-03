import { useEffect, useState } from "react";
import "./AddressForm.css";
import GoogleMapComponent from "../GoogleMap/GoogleMap";
import { useAppDispatch, useAppSelector } from "../../Hooks/hooks";
import { actAddadress } from "../../store/Adress/actAddAdress";
import { actUpdateAdress } from "../../store/Adress/actUpdateAdress";
import type { AddressDTO } from "../../DTO/AdressDTO";
import { actGetadress } from "../../store/Adress/actGetAddress";
import { Spinner } from "react-bootstrap";
import { addadress, editeAdressAction } from "../../store/Adress/AdressSlice";
import { useLocation, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import FeedbackToast from "../FeedbackToast/FeedbackToast";

const REQUIRED_FIELDS = [
  "contact_person_name",
  "contact_person_number",
  "address",
  "house",
  "floor",
  "road",
];

interface AddressFormProps {
  onSaved?: () => void;
  requiredFields?: string[];
  highlightArea?: boolean;
}

const AddressForm = ({ onSaved, requiredFields = [], highlightArea = false }: AddressFormProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isNew = useLocation().state?.isNew === true;

  const [invalidFields, setInvalidFields] = useState<string[]>([]);

  const isRequired = (field: string) =>
    requiredFields.includes(field) || REQUIRED_FIELDS.includes(field);

  const fieldClass = (field: string, base: string = "form-control") =>
    `${base} ${invalidFields.includes(field) ? "is-invalid" : ""}`;

  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [addressType, setAddressType] = useState("Home");
  const [address, setAddress] = useState("");
  const [house, setHouse] = useState("");
  const [floor, setFloor] = useState("");
  const [street, setStreet] = useState("");
  const [lat, setLat] = useState(30.096528);
  const [lng, setLng] = useState(31.072488);
  const [addressId, setAddressId] = useState<number | null>(null);
  const [deliveryAreaId, setDeliveryAreaId] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [toastShow, setToastShow] = useState(false);

  const { AdressData, loading, editeAdress, selectedAdress } = useAppSelector(
    (state) => state.adressSlice
  );
  const { UserData } = useAppSelector((state) => state.UserInfoSLice);
  const { deliverfeeData } = useAppSelector((state) => state.DeliveryFeeSlice);
  const { selectedBranch } = useAppSelector(
    (state) => state.restaurantSettingsSlice
  );
  const dispatch = useAppDispatch();

  const deliveryAreas = deliverfeeData?.delivery_charge_by_area ?? [];
  const isAreaType =
    deliverfeeData?.delivery_charge_setup?.delivery_charge_type === "area" &&
    deliveryAreas.length > 0;

  useEffect(() => {
    if (!isNew || !UserData) return;
    setContactName(`${UserData.f_name ?? ""} ${UserData.l_name ?? ""}`.trim());
    setPhone(UserData.phone?.replace("+20", "") ?? "");
  }, [isNew, UserData]);

  useEffect(() => {
    if (isNew) return;
    const latest =
      editeAdress ??
      selectedAdress ??
      (AdressData && AdressData.length > 0 ? AdressData[0] : null);
    if (!latest) return;
    setAddressId(latest.id ?? null);
    // عنوان الـ geolocation المؤقت (id null) بيبقى فيه placeholders —
    // ساعتها ناخد اسم/تليفون اليوزر الحقيقي بدلهم
    const isTempAddress = !latest.id;
    const fallbackName =
      `${UserData?.f_name ?? ""} ${UserData?.l_name ?? ""}`.trim();
    const fallbackPhone = UserData?.phone?.replace("+20", "") ?? "";
    setContactName(
      isTempAddress ? fallbackName : latest.contact_person_name || fallbackName
    );
    setPhone(
      isTempAddress
        ? fallbackPhone
        : latest.contact_person_number?.replace("+20", "") || fallbackPhone
    );
    setAddressType(latest.address_type ?? "Home");
    setAddress(latest.address ?? "");
    setHouse(latest.house ?? "");
    setFloor(latest.floor ?? "");
    setStreet(latest.road ?? "");
    setLat(Number(latest.latitude) || 30.096528);
    setLng(Number(latest.longitude) || 31.072488);
    // المنطقة لازم تكون تابعة للفرع الحالي — delivery_area بيرجع مفلتر بالفرع
    // من السيرفر، وdelivery_area_id الخام ممكن يكون لفرع تاني فنتحقق منه
    setDeliveryAreaId(
      latest.delivery_area?.id ??
        (deliveryAreas.some((a) => a.id === latest.delivery_area_id)
          ? latest.delivery_area_id ?? null
          : null)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [AdressData, isNew, UserData, editeAdress, selectedAdress, deliverfeeData?.delivery_charge_by_area]);

  const handleSave = () => {
    const missing: string[] = [];
    if (isRequired("contact_person_name") && !contactName.trim())
      missing.push("contact_person_name");
    if (isRequired("contact_person_number") && !phone.trim())
      missing.push("contact_person_number");
    if (isRequired("address") && !address.trim()) missing.push("address");
    if (isRequired("house") && !house.trim()) missing.push("house");
    if (isRequired("floor") && !floor.trim()) missing.push("floor");
    if (isRequired("road") && !street.trim()) missing.push("road");
    setInvalidFields(missing);
    if (missing.length > 0) return;

    const payload: AddressDTO = {
      id: addressId,
      address_type: addressType,
      contact_person_number: `+20${phone}`,
      floor: floor || null,
      house: house || null,
      road: street,
      address,
      latitude: lat.toString(),
      longitude: lng.toString(),
      created_at: null,
      updated_at: null,
      user_id: null,
      is_guest: 0,
      contact_person_name: contactName,
      is_default: 1,
      delivery_area_id: isAreaType ? deliveryAreaId : null,
      branch_id: selectedBranch ?? null,
    };

    const onSaveSuccess = () => {
      dispatch(actGetadress())
        .unwrap()
        .then((list: AddressDTO[]) => {
          // اختار العنوان الحقيقي من السيرفر (بـ id و delivery_area) مش الـ payload المحلي
          const saved =
            list?.find((a) => a.id === addressId) ??
            list?.find((a) => a.address === payload.address) ??
            list?.[0];
          if (saved) dispatch(addadress(saved));

          if (onSaved) onSaved();
          else navigate("/AdressPageInfo");
        })
        .catch(() => {
          if (onSaved) onSaved();
          else navigate("/AdressPageInfo");
        });
      if (editeAdress) {
        dispatch(editeAdressAction(null));
      }
    };
    const onSaveError = () => {
      setToastMessage(t("address.save_error"));
      setToastShow(true);
    };

    if (addressId) {
      dispatch(actUpdateAdress({ id: addressId, body: payload }))
        .unwrap()
        .then(onSaveSuccess)
        .catch(onSaveError);
    } else {
      dispatch(actAddadress(payload))
        .unwrap()
        .then(onSaveSuccess)
        .catch(onSaveError);
    }
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
            <label>
              {t("address.contact_name")}
              {isRequired("contact_person_name") && (
                <span className="text-danger"> *</span>
              )}
            </label>
            <input
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder={t("address.enter_name")}
              className={fieldClass("contact_person_name")}
            />
          </div>

          <div className="form-group">
            <label>
              {t("address.phone_number")}
              {isRequired("contact_person_number") && (
                <span className="text-danger"> *</span>
              )}
            </label>
            <div className="phone-input">
              <span className="flag">🇪🇬 +20</span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t("address.phone_placeholder")}
                className={fieldClass("contact_person_number", "form-control phone")}
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
                    {isRequired("address") && (
                      <span className="text-danger"> *</span>
                    )}
                  </label>
                  <input
                    type="text"
                    placeholder={t("address.enter_delivery_address")}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className={fieldClass("address")}
                  />
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="form-group">
                  <label className="form-label fw-semibold text-muted">
                    {t("address.house_number")}
                    {isRequired("house") && (
                      <span className="text-danger"> *</span>
                    )}
                  </label>
                  <input
                    type="text"
                    placeholder={t("address.enter_house_number")}
                    value={house}
                    onChange={(e) => setHouse(e.target.value)}
                    className={fieldClass("house")}
                  />
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="form-group">
                  <label className="form-label fw-semibold text-muted">
                    {t("address.floor_number")}
                    {isRequired("floor") && (
                      <span className="text-danger"> *</span>
                    )}
                  </label>
                  <input
                    type="text"
                    placeholder={t("address.enter_floor_number")}
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    className={fieldClass("floor")}
                  />
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="form-group">
                  <label className="form-label fw-semibold text-muted">
                    {t("address.street_name")}
                    {isRequired("road") && (
                      <span className="text-danger"> *</span>
                    )}
                  </label>
                  <input
                    type="text"
                    placeholder={t("address.enter_street_name")}
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className={fieldClass("road")}
                  />
                </div>
              </div>

              {isAreaType && (
                <div className="col-12 col-md-6">
                  <div className="form-group">
                    <label className="form-label fw-semibold text-muted">
                      {t("address.delivery_area")}
                      {highlightArea && <span className="text-danger"> *</span>}
                    </label>
                    <select
                      className={`form-select ${
                        highlightArea && !deliveryAreaId ? "is-invalid" : ""
                      }`}
                      value={deliveryAreaId ?? ""}
                      onChange={(e) =>
                        setDeliveryAreaId(
                          e.target.value ? Number(e.target.value) : null
                        )
                      }
                    >
                      <option value="">{t("address.select_area")}</option>
                      {deliveryAreas.map((area) => (
                        <option key={area.id} value={area.id}>
                          {area.area_name}
                        </option>
                      ))}
                    </select>
                    {highlightArea && !deliveryAreaId && (
                      <div className="text-danger small mt-1">
                        {t("checkout.select_area_first")}
                      </div>
                    )}
                  </div>
                </div>
              )}
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
      <FeedbackToast
        message={toastMessage}
        show={toastShow}
        onClose={() => setToastShow(false)}
        type="error"
      />
    </div>
  );
};

export default AddressForm;
