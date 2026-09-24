import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../Hooks/hooks";
import "./NotificationPage.css";

const NotificationPage = () => {
  const { notificationsData } = useAppSelector((state) => state.notificationsSlice);
  const {resturantdata}=useAppSelector((state)=>state.restaurantSettingsSlice)
  const notificationimage=resturantdata?.base_urls.notification_image_url
  const {t}=useTranslation()

  return (
    <div className="container py-4 notification-page">
      {notificationsData && notificationsData.length > 0 ? (
        notificationsData.map((el, index) => {
          const [datePart, timePartRaw] = el.updated_at.split("T");
          const [hours, minutes] = timePartRaw.split(":");
          const timePart = `${hours}:${minutes}`;

          return (
            <div
              key={index}
              className="py-5 border-bottom border-dark"
            >
              
              <h5 className="mb-4  text-black">{datePart}</h5>

              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex gap3">
                  {el.image&&(

                <img src={`${notificationimage}/${el.image}`} className="rounded-2" width={50} alt="" />
                  )}
                <p className="mb-0 text-black fw-medium">{el.title}</p>
                </div>
                <p className="mb-0 text-black">{timePart}</p>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center text-muted py-5">
        {t("NoNotification")}
        </div>
      )}
    </div>
  );
};

export default NotificationPage;
