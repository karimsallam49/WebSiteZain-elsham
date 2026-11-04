import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Bell, ChevronLeft, ChevronRight } from "lucide-react";
import placeholderimg from "../../assets/image/placeholder_image .png";
import { useAppSelector } from "../../Hooks/hooks";
import "./NotificationPage.css";

const NotificationPage = () => {
  const { notificationsData } = useAppSelector((state) => state.notificationsSlice);
  const {resturantdata}=useAppSelector((state)=>state.restaurantSettingsSlice)
  const notificationimage=resturantdata?.base_urls.notification_image_url
  const {t, i18n}=useTranslation()
  let lastDate = "";

  return (
    <div className="container py-4 notification-page">
      {notificationsData && notificationsData.length > 0 ? (
        notificationsData.map((el, index) => {
          const [datePart, timePartRaw] = el.updated_at.split("T");
          const [hours, minutes] = timePartRaw.split(":");
          const timePart = `${hours}:${minutes}`;
          const showHeader = datePart !== lastDate;
          lastDate = datePart;

          return (
            <Fragment key={index}>
              {showHeader && (
                <div className="notif-date-header">{datePart}</div>
              )}
            <div className="notif-card">
              {/* أيقونة/صورة الإشعار في تايل ذهبي */}
              <div className="notif-icon">
                <img
                  src={
                    el.image
                      ? `${notificationimage}/${el.image}`
                      : placeholderimg
                  }
                  alt=""
                  onError={(e) => (e.currentTarget.src = placeholderimg)}
                />
              </div>

              <div className="notif-body">
                <p className="notif-title">{el.title}</p>
              </div>

              <div className="notif-side">
                <span className="notif-time">{timePart}</span>
                {i18n.language === "ar" ? (
                  <ChevronLeft size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </div>
            </div>
            </Fragment>
          );
        })
      ) : (
        <div className="notif-empty">
          <Bell size={38} />
          <p>{t("NoNotification")}</p>
        </div>
      )}
    </div>
  );
};

export default NotificationPage;
