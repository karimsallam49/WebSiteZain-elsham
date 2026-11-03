import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../Hooks/hooks'
import { Button, Card, Modal } from 'react-bootstrap'
import { Check, MapPin, Phone, Plus, User } from "lucide-react";
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { addadress } from '../../store/Adress/AdressSlice'

const UserInformation = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { UserData, userLocation } = useAppSelector((state) => state.UserInfoSLice);
  const { selectedAdress, AdressData } = useAppSelector((state) => state.adressSlice);
  const [showPicker, setShowPicker] = useState(false);

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

              <Button
                variant="link"
                className="p-0 text-decoration-none"
                style={{ color: "var(--MainColor)" }}
                onClick={() => setShowPicker(true)}
              >
                {t("updateInfo")}
              </Button>
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

      {/* اختيار عنوان من عناوين المستخدم — العنوان المختار هو اللي بيتبعت مع الأوردر */}
      <Modal
        show={showPicker}
        onHide={() => setShowPicker(false)}
        centered
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>{t("mobile_header.addresses")}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-2 p-md-3">
          {!AdressData || AdressData.length === 0 ? (
            <div className="text-muted text-center py-4">
              {t("checkout.no_saved_addresses")}
            </div>
          ) : (
            <div className="d-flex flex-column gap-2">
              {AdressData.map((addr) => {
                const active = selectedAdress?.id === addr.id;
                return (
                  <button
                    key={addr.id}
                    type="button"
                    className={`addr-pick${active ? " active" : ""}`}
                    onClick={() => {
                      dispatch(addadress(addr));
                      setShowPicker(false);
                    }}
                  >
                    <MapPin size={16} className="addr-pick-pin" />
                    <span className="text-start flex-grow-1">
                      <span className="d-block fw-bold">{addr.address_type}</span>
                      {addr.contact_person_name && (
                        <span className="d-block small">
                          {addr.contact_person_name}
                          {addr.contact_person_number && (
                            <> — <bdi dir="ltr">{addr.contact_person_number}</bdi></>
                          )}
                        </span>
                      )}
                      <span className="d-block small text-muted">{addr.address}</span>
                      {addr.delivery_area && (
                        <span className="d-block small text-muted">
                          {addr.delivery_area.area_name}
                        </span>
                      )}
                    </span>
                    {active && <Check size={18} className="addr-pick-check" />}
                  </button>
                );
              })}
            </div>
          )}

          <Link
            to="/AdressPage"
            className="addr-add"
            onClick={() => setShowPicker(false)}
          >
            <Plus size={15} /> {t("mobile_header.address_form")}
          </Link>
        </Modal.Body>
      </Modal>
    </Card>
  );
};

export default UserInformation;
