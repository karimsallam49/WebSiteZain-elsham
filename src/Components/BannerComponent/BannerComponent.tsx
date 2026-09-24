import { useMemo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Slider from "react-slick";
import BannerSkeleton from "../../scelton/BannerSkeleton";

import type { BannerDTO } from "../../DTO/BannerDTO";
import { ProductModal } from "../ProductsDetails/ProductModal";
import "./BannerStyle.css";
import type { ProductDTO } from "../../DTO/ProductsDTO";
import { useAppSelector } from "../../Hooks/hooks";

const BannerComponent = ({ BannerType }: { BannerType: "ads" | "promot" | string }) => {
  const {BannerData,BannerLoading,error}=useAppSelector((state)=>state.bannerSlice)
  const [selectedProduct, setSelectedProduct] = useState<ProductDTO | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [dataInMobile, setDataInMobile] = useState<BannerDTO[]>([]);

  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const direction = i18n.language === "ar";
  const currentData = useMemo(
    () => BannerData?.filter((banner) => banner.banner_type === BannerType) ?? [],
    [BannerData, BannerType]
  );

  useEffect(() => {
    const updateData = () => {
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
  }, [currentData]);

  const handleBannerSelected = (banner: BannerDTO) => {
    if (banner.category_id) {
      navigate(`/category/${banner.category_id}/${banner.title}`);
    } else {
      setSelectedProduct(banner.product);
      setShowModal(true);
    }
  };

  if (BannerLoading) return <BannerSkeleton />;
  if (error) return <p>{t("error_fetching_data")}</p>;
  if (currentData.length === 0) return null;

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    slidesToShow: BannerType === "ads" ? 2 : 1,
    slidesToScroll: 1,
    rtl: direction,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: BannerType === "ads" ? 2 : 1,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: BannerType === "ads" ? 2 : 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: BannerType === "ads" ? 2 : 1,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: BannerType === "ads" ? 2 : 1,
        },
      },
    ],
  };

  return (

        <div
          className={`banner-wrapper-fixed ${
            BannerType === "ads" ? "ads-wrapper" : "genral-warrper"
          }`}
        >
          <Slider {...settings} className="banner-slider-fixed">
            {dataInMobile.map((banner) => (
              <div key={banner.id} className="banner-slide-fixed p-1 h-100" style={{ gap: "12px" }}>
                <img
                loading="lazy"
                  onClick={() => handleBannerSelected(banner)}
                  className="banner-image-fixed"
                  src={direction ? banner.image_ar_url ?? banner.image_url : banner.image_url}
                  alt={banner.title}
                />
              </div>
            ))}
          </Slider>

          {showModal && selectedProduct && (
            <ProductModal
              show={showModal}
              handleClose={() => setShowModal(false)}
              product={selectedProduct}
            />
          )}
        </div>
    
    
  );
};

export default BannerComponent;
