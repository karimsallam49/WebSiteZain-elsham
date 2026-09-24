import { useEffect, useState } from "react";
import type { BannerDTO } from "../../DTO/BannerDTO"
import i18n from "../../i18n";
import type { ProductDTO } from "../../DTO/ProductsDTO";
import { useNavigate } from "react-router";
import { ProductModal } from "../ProductsDetails/ProductModal";
import { IoClose } from "react-icons/io5";

import "./PromotComponent.css"
import { createPortal } from "react-dom";
import { useAppSelector } from "../../Hooks/hooks";

const PromotComponent = () => {

  const [showPromo, setShowPromo] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<ProductDTO | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { BannerData, BannerLoading } = useAppSelector((state) => state.bannerSlice);
  const [dataInMobile, setDataInMobile] = useState<BannerDTO[]>([]);

  // NEW: حالة تحميل الصورة
  const [imageLoaded, setImageLoaded] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const updateData = () => {
      const currentData = BannerData?.filter((banner) => banner.banner_type === "promot") ?? [];
      const isMobile = window.innerWidth < 968;

      setDataInMobile(
        currentData.filter((b) =>
          isMobile ? b.dimension_type === "mobile" : b.dimension_type === "desktop"
        )
      );
    };

    updateData();
    window.addEventListener("resize", updateData);

    return () => window.removeEventListener("resize", updateData);
  }, [BannerData]);


  if (BannerLoading) return <p>Loading</p>;

  const banner = dataInMobile[0];

  return (
    <>
      {showPromo && banner && imageLoaded &&
        createPortal(
          <div
            className="promo-overlay"
            role="dialog"
            aria-modal="true"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowPromo(false);
            }}
          >
            <div className="promo-card position-relative">
              <div className="promo-close" onClick={() => setShowPromo(false)}>
                <IoClose size={28} />
              </div>

              <img
                className="promo-image"
                src={i18n.language === "ar" ? banner.image_ar_url ?? banner.image_url : banner.image_url}
                alt={banner.title}
                onLoad={() => setImageLoaded(true)}            // هنا
                onClick={() => {
                  if (banner.category_id) {
                    navigate(`/category/${banner.category_id}/${banner.title}`);
                  } else if (banner.product) {
                    setSelectedProduct(banner.product);
                    setShowModal(true);
                    setShowPromo(false);
                  }
                }}
              />
            </div>

            {showModal && selectedProduct && (
              <ProductModal show={showModal} handleClose={() => setShowModal(false)} product={selectedProduct} />
            )}
          </div>,
          document.body
        )}
      
      {/* Hidden image preloading */}
      {!imageLoaded && banner && (
        <img
          src={i18n.language === "ar" ? banner.image_ar_url ?? banner.image_url : banner.image_url}
          style={{ display: "none" }}
          onLoad={() => setImageLoaded(true)}
        />
      )}
    </>
  );
};

export default PromotComponent;
