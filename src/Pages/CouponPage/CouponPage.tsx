import { useAppSelector } from "../../Hooks/hooks";
import promoimage from "../../assets/svg/coupon_icon.svg";
import CopyPic from "../../assets/svg/copy_icon.svg";
import { Search, Tag } from "lucide-react";
import { useState } from "react";
import "./couponePagestyle.css";
import CouponDetailsPopup from "../../Components/CouponDEtailsPopup/CouponDetailsPopup";
import { useTranslation } from "react-i18next";

const CouponPage = () => {
  const { t } = useTranslation();
  const { CouponData } = useAppSelector((state) => state.CouponSlice);
  const [searchValue, setSearchValue] = useState("");
  const [selectedCoupon, setSelectedCoupon] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    return `${day} ${month}`;
  };

  const coupons = (CouponData?.available ?? []).filter((el) =>
    el.title.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="cp-page">
      <div className="v2-rail-head cp-head">
        <h2 className="v2-rail-title">{t("coupon.list_title")}</h2>
      </div>

      <div className="cp-search">
        <Search size={16} />
        <input
          type="text"
          placeholder={t("coupon.search_placeholder")}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>

      {coupons.length > 0 ? (
        <div className="cp-grid">
          {coupons.map((el) => (
            <button
              key={el.id}
              type="button"
              className="cp-card"
              onClick={() => {
                setSelectedCoupon(el);
                setShowModal(true);
              }}
            >
              <div className="cp-badge">
                <img src={promoimage} alt="" aria-hidden="true" />
                <span className="cp-disc">
                  {el.discount}
                  {el.discount_type === "percent" ? "%" : ""}
                </span>
              </div>
              <div className="cp-body">
                <strong className="cp-name">{el.title}</strong>
                <span className="cp-code">
                  <img src={CopyPic} alt="" aria-hidden="true" />
                  {el.code}
                </span>
                <span className="cp-meta">
                  {formatDate(el.start_date)} - {formatDate(el.expire_date)}
                </span>
                <span className="cp-meta">
                  {t("coupon.min_purchase")} {el.min_purchase}
                </span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="cp-empty">
          <Tag size={36} />
          <p>{t("coupon.no_coupons")}</p>
        </div>
      )}

      <CouponDetailsPopup
        show={showModal}
        onClose={() => setShowModal(false)}
        selectedCoupon={selectedCoupon}
      />
    </div>
  );
};

export default CouponPage;
