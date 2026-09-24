import { useTranslation } from "react-i18next";
import type { ProductListResponse } from "../../DTO/ProductsDTO";
import { frequentlyUrl } from "../../EndPoints/EndPoints";
import { useAppSelector } from "../../Hooks/hooks";
import { useFetch } from "../../Hooks/useFetch";

import ProductsSliderSection from "../ProductsSliderSection/ProductsSliderSection";

const FrequentComponent = () => {
    const {currentLanguage}=useAppSelector((state)=>state.LanguageSlice)
      const { t } = useTranslation();
      const { data} = useFetch<ProductListResponse>(
        currentLanguage,
        frequentlyUrl
      );
    const totalProducts = data?.products?.length || 0;

  
const settings = {
  dots: false,
  infinite: totalProducts > 1, 
  speed: 800,
  slidesToShow:1,
  slidesToScroll: 1,
  centerMode: true,
  autoplay: totalProducts > 1,
  autoplaySpeed: 3000,

  // nextArrow: <NextArrow />,
  // prevArrow: <PrevArrow />,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: Math.min(4, totalProducts || 1),
      },
    },
    {
      breakpoint: 992,
      settings: {
        slidesToShow: Math.min(3, totalProducts || 1),
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 576,
      settings: {
        slidesToShow:  1,
      },
    },
  ],
};
  return (
   <ProductsSliderSection
  title={t("Recommendation")}
  data={data}
  settings={settings}
/>
  )
}

export default FrequentComponent
