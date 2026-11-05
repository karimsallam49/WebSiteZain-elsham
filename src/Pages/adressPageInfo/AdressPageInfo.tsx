import { useAppDispatch, useAppSelector } from "../../Hooks/hooks";
import "./adressinfostyle.css";
import { actDeleteadress } from "../../store/Adress/actDeleteAdress";
import { useEffect, useState } from "react";
import ConfirmPopup from "../../Components/confirmPopup/ConfirmPopup";
import { editeAdressAction } from "../../store/Adress/AdressSlice";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { MapPin, Pencil, Plus, Trash2 } from "lucide-react";

const AdressPageInfo = () => {
  const { t } = useTranslation();
  const { AdressData } = useAppSelector((state) => state.adressSlice);
  const { deliverfeeData } = useAppSelector((state) => state.DeliveryFeeSlice);
  const isAreaType =
    deliverfeeData?.delivery_charge_setup?.delivery_charge_type === "area" &&
    (deliverfeeData?.delivery_charge_by_area?.length ?? 0) > 0;
  const [filterdadress, Setfilterdadress] = useState(AdressData);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<any | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    Setfilterdadress(AdressData);
  }, [AdressData]);

  const Deleteaction = (id: any) => {
    dispatch(actDeleteadress(id))
      .unwrap()
      .then(() => {
        const Newadress = filterdadress?.filter((el) => el.id !== id);
        if (Newadress) Setfilterdadress(Newadress);
      })
      .catch((err) => {
        console.error(t("addressinfo.delete_failed"), err);
      });
  };

  const EditeAction = (adress: any) => {
    dispatch(editeAdressAction(adress));
    navigate("/AdressPage");
  };

  return (
    <div className="ai-page">
      <div className="v2-rail-head ai-head">
        <h2 className="v2-rail-title">{t("addressinfo.title", "عناويني")}</h2>
        <button
          className="ai-add"
          onClick={() => navigate("/AdressPage", { state: { isNew: true } })}
        >
          <Plus size={16} />
          {t("add_new_address")}
        </button>
      </div>

      <div className="ai-grid">
        {filterdadress &&
          filterdadress.map((el) => (
            <div key={el.id} className="ai-card">
              <div className="ai-card-head">
                <span className="ai-type">
                  <MapPin size={13} />
                  {el.address_type}
                </span>
                <div className="ai-actions">
                  <button
                    className="ai-icon"
                    aria-label="edit"
                    onClick={() => EditeAction(el)}
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    className="ai-icon ai-icon-danger"
                    aria-label="delete"
                    onClick={() => {
                      setSelectedId(el.id);
                      setShowConfirm(true);
                    }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <div className="ai-rows">
                <div className="ai-row">
                  <span>{t("addressinfo.name")}</span>
                  <strong>{el.contact_person_name}</strong>
                </div>
                <div className="ai-row">
                  <span>{t("addressinfo.phone")}</span>
                  <strong>{el.contact_person_number}</strong>
                </div>
                <div className="ai-row">
                  <span>{t("addressinfo.address")}</span>
                  <strong>{el.address}</strong>
                </div>
                {el.delivery_area && (
                  <div className="ai-row">
                    <span>{t("addressinfo.delivery_area")}</span>
                    <strong>
                      {el.delivery_area.area_name} —{" "}
                      {el.delivery_area.delivery_charge} {t("currency", "EGP")}
                    </strong>
                  </div>
                )}
                {isAreaType && !el.delivery_area && (
                  <div className="ai-warning" onClick={() => EditeAction(el)}>
                    ⚠ {t("addressinfo.area_missing")}
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>

      <ConfirmPopup
        show={showConfirm}
        message={t("addressinfo.confirm_delete")}
        onConfirm={() => {
          if (selectedId) Deleteaction(selectedId);
        }}
        onClose={() => setShowConfirm(false)}
      />
    </div>
  );
};

export default AdressPageInfo;
