import { useAppDispatch, useAppSelector } from "../../Hooks/hooks";
import DeleteIcone from "../../assets/image/icons8-delete-30.png";
import EdtieLocation from "../../assets/image/icons8-edit-location-24.png";
import "./adressinfostyle.css";
import { actDeleteadress } from "../../store/Adress/actDeleteAdress";
import { useState } from "react";
import ConfirmPopup from "../../Components/confirmPopup/ConfirmPopup";
import { editeAdressAction } from "../../store/Adress/AdressSlice";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { Button } from "react-bootstrap";
import { Plus } from "lucide-react";

const AdressPageInfo = () => {
  const { t } = useTranslation();
  const { AdressData } = useAppSelector((state) => state.adressSlice);
  const [filterdadress, Setfilterdadress] = useState(AdressData);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<any | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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
    <div className="w-100 d-flex container adress-info-page align-items-center justify-content-center">
      <div className="adress-info-container d-flex flex-column align-items-center justify-content-center w-100">
        <Button
          className="backgroundMainColor border-0 mb-4 align-self-end d-flex align-items-center gap-2"
          onClick={() => navigate("/AdressPage")}
        >
          <Plus size={18} />
          {t("add_new_address")}
        </Button>
        <div className="row g-1 justify-content-center column-gap-4 align-content-center w-100">
          {filterdadress &&
            filterdadress.map((el) => (
              <div
                key={el.id}
                className="adress-info-cart mb-5 col-12 col-md-5 m-3 col-sm-12 p-3"
              >
                <div className="info-header mb-5 d-flex justify-content-between align-items-center w-100">
                  <div className="type">{el.address_type}</div>
                  <div className="actions d-flex g-2">
                    <div onClick={() => EditeAction(el)} className="action-adress">
                      <img width={18} src={EdtieLocation} alt="" />
                    </div>
                    <div
                      className="action-adress"
                      onClick={() => {
                        setSelectedId(el.id);
                        setShowConfirm(true);
                      }}
                    >
                      <img width={20} src={DeleteIcone} alt="" />
                    </div>
                  </div>
                </div>
                <div className="details-adress w-100">
                  <div className="details-row w-100 d-flex gap-5">
                    <div className="name-details">{t("addressinfo.name")}</div>
                    <div className="details-title">{el.contact_person_name}</div>
                  </div>
                  <div className="details-row w-100 d-flex gap-5">
                    <div className="name-details">{t("addressinfo.phone")}</div>
                    <div className="details-title">{el.contact_person_number}</div>
                  </div>
                  <div className="details-row w-100 d-flex gap-5">
                    <div className="name-details">{t("addressinfo.address")}</div>
                    <div className="details-title">{el.address}</div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Popup التأكيد */}
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
