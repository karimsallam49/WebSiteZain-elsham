import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import axios from "axios";
import { X, Sparkles, Copy, Check, Coins } from "lucide-react";
import { useAppSelector } from "../../Hooks/hooks";
import {
  spinConfigUrl,
  spinDoUrl,
  spinBuyUrl,
} from "../../EndPoints/EndPoints";
import type {
  SpinConfigResponse,
  SpinResultResponse,
} from "../../DTO/SpinWinDTO";
import "./SpinWin.css";

const FALLBACK_COLORS = ["#c9a24b", "#16263a", "#8a6a2f", "#1e3a55", "#a3803d", "#0f1a2b"];

interface Props {
  onClose: () => void;
}

const SpinWin = ({ onClose }: Props) => {
  const { t, i18n } = useTranslation();
  const { OTPToken } = useAppSelector((state) => state.OTPauthconfigration);
  const { selectedBranch } = useAppSelector(
    (state) => state.restaurantSettingsSlice
  );
  const isAr = i18n.language === "ar";

  const [config, setConfig] = useState<SpinConfigResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<SpinResultResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [buying, setBuying] = useState(false);

  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${OTPToken}`,
      "Branch-id": selectedBranch ?? "",
      "x-localization": isAr ? "ar" : "en",
    }),
    [OTPToken, selectedBranch, isAr]
  );

  const loadConfig = useCallback(async () => {
    if (!OTPToken) return;
    try {
      setLoading(true);
      const res = await axios.get<SpinConfigResponse>(spinConfigUrl, { headers });
      setConfig(res.data);
    } catch {
      setError(t("spinWin.loadError"));
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [OTPToken, selectedBranch, isAr]);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  const segments = config?.segments ?? [];
  const segCount = segments.length;
  const segAngle = segCount > 0 ? 360 / segCount : 360;

  // نقطة على محيط الدائرة — الزاوية من فوق، مع عقارب الساعة
  const pointAt = (deg: number, r: number, cx: number, cy: number) => {
    const rad = (deg * Math.PI) / 180;
    return { x: cx + r * Math.sin(rad), y: cy - r * Math.cos(rad) };
  };

  const wedgePath = (i: number, r: number, cx: number, cy: number) => {
    const a1 = i * segAngle;
    const a2 = (i + 1) * segAngle;
    const p1 = pointAt(a1, r, cx, cy);
    const p2 = pointAt(a2, r, cx, cy);
    return `M ${cx} ${cy} L ${p1.x} ${p1.y} A ${r} ${r} 0 0 1 ${p2.x} ${p2.y} Z`;
  };

  const doSpin = async () => {
    if (spinning || !OTPToken || !config) return;
    setError(null);
    setResult(null);
    try {
      const res = await axios.post<SpinResultResponse>(
        spinDoUrl,
        { branch_id: selectedBranch },
        { headers }
      );
      const data = res.data;
      // حرّك العجلة على winning_index — ده النتيجة الحقيقية
      const target =
        360 * 6 - (data.winning_index * segAngle + segAngle / 2);
      setSpinning(true);
      setRotation(target);
      window.setTimeout(() => {
        setResult(data);
        setSpinning(false);
        setConfig((c) => (c ? { ...c, spins: data.spins, pending_prizes: data.pending_prizes } : c));
      }, 4600);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        setError(
          (e.response?.data?.errors?.[0]?.message as string) ||
            t("spinWin.spinError")
        );
      }
    }
  };

  const buySpin = async () => {
    if (buying) return;
    setBuying(true);
    setError(null);
    try {
      await axios.post(spinBuyUrl, {}, { headers });
      await loadConfig();
    } catch (e) {
      if (axios.isAxiosError(e)) {
        setError(
          (e.response?.data?.errors?.[0]?.message as string) ||
            t("spinWin.buyError")
        );
      }
    } finally {
      setBuying(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopied(code);
    window.setTimeout(() => setCopied(null), 2000);
  };

  const segLabel = (s: { label: string; label_ar?: string }) =>
    isAr && s.label_ar ? s.label_ar : s.label;

  const SIZE = 300;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const R = SIZE / 2 - 8;

  return createPortal(
    <div className="sw-overlay" onClick={onClose}>
      <div
        className="sw-modal"
        dir={isAr ? "rtl" : "ltr"}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="sw-close" onClick={onClose} aria-label="close">
          <X size={18} />
        </button>

        <h3 className="sw-title">
          <Sparkles size={18} color="var(--v2-gold)" />
          {t("spinWin.title")}
        </h3>

        {!OTPToken ? (
          <div className="sw-login">
            <p>{t("spinWin.loginToSpin")}</p>
            <Link to="/register-otp" className="sw-login-btn" onClick={onClose}>
              {t("login")}
            </Link>
          </div>
        ) : loading ? (
          <div className="sw-loading">{t("v2.loadingDishes")}</div>
        ) : !config || !config.is_active || segCount === 0 ? (
          <div className="sw-loading">{t("spinWin.unavailable")}</div>
        ) : (
          <>
            {/* العجلة */}
            <div className="sw-wheel-wrap" dir="ltr">
              <div className="sw-pointer" />
              <svg
                className={`sw-wheel${spinning ? " spinning" : ""}`}
                viewBox={`0 0 ${SIZE} ${SIZE}`}
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                {segments.map((seg, i) => (
                  <path
                    key={seg.id}
                    d={wedgePath(i, R, CX, CY)}
                    fill={seg.color || FALLBACK_COLORS[i % FALLBACK_COLORS.length]}
                    stroke="#0b1420"
                    strokeWidth="1"
                  />
                ))}
                {segments.map((seg, i) => {
                  const mid = i * segAngle + segAngle / 2;
                  const p = pointAt(mid, R * 0.62, CX, CY);
                  return (
                    <text
                      key={`t-${seg.id}`}
                      x={p.x}
                      y={p.y}
                      fill="#fff"
                      fontSize="10"
                      fontWeight="700"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${mid}, ${p.x}, ${p.y})`}
                    >
                      {segLabel(seg)}
                    </text>
                  );
                })}
              </svg>
              <div className="sw-hub" />
            </div>

            {/* عدد اللفات */}
            <div className="sw-spins">
              {t("spinWin.spinsLeft")}: <b>{config.spins.total}</b>
            </div>

            {/* النتيجة */}
            {result && (
              <div className={`sw-result${result.prize?.type ? " win" : ""}`}>
                {result.prize?.type ? (
                  <>
                    <span className="sw-result-label">
                      🎉 {result.prize.label}
                    </span>
                    {result.prize.type === "points" && (
                      <small>{t("spinWin.pointsAdded")}</small>
                    )}
                  </>
                ) : (
                  <span className="sw-result-label">{t("spinWin.noLuck")}</span>
                )}
              </div>
            )}

            {error && <div className="sw-error">{error}</div>}

            {/* أزرار اللف */}
            {config.spins.total > 0 ? (
              <button
                type="button"
                className="sw-spin-btn"
                onClick={doSpin}
                disabled={spinning}
              >
                {spinning ? t("spinWin.spinning") : t("spinWin.spin")}
              </button>
            ) : config.points_cost_per_spin > 0 ? (
              <button
                type="button"
                className="sw-spin-btn alt"
                onClick={buySpin}
                disabled={buying}
              >
                <Coins size={15} />
                {t("spinWin.buySpin", { cost: config.points_cost_per_spin })}
              </button>
            ) : (
              <div className="sw-loading">{t("spinWin.noSpins")}</div>
            )}

            {/* الجوايز المعلقة */}
            {config.pending_prizes.length > 0 && (
              <div className="sw-prizes">
                <h4>{t("spinWin.yourPrizes")}</h4>
                {config.pending_prizes.map((p) => (
                  <div key={p.id} className="sw-prize-row">
                    <span className="sw-prize-label">{p.label}</span>
                    {p.coupon_code && (
                      <button
                        type="button"
                        className="sw-copy"
                        onClick={() => copyCode(p.coupon_code!)}
                      >
                        {copied === p.coupon_code ? (
                          <Check size={13} />
                        ) : (
                          <Copy size={13} />
                        )}
                        {p.coupon_code}
                      </button>
                    )}
                    {p.expires_at && (
                      <small className="sw-prize-exp">
                        {t("spinWin.expiresAt")}: {p.expires_at}
                      </small>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>,
    document.body
  );
};

export default SpinWin;
