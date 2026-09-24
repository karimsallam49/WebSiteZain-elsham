import { useParams, Link, useLocation } from "react-router-dom";
import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { ChevronRight } from "lucide-react";
import { cuisineProductsURl } from "../../EndPoints/EndPoints";
// import ProductSkeleton from "../../scelton/ProductScelton";
import type { ProductDTO } from "../../DTO/ProductsDTO";
import { ProductModal } from "../../Components/ProductsDetails/ProductModal";
import { GetDataComponent } from "../../Components/GetDataComponents/GetDataComponent";
import "./CategoryPage.css";
import imageplaceholder from "../../assets/BackGround.png";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../Hooks/hooks";
import { throttle } from "lodash";

const CuisineProductsPage = () => {
  const { t } = useTranslation();
  const [selectedProduct, setSelectedProduct] = useState<ProductDTO | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [offset, setOffset] = useState(1);
  const [, setMergedData] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const {currentLanguage}=useAppSelector((state)=>state.LanguageSlice)
    const [, setTotalSize] = useState<number>(0);
    const [, setIsProductLoading] = useState(false);
  const params = useParams();
    const location = useLocation();

    const { name, image } = location.state || {};

  
  const APIURL = useMemo(() => {
    const idToUse = params.id ;
    return idToUse
      ? `${cuisineProductsURl}/${idToUse}?offset=${offset}&limit=10&product_type=all`
      : "";
  }, [params.id, offset]);

 const handleDataLoaded = useCallback(
  (newData: any[], total_size: number) => {
 

    setMergedData((prev) => {
      if (prev.length > total_size) {
      const merged = [...prev, ...newData];
        setHasMore(false);
        setIsLoadingMore(false);
        
      return merged;
      }

      if (prev.length === 0) {
        return newData;
      }

      const merged = [...prev, ...newData];
      return merged;
    });

    setIsLoadingMore(false);
  },
  [] 
);


  useEffect(() => {
    
    const div = scrollRef.current;
    if (!div) return;

    const handleScroll = throttle(() => {
      if (div.scrollTop + div.clientHeight >= div.scrollHeight - 150 && hasMore && !isLoadingMore) {
        setOffset((prev) => prev + 1);
        setIsLoadingMore(true);
      }
    }, 200);

    div.addEventListener("scroll", handleScroll);
    return () => div.removeEventListener("scroll", handleScroll);
  }, [scrollRef.current,isLoadingMore]);

  

  return (
    <div
      className="container py-1 category-page-container"
      ref={scrollRef}
      style={{ maxHeight: "95vh", overflowY: "auto" }}
    >
   
      <div
        className="mb-3 d-flex flex-column justify-content-end align-items-start position-relative category-banner"
        style={{
          backgroundImage: `url(${image ?? imageplaceholder})`,
        }}
      >
        <Link
          to="/"
          className="position-absolute top-0 start-0 m-3 text-white bg-dark bg-opacity-50 rounded-circle d-flex align-items-center justify-content-center"
          style={{ width: "35px", height: "35px" }}
        >
          <ChevronRight size={20} style={{ transform: "rotate(180deg)" }} />
        </Link>

        <h5 className="text-center text-white w-100 mb-3">{name}</h5>
      </div>

  

      
 <GetDataComponent
        currentLanguage={currentLanguage}
        APIURL={APIURL}
        ProductsLoading={setIsProductLoading}
        totalsize={setTotalSize}
        SelectedProduct={setSelectedProduct}
        setShowModal={setShowModal}
        onDataLoaded={handleDataLoaded}
      />
      
      {showModal && selectedProduct && (
        <ProductModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          product={selectedProduct}
        />
      )}


      {isLoadingMore && hasMore && (
        <p className="text-center text-muted py-2">{t("Loading more...")}</p>
      )}

    
      {!hasMore && (
        <p className="text-center text-secondary py-3">
          {t("No more products to show")}
        </p>
      )}
    </div>
  );
};
export default CuisineProductsPage