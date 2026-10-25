import { useState } from "react";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Check, Sparkles } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../Hooks/hooks";
import { setDesignVersion, type DesignVersion } from "../../store/Theme/ThemeSlice";

const DesignPickerModal = () => {
  const { hasChosenDesign } = useAppSelector((state) => state.themeSlice);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [selected, setSelected] = useState<DesignVersion>("v2");

  const confirm = () => dispatch(setDesignVersion(selected));

  return (
    <Modal
      show={!hasChosenDesign}
      centered
      backdrop="static"
      keyboard={false}
      dialogClassName="design-picker-modal"
      onHide={() => {}}
    >
      <Modal.Body className="p-4">
        <div className="text-center mb-4">
          <div className="picker-eyebrow">ZAIN EL SHAM</div>
          <h3 className="picker-title">{t("designPicker.title")}</h3>
          <p className="picker-sub mb-0">{t("designPicker.subtitle")}</p>
        </div>

        <div className="d-flex flex-column flex-sm-row gap-3">
          <button
            type="button"
            className={`design-picker-card flex-fill ${
              selected === "v2" ? "selected" : ""
            }`}
            onClick={() => setSelected("v2")}
          >
            <div className="design-picker-preview preview-v2">
              <span className="pv2-line" />
              <span className="pv2-bar" />
              <span className="pv2-card" />
              <span className="pv2-card" />
            </div>
            <div className="p-3 text-start">
              <div className="d-flex align-items-center justify-content-between">
                <span className="picker-name">
                  {t("designPicker.newDesign")}
                </span>
                {selected === "v2" ? (
                  <Check size={16} className="picker-check" />
                ) : (
                  <Sparkles size={14} className="picker-hint-icon" />
                )}
              </div>
              <small className="picker-desc">
                {t("designPicker.newDesignDesc")}
              </small>
            </div>
          </button>

          <button
            type="button"
            className={`design-picker-card flex-fill ${
              selected === "v1" ? "selected" : ""
            }`}
            onClick={() => setSelected("v1")}
          >
            <div className="design-picker-preview preview-v1">
              <span className="pv1-line" />
              <span className="pv1-bar" />
              <span className="pv1-card" />
              <span className="pv1-card" />
            </div>
            <div className="p-3 text-start">
              <div className="d-flex align-items-center justify-content-between">
                <span className="picker-name">
                  {t("designPicker.classicDesign")}
                </span>
                {selected === "v1" && (
                  <Check size={16} className="picker-check" />
                )}
              </div>
              <small className="picker-desc">
                {t("designPicker.classicDesignDesc")}
              </small>
            </div>
          </button>
        </div>

        <button
          type="button"
          className="picker-confirm w-100 mt-4"
          onClick={confirm}
        >
          {t("designPicker.confirm")}
        </button>
      </Modal.Body>
    </Modal>
  );
};

export default DesignPickerModal;
