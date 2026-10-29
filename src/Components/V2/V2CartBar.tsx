import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useCart } from "../../Hooks/useCart";

const V2CartBar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items, count, summary } = useCart();

  const total = summary
    ? summary.payable_total
    : items.reduce((s, i) => s + i.lineTotal, 0);

  if (items.length === 0) return null;

  return (
    <div
      className="v2-cart-bar"
      onClick={() => navigate("/cart")}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && navigate("/cart")}
    >
      <span className="cb-title">
        <ShoppingBag size={17} />
        {t("v2.viewCart")}
        <span className="cb-count">{count}</span>
      </span>
      <span className="cb-total">
        {total.toFixed(2)} {t("currency")}
      </span>
    </div>
  );
};

export default V2CartBar;
