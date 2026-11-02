import { useAppSelector } from '../../Hooks/hooks'
import { Button, Card } from 'react-bootstrap'
import { MapPin, Phone, User } from "lucide-react";
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
          <div className="w-100">
            <div className="w-100 d-flex justify-content-between align-items-center mb-3">
              <strong className="d-flex align-items-center gap-2">
                <MapPin size={16} strokeWidth={2} style={{ color: "var(--v2-gold, #c9a35b)" }} />
                {t("deliveryInformation")}
              </strong>

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
                  <User size={15} strokeWidth={1.8} style={{ color: "var(--v2-gold, #c9a35b)", flexShrink: 0 }} />
                  <span style={{ fontSize: "0.88rem" }} className="v2-delivery-text">
                    {`${UserData?.f_name} ${UserData?.l_name}`}
                  </span>
                </span>

                <span className="d-flex align-items-center gap-2">
                  <Phone size={15} strokeWidth={1.8} style={{ color: "var(--v2-gold, #c9a35b)", flexShrink: 0 }} />
                  <span style={{ fontSize: "0.88rem" }} className="v2-delivery-text" dir="ltr">
                    {UserData?.phone}
                  </span>
                </span>
              </div>

              <div className="info-item d-flex align-items-start gap-2 w-100">
                <MapPin size={15} strokeWidth={1.8} style={{ color: "var(--v2-gold, #c9a35b)", flexShrink: 0, marginTop: "2px" }} />
                <span style={{ fontSize: "0.88rem" }} className="v2-delivery-text">
                  {selectedAdress?.address ?? userLocation}
                  {selectedAdress?.delivery_area &&
                    ` — ${selectedAdress.delivery_area.area_name} (${selectedAdress.delivery_area.delivery_charge} EGP)`}
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
