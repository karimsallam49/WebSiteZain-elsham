import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useAppSelector } from "../../Hooks/hooks";

const V2CartBar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { CartData } = useAppSelector((state) => state.cartSlice);

  const { count, total } = useMemo(() => {
    return CartData.reduce(
      (acc, item) => ({
        count: acc.count + item.quantity,
        total: acc.total + item.quantity * (Number(item.price) || 0),
      }),
      { count: 0, total: 0 }
    );
  }, [CartData]);

  if (CartData.length === 0) return null;

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
