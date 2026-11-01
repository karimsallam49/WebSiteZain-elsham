import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../Hooks/hooks";
import {
  OffersAvailableUrl,
  OffersSelectUrl,
} from "../../EndPoints/EndPoints";
import { loadServerCart } from "../../store/Cart/serverCartSlice";

interface Offer {
  key: string;
  type: string;
  prize_id?: number;
  coupon_id?: number;
  code?: string;
  label: string;
  detail?: string;
  combinable_with?: string[];
  conflicts_with?: string[];
  expires_at?: string;
}

const TYPE_ICON: Record<string, string> = {
  spin_win: "🎡",
  coupon: "🏷️",
  referral: "👥",
  first_order: "🎁",
};

/**
 * اختيار العروض للكارت — GET /customer/offers/available + POST /customer/offers/select
 * الـ conflicts_with بتتقفل لما تختار عرض متعارض معاه.
 */
const CartOffersPicker = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { OTPToken } = useAppSelector((s) => s.OTPauthconfigration);
  const { selectedBranch } = useAppSelector((s) => s.restaurantSettingsSlice);
  const { currentLanguage } = useAppSelector((s) => s.LanguageSlice);
  const { CouponVerifyData } = useAppSelector((s) => s.CouponSlice);

  const [offers, setOffers] = useState<Offer[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const headers = {
    Authorization: `Bearer ${OTPToken}`,
    "Branch-id": selectedBranch,
    "x-localization": currentLanguage ?? "en",
  };

  useEffect(() => {
    if (!OTPToken) return;
    axios
      .get(`${OffersAvailableUrl}?order_type=delivery`, { headers })
      .then((res) => {
        setOffers(Array.isArray(res.data?.offers) ? res.data.offers : []);
        const pre: string[] = (res.data?.selected_offers ?? []).map(
          (o: any) =>
            o.key ?? `${o.type}${o.prize_id ? `:${o.prize_id}` : ""}`
        );
        setSelected(new Set(pre));
      })
      .catch(() => setOffers([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [OTPToken]);

  // المفاتيح المقفولة بسبب عرض مختار بيتعارض معاها
  const blockedKeys = new Set<string>();
  selected.forEach((k) => {
    offers
      .find((o) => o.key === k)
      ?.conflicts_with?.forEach((c) => blockedKeys.add(c));
  });

  const save = async (set: Set<string>) => {
    setSaving(true);
    setError(null);
    const payload = [...set].map((k) => {
      const offer = offers.find((o) => o.key === k);
      const type = offer?.type ?? k.split(":")[0];
      // spin_win → prize_id، coupon → coupon_id — السيرفر محتاج المعرّف يقارن القواعد
      if (type === "spin_win" && offer?.prize_id != null)
        return { type, prize_id: offer.prize_id };
      if (type === "coupon" && offer?.coupon_id != null)
        return { type, coupon_id: offer.coupon_id };
      return { type };
    });
    try {
      await axios.post(OffersSelectUrl, { selected: payload }, { headers });
      dispatch(
        loadServerCart({
          order_type: "delivery",
          coupon_code: CouponVerifyData?.code || undefined,
        })
      );
    } catch (e: any) {
      setError(
        e?.response?.data?.errors?.[0]?.message ||
          t("something_wrong") ||
          "Error"
      );
    } finally {
      setSaving(false);
    }
  };

  const toggle = (offer: Offer) => {
    if (saving) return;
    const next = new Set(selected);
    if (next.has(offer.key)) next.delete(offer.key);
    else next.add(offer.key);
    setSelected(next);
    save(next);
  };

  if (!OTPToken || offers.length === 0) return null;

  return (
    <div className="w-100 mb-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <span className="fw-semibold">
          {t("cart.available_offers") || "العروض المتاحة"}
        </span>
        {saving && (
          <small className="text-muted">{t("loading") || "..."}</small>
        )}
      </div>
      <div className="d-flex flex-column gap-2">
        {offers.map((o) => {
          const isSel = selected.has(o.key);
          const blocked = !isSel && blockedKeys.has(o.key);
          return (
            <button
              key={o.key}
              type="button"
              disabled={blocked}
              onClick={() => toggle(o)}
              className="d-flex align-items-center gap-2 w-100 text-start border rounded-3 px-2 py-2"
              style={{
                cursor: blocked ? "not-allowed" : "pointer",
                opacity: blocked ? 0.45 : 1,
                borderColor: isSel
                  ? "var(--v2-gold, #C9A35B)"
                  : "rgba(0,0,0,.08)",
                background: isSel
                  ? "rgba(201,163,91,.14)"
                  : "transparent",
                transition: "all .2s ease",
              }}
            >
              <span>{TYPE_ICON[o.type] ?? "🏷️"}</span>
              <span className="d-flex flex-column" style={{ minWidth: 0 }}>
                <span className="fw-semibold small">{o.label}</span>
                {o.detail && (
                  <small className="text-muted">{o.detail}</small>
                )}
              </span>
              <span
                className="ms-auto"
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  border: `2px solid ${
                    isSel ? "var(--v2-gold, #C9A35B)" : "rgba(0,0,0,.25)"
                  }`,
                  background: isSel ? "var(--v2-gold, #C9A35B)" : "transparent",
                  flexShrink: 0,
                }}
              />
            </button>
          );
        })}
      </div>
      {error && <small className="text-danger d-block mt-1">{error}</small>}
    </div>
  );
};

export default CartOffersPicker;
