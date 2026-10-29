import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import SpinWin from "../SpinWin/SpinWin";
import { useAppSelector } from "../../Hooks/hooks";
import { spinConfigUrl } from "../../EndPoints/EndPoints";
import type { SpinConfigResponse } from "../../DTO/SpinWinDTO";

const WHEEL_COLORS = ["#c9a24b", "#16263a", "#e8c876", "#1e3a55"];

/** زرار عائم على يمين الشاشة — عجلة صغيرة بتلف بتفتح مودال Spin & Win */
const V2SpinFab = () => {
  const { t, i18n } = useTranslation();
  const { OTPToken } = useAppSelector((state) => state.OTPauthconfigration);
  const { selectedBranch } = useAppSelector(
    (state) => state.restaurantSettingsSlice
  );
  const [open, setOpen] = useState(false);
  // null = لسه مش معروف (guest أو لسه بيحمل) — الزرار بيظهر زي الأول
  const [isActive, setIsActive] = useState<boolean | null>(null);

  // للمستخدم المسجّل بنتأكد إن العجلة مفعّلة من الباك — deferred عشان منأثرش على التحميل
  useEffect(() => {
    if (!OTPToken) {
      setIsActive(null);
      return;
    }
    let alive = true;
    const check = () => {
      axios
        .get<SpinConfigResponse>(spinConfigUrl, {
          headers: {
            Authorization: `Bearer ${OTPToken}`,
            "Branch-id": selectedBranch ?? "",
            "x-localization": i18n.language === "ar" ? "ar" : "en",
          },
        })
        .then((res) => {
          if (alive) setIsActive(res.data?.is_active === true);
        })
        .catch(() => {
          // 401/فشل → نعتبرها مش مفعّلة ونخفي الزرار
          if (alive) setIsActive(false);
        });
    };
    const idle = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 1200));
    idle(check);
    return () => {
      alive = false;
    };
  }, [OTPToken, selectedBranch, i18n.language]);

  // الزرار ما يظهرش غير لما الباك يأكد إن العجلة مفعّلة (is_active)
  if (isActive !== true) return null;

  const SEGS = 8;
  const segAngle = 360 / SEGS;
  const SIZE = 54;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const R = SIZE / 2 - 2;

  const pointAt = (deg: number) => {
    const rad = (deg * Math.PI) / 180;
    return { x: CX + R * Math.sin(rad), y: CY - R * Math.cos(rad) };
  };

  return (
    <>
      <button
        type="button"
        className="v2-spin-fab"
        onClick={() => setOpen(true)}
        aria-label={t("spinWin.title")}
        title={t("spinWin.title")}
      >
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true">
          {Array.from({ length: SEGS }, (_, i) => {
            const p1 = pointAt(i * segAngle);
            const p2 = pointAt((i + 1) * segAngle);
            return (
              <path
                key={i}
                d={`M ${CX} ${CY} L ${p1.x} ${p1.y} A ${R} ${R} 0 0 1 ${p2.x} ${p2.y} Z`}
                fill={WHEEL_COLORS[i % WHEEL_COLORS.length]}
                stroke="#0b1420"
                strokeWidth="1"
              />
            );
          })}
          <circle cx={CX} cy={CY} r="7" fill="#0b1420" />
          <circle cx={CX} cy={CY} r="3.5" fill="#e8c876" />
        </svg>
        <span className="v2-spin-fab-needle" />
      </button>

      {open && <SpinWin onClose={() => setOpen(false)} />}
    </>
  );
};

export default V2SpinFab;
