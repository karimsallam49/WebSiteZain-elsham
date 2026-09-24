import { useEffect, useState } from "react";
import { useAppSelector } from "../../Hooks/hooks";
import { MapPin, Lock } from "lucide-react";
import "./AdressInfo.css";
import { useTranslation } from "react-i18next";
import LocationPopup from "../LocationPopup/LocationPopup";

const AdressInfo = () => {
  const { userLocation } = useAppSelector((state) => state.UserInfoSLice);
  const { resturantdata } = useAppSelector((state) => state.restaurantSettingsSlice);
  const [IsResturantOpen, SetIsResturantOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const { t } = useTranslation();

  const restaurantScheduleTime = resturantdata?.restaurant_schedule_time;
  const today = new Date();
  const todayIndex = (today.getDay() + 6) % 7;

  const currentDayInRes = restaurantScheduleTime?.filter(
    (el) => el.day === todayIndex
  );

  useEffect(() => {
    if (!currentDayInRes) return;

    const now = new Date();

    const todayStatus = currentDayInRes.some((el) => {
      const [hours, minutes, seconds] = el.closing_time.split(":").map(Number);
      const closingTime = new Date(now);
      closingTime.setHours(hours, minutes, seconds, 0);

      return now < closingTime;
    });

    SetIsResturantOpen(todayStatus);
  }, [currentDayInRes]);

  const handleShowPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  
  const displayLocation = userLocation
    ? userLocation.includes(",")
      ? userLocation.split(",")[1].trim()
      : userLocation
    : "No location address";

  return (
    <>
      <div
        className="d-flex align-items-center container gap-2 adress-container"
        style={{
          height: "50px",
          backgroundColor: "white",
          padding: ".5rem",
          borderBottom: "1px solid #ddd",
          direction: "ltr",
          cursor: "pointer",
        }}
        onClick={handleShowPopup}
      >
        {IsResturantOpen ? (
          <>
            <MapPin size={20} color="#dc3545" />
            <span
              className={`fw-semibold ${
                userLocation ? "text-dark" : "text-muted fst-italic"
              }`}
              style={{
                fontSize: "medium",
                maxWidth: "70%",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {displayLocation}
            </span>
          </>
        ) : (
          <>
            <Lock size={18} color="#888" />
            <span className="text-muted small">{t("restaurant_closed")}</span>
          </>
        )}
      </div>

     <LocationPopup
    show={showPopup}
    onClose={handleClosePopup}
    userLocation={userLocation}
    t={t}
  />
    
    </>
  );
};

export default AdressInfo;
