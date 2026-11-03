import { useState, useCallback } from "react";
import { useAppSelector } from "../../Hooks/hooks";
import React from "react";
import { useTranslation } from "react-i18next";
import { Home, Store } from "lucide-react";
import "../../App.css";
import "./PlaceOrderDeliverType.css";

type PlaceOrderProps = {
  SetOnSelectedType: (Type: "delivery" | "take_away" | "dine_in") => void;
};

const PlaceOrderDeliverType = React.memo(({ SetOnSelectedType }: PlaceOrderProps) => {
  const [selectedType, setSelectedType] = useState<"delivery" | "take_away" | "dine_in">("delivery");

  const { resturantdata } = useAppSelector((state) => state.restaurantSettingsSlice);
  const { t } = useTranslation();

  const handleSelectType = useCallback((type: "delivery" | "take_away" | "dine_in") => {
    setSelectedType(type);
    SetOnSelectedType(type);
  }, [SetOnSelectedType]);

  const options = [
    {
      key: "delivery" as const,
      enabled: resturantdata?.delivery,
      icon: Home,
      label: t("checkout.home_delivery"),
    },
    {
      key: "take_away" as const,
      enabled: resturantdata?.self_pickup,
      icon: Store,
      label: t("checkout.take_away"),
    },
  ];

  return (
    <div className="w-100 mb-4">
      <h4 className="mb-3 fw-semibold text-dark">{t("checkout.delivery_type")}</h4>

      <div className="dt-row">
        {options
          .filter((o) => o.enabled)
          .map((o) => {
            const active = selectedType === o.key;
            return (
              <button
                key={o.key}
                type="button"
                className={`dt-option${active ? " active" : ""}`}
                onClick={() => handleSelectType(o.key)}
                aria-pressed={active}
              >
                <span className="dt-radio" aria-hidden="true" />
                <o.icon size={22} className="dt-icon" />
                <span className="dt-label">{o.label}</span>
              </button>
            );
          })}
      </div>
    </div>
  );
});

export default PlaceOrderDeliverType;
