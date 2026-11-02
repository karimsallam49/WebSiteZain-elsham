import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../Hooks/hooks";
import {
  OffersAvailableUrl,
  OffersSelectUrl,
} from "../../EndPoints/EndPoints";
import { loadServerCart } from "../../store/Cart/serverCartSlice";
import type { OfferPickDTO } from "../../DTO/ServerCartDTO";

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
  /** موجودة في unavailable_offers — سبب عدم توفر العرض */
  reason?: string;
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
  const serverCart = useAppSelector((s) => s.serverCartSlice.data);

  const [offers, setOffers] = useState<Offer[]>([]);
  const [unavailable, setUnavailable] = useState<Offer[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchingRef = useRef(false);

  const headers = {
    Authorization: `Bearer ${OTPToken}`,
    "Branch-id": selectedBranch,
    "x-localization": currentLanguage ?? "en",
  };

  useEffect(() => {
    if (!OTPToken || fetchingRef.current) return;
    fetchingRef.current = true;
    axios
      .get(`${OffersAvailableUrl}?order_type=delivery`, { headers })
      .then((res) => {
        setOffers(Array.isArray(res.data?.offers) ? res.data.offers : []);
        setUnavailable(
          Array.isArray(res.data?.unavailable_offers)
            ? res.data.unavailable_offers
            : []
        );
        const pre: string[] = (res.data?.selected_offers ?? []).map(
          (o: any) =>
            o.key ?? `${o.type}${o.prize_id ? `:${o.prize_id}` : ""}`
        );
        // الـ applied_offers من GET /cart بيكمل اللي offers/available بيرجعه —
        // العرض المطبّق فعلًا لازم يبان محدد
        const applied: string[] = (serverCart?.applied_offers ?? []).map(
          (o: any) =>
            o.key ?? `${o.type}${o.prize_id ? `:${o.prize_id}` : ""}`
        );
        setSelected(new Set([...pre, ...applied]));
      })
      .catch(() => setOffers([]))
      .finally(() => {
        fetchingRef.current = false;
      });
    // بيعيد الـ fetch كل ما الكارت يتغير — العروض بتتحدّث مع الكمية/السعر
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [OTPToken, serverCart?.item_count, serverCart?.subtotal]);

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

  // اختيار مجموعة عروض من offer_choice.options — بتتبعت كما هي للـselect
  const pickOption = async (option: OfferPickDTO[]) => {
    if (saving) return;
    setSaving(true);
    setError(null);
    try {
      await axios.post(
        OffersSelectUrl,
        { selected: option },
        { headers }
      );
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

  const pickLabel = (pick: OfferPickDTO) => {
    const key = `${pick.type}${pick.prize_id != null ? `:${pick.prize_id}` : ""}`;
    const offer = offers.find((o) => o.key === key || o.type === pick.type);
    return `${TYPE_ICON[pick.type] ?? "🏷️"} ${offer?.label ?? offer?.code ?? pick.type}`;
  };

  const toggle = (offer: Offer) => {
    if (saving) return;
    const next = new Set(selected);
    if (next.has(offer.key)) next.delete(offer.key);
    else next.add(offer.key);
    setSelected(next);
    save(next);
  };

  if (!OTPToken || (offers.length === 0 && unavailable.length === 0))
    return null;

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
      {serverCart?.offer_choice?.required &&
        (serverCart.offer_choice.options ?? []).length > 0 && (
          <div className="d-flex flex-column gap-2 mb-2">
            <small className="text-muted">
              {t("cart.choose_offer") ||
                "العروض دي متعارضة — اختار اللي يناسبك"}
            </small>
            {serverCart.offer_choice.options.map((option, i) => (
              <button
                key={i}
                type="button"
                disabled={saving}
                onClick={() => pickOption(option)}
                className="d-flex align-items-center flex-wrap gap-2 w-100 text-start border rounded-3 px-2 py-2"
                style={{
                  cursor: "pointer",
                  borderColor: "var(--v2-gold, #C9A35B)",
                  background: "rgba(201,163,91,.08)",
                  transition: "all .2s ease",
                }}
              >
                {option.map((pick, j) => (
                  <span key={j} className="small fw-semibold">
                    {j > 0 && "+ "}
                    {pickLabel(pick)}
                  </span>
                ))}
              </button>
            ))}
          </div>
        )}
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
              className={`offer-row d-flex align-items-center gap-2 w-100 text-start rounded-3 px-2 py-2 ${
                isSel ? "offer-row-selected" : ""
              }`}
              style={{
                cursor: blocked ? "not-allowed" : "pointer",
                opacity: blocked ? 0.45 : 1,
              }}
            >
              <span className="offer-row-icon">{TYPE_ICON[o.type] ?? "🏷️"}</span>
              <span className="d-flex flex-column" style={{ minWidth: 0 }}>
                <span className="fw-semibold small">{o.label}</span>
                {o.detail && (
                  <small className="text-muted">{o.detail}</small>
                )}
              </span>
              <span className="ms-auto offer-radio" />
            </button>
          );
        })}
      </div>
      {unavailable.length > 0 && (
        <div className="d-flex flex-column gap-1 mt-2">
          {unavailable.map((o) => (
            <div
              key={o.key}
              className="offer-row-unavailable d-flex flex-column gap-1 w-100 rounded-3 px-2 py-2"
            >
              <span className="d-flex align-items-center gap-2">
                <span>{TYPE_ICON[o.type] ?? "🏷️"}</span>
                <span className="fw-semibold small">{o.label}</span>
                {o.detail && (
                  <small className="text-muted">{o.detail}</small>
                )}
              </span>
              {o.reason && (
                <small className="text-danger" style={{ fontSize: "0.68rem" }}>
                  {o.reason}
                </small>
              )}
            </div>
          ))}
        </div>
      )}
      {error && <small className="text-danger d-block mt-1">{error}</small>}
    </div>
  );
};

export default CartOffersPicker;
