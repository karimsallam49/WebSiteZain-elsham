import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFetch } from "../../Hooks/useFetch";
import { useAppSelector } from "../../Hooks/hooks";
import { happyHoursUrl, offersUrl } from "../../EndPoints/EndPoints";
import type { HappyHoursResponse, HappyHourSlot } from "../../DTO/HappyHourDTO";
import type { ProductListResponse } from "../../DTO/ProductsDTO";
import { serverClockOffset } from "../../utilities/termsApi";
import V2ProductRail from "./V2ProductRail";

/** "17:00" → timestamp النهاردة (بتوقيت الجهاز المحلي) */
const timeToday = (hhmm: string): number => {
  const [h, m] = hhmm.split(":").map(Number);
  const d = new Date();
  d.setHours(h || 0, m || 0, 0, 0);
  return d.getTime();
};

const pad = (n: number) => String(Math.max(0, n)).padStart(2, "0");

/**
 * "ساعة السعادة" — الـ slot الشغال دلوقتي (أو اللي جاي) + countdown
 * بساعة السيرفر. المنتجات من /products/offers بأسعارها النهائية.
 */
const V2HappyHour = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useAppSelector((state) => state.LanguageSlice);
  const { selectedBranch } = useAppSelector(
    (state) => state.restaurantSettingsSlice
  );
  const lang = currentLanguage === "ar" ? "ar" : "en";

  const { data: hh } = useFetch<HappyHoursResponse>(lang, happyHoursUrl);
  const { data: offers } = useFetch<ProductListResponse>(
    lang,
    `${offersUrl}?branch_id=${selectedBranch ?? ""}&serving_type=takeaway`,
    { enabled: !!selectedBranch }
  );

  // الفترة المعروضة: الشغالة دلوقتي، وإلا أقرب فترة جاية النهارده
  const slot: HappyHourSlot | null = useMemo(() => {
    const slots = hh?.slots ?? [];
    if (slots.length === 0) return null;
    const live = slots.find((s) => s.is_live);
    if (live) return live;
    const offset = serverClockOffset(hh?.server_time ?? "");
    const now = Date.now() + offset;
    const upcoming = slots
      .filter((s) => timeToday(s.start_time) > now)
      .sort((a, b) => timeToday(a.start_time) - timeToday(b.start_time));
    return upcoming[0] ?? null;
  }, [hh]);

  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (!slot || !hh?.server_time) return;
    const offset = serverClockOffset(hh.server_time);
    const target = timeToday(slot.is_live ? slot.end_time : slot.start_time);
    const tick = () =>
      setRemaining(Math.max(0, Math.floor((target - (Date.now() + offset)) / 1000)));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [slot, hh?.server_time]);

  const products = useMemo(() => {
    const all = offers?.products ?? [];
    if (!slot) return [];
    const inSlot = new Set(slot.product_ids);
    const filtered = all.filter(
      (p) =>
        p.status === 1 &&
        (p.offer_source === "happy_hour" || inSlot.has(p.id))
    );
    return filtered.length > 0 ? filtered : all.filter(
      (p) => p.status === 1 && p.offer_source === "happy_hour"
    );
  }, [offers, slot]);

  if (!slot || products.length === 0) return null;

  const hrs = Math.floor(remaining / 3600);
  const mins = Math.floor((remaining % 3600) / 60);
  const secs = remaining % 60;

  const discountLabel =
    slot.discount_type === "percent"
      ? t("v2.hhDiscountPercent", { value: slot.discount })
      : t("v2.hhDiscountAmount", { value: slot.discount });

  const countdown = (
    <div className="v2-hh-meta" dir="ltr">
      <span className="v2-hh-discount">{discountLabel}</span>
      <div className="v2-hh-timer">
        <span className="v2-hh-cell">
          <b>{pad(hrs)}</b>
          <i>{t("v2.hhHours")}</i>
        </span>
        <span className="v2-hh-sep">:</span>
        <span className="v2-hh-cell">
          <b>{pad(mins)}</b>
          <i>{t("v2.hhMinutes")}</i>
        </span>
        <span className="v2-hh-sep">:</span>
        <span className="v2-hh-cell">
          <b>{pad(secs)}</b>
          <i>{t("v2.hhSeconds")}</i>
        </span>
      </div>
    </div>
  );

  return (
    <V2ProductRail
      title={slot.title || t("v2.happyHour")}
      products={products}
      extra={countdown}
    />
  );
};

export default V2HappyHour;
