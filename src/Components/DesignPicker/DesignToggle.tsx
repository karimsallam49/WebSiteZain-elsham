import { useTranslation } from "react-i18next";
import { Sparkles, RotateCcw } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../Hooks/hooks";
import { setDesignVersion } from "../../store/Theme/ThemeSlice";

const DesignToggle = () => {
  const { designVersion, hasChosenDesign } = useAppSelector(
    (state) => state.themeSlice
  );
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  if (!hasChosenDesign) return null;

  const isV2 = designVersion === "v2";

  return (
    <button
      type="button"
      className="design-fab"
      onClick={() => dispatch(setDesignVersion(isV2 ? "v1" : "v2"))}
      title={
        isV2 ? t("designPicker.switchToClassic") : t("designPicker.switchToNew")
      }
    >
      {isV2 ? <Sparkles size={14} /> : <RotateCcw size={14} />}
      <span>
        {isV2 ? t("designPicker.newDesign") : t("designPicker.classicDesign")}
      </span>
    </button>
  );
};

export default DesignToggle;
