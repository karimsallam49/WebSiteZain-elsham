import { Card } from "react-bootstrap";
import { useAppSelector } from "../../Hooks/hooks";
import promoimage from "../../assets/svg/coupon_icon.svg";
import CopyPic from "../../assets/svg/copy_icon.svg";
import { Search } from "lucide-react";
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    return `${day} ${month}`;
  };

  const handleOpenModal = (coupon: any) => {
    setSelectedCoupon(coupon);
    setShowModal(true);
  };

  return (
    <div className="container coupon-page">
      <Card className="w-100 p-4 promocard">
<div className="d-flex justify-content-between mb-4 w-100 flex-column flex-md-row">
          <div className="headtitle w-100">
            <h4 className="">{t("coupon.list_title")}</h4>
          </div>

          <div className="search position-relative w-100 copun-input-container d-flex align-items-center">
            <Search
              size={20}
              className="text-muted position-absolute ms-2"
              style={{ left: "10px" }}
            />
            <input
              type="text"
              className="form-control ps-5 py-2 rounded-2 shadow-sm"
              placeholder={t("coupon.search_placeholder")}
              value={searchValue}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="coupone-body w-100">
          {CouponData && CouponData.available.length > 0 ? (
            CouponData.available
              .filter((el) =>
                el.title.toLowerCase().includes(searchValue.toLowerCase())
              )
              .map((el) => (
                <div
                  key={el.id}
                  className="promo-container cursor-pointer"
                  onClick={() => handleOpenModal(el)}
                >
                  <div className="promo-body">
                    <div className="promoimage d-flex flex-column align-items-center justify-content-center">
                      <img
                        className="object-fit-contain"
                        width={30}
                        height={30}
                        src={promoimage}
                        alt=""
                      />
                      <div className="promotitle w-100 text-center h-100 fw-bold">
                        {el.discount}
                        {el.discount_type === "percent" ? "%" : ""}
                      </div>
                      <div className="promoname">{el.title}</div>
                    </div>

                    <div className="promodescrbition w-100 d-flex flex-column align-items-center justify-content-center">
                      <div className="promo-code">
                        <img src={CopyPic} width={10} height={10} alt="" />
                        {el.code}
                      </div>
                      <div className="promo-date text-muted">
                        {formatDate(el.start_date)} - {formatDate(el.expire_date)}
                      </div>
                      <div className="promo-info text-muted">
                        {t("coupon.min_purchase")} {el.min_purchase}
                      </div>
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <div>
              <p>{t("coupon.no_coupons")}</p>
            </div>
          )}
        </div>
      </Card>

      <CouponDetailsPopup
        show={showModal}
        onClose={() => setShowModal(false)}
        selectedCoupon={selectedCoupon}
      />
    </div>
  );
};

export default CouponPage;
