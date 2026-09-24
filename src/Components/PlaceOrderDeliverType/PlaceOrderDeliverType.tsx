import { useState, useCallback, useMemo } from "react";
import { Card, Form } from "react-bootstrap";
import { useAppSelector } from "../../Hooks/hooks";
import React from "react";
import { useTranslation } from "react-i18next"; // ✅ إضافة الترجمة
import "../../App.css";

type PlaceOrderProps = {
  setOnselec: (Areanumber: number) => void;
  SetOnSelectedType: (Type: "delivery" | "take_away" | "dine_in") => void;
};

const PlaceOrderDeliverType = React.memo(({ setOnselec, SetOnSelectedType }: PlaceOrderProps) => {
  const [selectedType, setSelectedType] = useState<"delivery" | "take_away" | "dine_in">("delivery");
  const [selectedArea, setSelectedArea] = useState<number | null>(null);

  const { resturantdata } = useAppSelector((state) => state.restaurantSettingsSlice);
  const { deliverfeeData } = useAppSelector((state) => state.DeliveryFeeSlice);

  const { t } = useTranslation(); // ✅ Hook الترجمة

  const styles = useMemo(() => ({
    activeBg: "#f5e1c0",
    activeBorder: "#b8860b",
    activeText: "#5a3e1b"
  }), []);

  const handleSelectType = useCallback((type: "delivery" | "take_away" | "dine_in") => {
    setSelectedType(type);
    SetOnSelectedType(type);
  }, [SetOnSelectedType]);

  const handleSelectArea = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value);
    setSelectedArea(value);
    setOnselec(value);
  }, [setOnselec]);

  const areaOptions = useMemo(() => {
    return deliverfeeData?.delivery_charge_by_area?.map((area) => (
      <option key={area.id} value={area.id}>
        {area.area_name} ({area.delivery_charge} EGP)
      </option>
    ));
  }, [deliverfeeData]);

  return (
    <>
      <div className="w-100 mb-4">
        <h4 className="mb-3 fw-semibold text-dark">{t("checkout.delivery_type")}</h4>

        <div className="d-flex gap-3">
          {resturantdata?.delivery && (
            <Card
              onClick={() => handleSelectType("delivery")}
              className="flex-fill text-center p-3 border-2"
              style={{
                cursor: "pointer",
                transition: "0.3s",
                borderColor:
                  selectedType === "delivery" ? styles.activeBorder : "#e5e5e5",
                backgroundColor:
                  selectedType === "delivery" ? styles.activeBg : "#f8f9fa",
              }}
            >
              <div className="form-check d-flex custom-radio-fav justify-content-start align-items-center gap-2 m-0">
                <input
                  className="custom-radio-fav"
                  type="radio"
                  name="deliveryType"
                  id="homeDelivery"
                  checked={selectedType === "delivery"}
                  readOnly
                  style={{
                    accentColor:
                      selectedType === "delivery" ? styles.activeText : "#b0b0b0",
                  }}
                />
                <label
                  className="form-check-label fw-semibold mb-0"
                  htmlFor="homeDelivery"
                  style={{
                    color:
                      selectedType === "delivery" ? styles.activeText : "#000",
                    fontSize: "0.95rem",
                  }}
                >
                  {t("checkout.home_delivery")}
                </label>
              </div>
            </Card>
          )}

          {resturantdata?.self_pickup && (
            <Card
              onClick={() => handleSelectType("take_away")}
              className="flex-fill text-center p-3 border-2"
              style={{
                cursor: "pointer",
                borderColor:
                  selectedType === "take_away" ? styles.activeBorder : "#e5e5e5",
                backgroundColor:
                  selectedType === "take_away" ? styles.activeBg : "#f8f9fa",
              }}
            >
              <div className="form-check d-flex justify-content-start align-items-center gap-2 m-0">
                <input
                  className="custom-radio-fav"
                  type="radio"
                  name="deliveryType"
                  id="takeAway"
                  checked={selectedType === "take_away"}
                  readOnly
                  style={{
                    accentColor:
                      selectedType === "take_away" ? styles.activeText : "#b0b0b0",
                  }}
                />
                <label
                  className="form-check-label fw-semibold mb-0"
                  htmlFor="take_away"
                  style={{
                    color:
                      selectedType === "take_away" ? styles.activeText : "#000",
                    fontSize: "0.95rem",
                  }}
                >
                  {t("checkout.take_away")}
                </label>
              </div>
            </Card>
          )}
        </div>
      </div>

      {selectedType === "delivery" && (
        <div className="w-100 mb-4">
          <h4 className="mb-3 fw-semibold">{t("checkout.zip_or_area")}</h4>
          <Form.Select
            aria-label="Select Delivery Area"
            value={selectedArea ?? ""}
            onChange={handleSelectArea}
          >
            <option value="">{t("checkout.select_your_area")}</option>
            {areaOptions}
          </Form.Select>
        </div>
      )}
    </>
  );
});

export default PlaceOrderDeliverType;
