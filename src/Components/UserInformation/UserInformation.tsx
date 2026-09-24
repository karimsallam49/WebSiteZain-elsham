import { useAppSelector } from '../../Hooks/hooks'
import { Button, Card } from 'react-bootstrap'
import userPic from "../../assets/svg/profile.svg"
import phonePic from "../../assets/svg/call.svg"
import locationPic from "../../assets/svg/location_placemark_svg.svg"
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const UserInformation = () => {
  const { t } = useTranslation();
  const { UserData, userLocation } = useAppSelector((state) => state.UserInfoSLice);
  const { selectedAdress } = useAppSelector((state) => state.adressSlice);

  return (
    <Card className="p-3 border-0 w-100 shadow-sm mb-3 rounded-4">
      <div className="d-flex w-100 justify-content-between align-items-center mb-3">
        <div className="d-flex w-100 align-items-center gap-2">
          <i className="bi bi-geo-alt text-danger"></i>
          <div className="w-100">
            <div className="w-100 d-flex justify-content-between align-items-center mb-3">
              <strong>{t("deliveryInformation")}</strong>

              <Link to="/AdressPage" className="text-decoration-none">
                <Button
                  variant="link"
                  className="p-0 text-decoration-none"
                  style={{ color: "var(--MainColor)" }}
                >
                  {t("updateInfo")}
                </Button>
              </Link>
            </div>

            <div className="user-info-container text-muted small d-flex flex-column align-items-start justify-content-center gap-3 w-100">
              <div className="info-item d-flex flex-column align-items-start gap-2 w-100 pb-2 border-bottom">
                <span className="d-flex align-items-center gap-2">
                  <img src={userPic} alt="" style={{ width: "22px", height: "22px" }} />
                  <span style={{ fontSize: "1.1rem", color: "#333" }}>
                    {`${UserData?.f_name} ${UserData?.l_name}`}
                  </span>
                </span>

                <span className="d-flex align-items-center gap-2">
                  <img src={phonePic} alt="" style={{ width: "22px", height: "22px" }} />
                  <span style={{ fontSize: "1.1rem", color: "#333" }}>
                    {UserData?.phone}
                  </span>
                </span>
              </div>

              <div className="info-item d-flex align-items-center gap-2 w-100">
                <img src={locationPic} alt="" style={{ width: "22px", height: "22px" }} />
                <span style={{ fontSize: "1.1rem", color: "#333" }}>
                  {selectedAdress?.address ?? userLocation}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default UserInformation;
