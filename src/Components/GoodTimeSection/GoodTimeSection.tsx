"use client";

import { memo, useMemo } from "react";
import { useFetch } from "../../Hooks/useFetch";
import { GoodTimeProductUrL } from "../../EndPoints/EndPoints";
import type { ProductListResponse } from "../../DTO/ProductsDTO";
import "./GoodTimeSection.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../Hooks/hooks";
import ProductsSliderSection from "../ProductsSliderSection/ProductsSliderSection";

const GoodTimeSection = memo(() => {
  const { currentLanguage } = useAppSelector((state) => state.LanguageSlice);
  const { t } = useTranslation();
  const { data, isLoading, error } = useFetch<ProductListResponse>(
    currentLanguage,
    GoodTimeProductUrL
  );

  const totalProducts = data?.products?.length || 0;

  const settings = useMemo(
    () => ({
      dots: false,
      infinite: totalProducts > 1,
      speed: 800,
      slidesToShow: totalProducts > 4 ? 5 : totalProducts+1|| 1,
      slidesToScroll: 1,
      centerMode: totalProducts > 3,
      autoplay: totalProducts > 1,
      autoplaySpeed: 3000,
      responsive: [
        { breakpoint: 1024, settings: { slidesToShow: Math.min(4, totalProducts || 1) } },
        { breakpoint: 992, settings: { slidesToShow: Math.min(3, totalProducts || 1) } },
        { breakpoint: 768, settings: { slidesToShow: Math.min(3, totalProducts || 1) } },
       { 
        breakpoint: 576, 
        settings: { slidesToShow: Math.min(5, totalProducts-1) } 
      },
      ],
    }),
    [totalProducts]
  );

  return (
    <>
      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : error ? (
        <p className="text-danger text-center">
         
        </p>
      ) : !data || data.products.length === 0 ? (
        <p className="text-center text-muted">لا توجد توصيات حالياً</p>
      ) : (
        <ProductsSliderSection
          title={t("Good_Time")}
          data={data}
          settings={settings}
        />
      )}
    </>
  );
});

GoodTimeSection.displayName = "GoodTimeSection";
export default GoodTimeSection;
