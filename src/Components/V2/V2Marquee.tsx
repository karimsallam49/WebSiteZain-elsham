import { useTranslation } from "react-i18next";

const V2Marquee = () => {
  const { t } = useTranslation();
  const phrase = `${t("v2.marquee")} • `;

  return (
    <div className="v2-marquee" aria-hidden="true">
      <div className="v2-marquee-track">
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i}>{phrase.repeat(4)}</span>
        ))}
      </div>
    </div>
  );
};

export default V2Marquee;
