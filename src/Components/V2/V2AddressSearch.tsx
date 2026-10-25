import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { MapPin, Search, ChevronDown } from "lucide-react";
import { useAppSelector } from "../../Hooks/hooks";
import LocationPopup from "../LocationPopup/LocationPopup";

const V2AddressSearch = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userLocation } = useAppSelector((state) => state.UserInfoSLice);
  const [showPopup, setShowPopup] = useState(false);

  const displayLocation = userLocation
    ? userLocation.includes(",")
      ? userLocation.split(",")[1]?.trim() || userLocation
      : userLocation
    : t("no_location_address_message");

  return (
    <>
      <div
        className="v2-address-row"
        onClick={() => setShowPopup(true)}
        role="button"
      >
        <MapPin size={14} color="var(--v2-gold)" />
        <span className="v2-addr-label">{t("v2.deliveryTo")}</span>
        <span className="v2-addr-text">{displayLocation}</span>
        <ChevronDown size={13} color="rgba(255,255,255,.4)" />
      </div>

      <div className="v2-search" onClick={() => navigate("/search")}>
        <Search size={16} color="var(--v2-gold)" />
        <input
          type="text"
          readOnly
          placeholder={t("v2.searchPlaceholder")}
          aria-label={t("mobile_header.search")}
        />
      </div>

      <LocationPopup
        show={showPopup}
        onClose={() => setShowPopup(false)}
        userLocation={userLocation}
        t={t}
      />
    </>
  );
};

export default V2AddressSearch;
