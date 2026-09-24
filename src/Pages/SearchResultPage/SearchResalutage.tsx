import { useCallback, useEffect, useRef, useState } from "react";
import { GetDataComponent } from "../../Components/GetDataComponents/GetDataComponent";
import { ProductModal } from "../../Components/ProductsDetails/ProductModal";
import type { ProductDTO } from "../../DTO/ProductsDTO";
import { GetProductByNameAPI } from "../../EndPoints/EndPoints";
import { useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../Hooks/hooks";
import { throttle } from "lodash";
import "./SearchResalutage.css";

const SearchResalutage = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search).get("query") || "";
  const decodedQuery = decodeURIComponent(query);

  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductDTO | null>(null);
  const [, setMergedData] = useState<any[]>([]);
  const [offset, setOffset] = useState(1);
  const [, setTotalSize] = useState<number>(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
    const [, setIsProductLoading] = useState(false);
  
  const { t } = useTranslation();
  const { currentLanguage } = useAppSelector((state) => state.LanguageSlice);

  const API = `${GetProductByNameAPI}?limit=10&offset=${offset}`;
  const APIBody = { name: decodedQuery, is_halal: 0 };


const handleDataLoaded = useCallback(
  (newData: any[], total_size: number) => {
    console.log("TOTAL:", total_size);

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
    <div className="container p-0 d-flex flex-column search-page" style={{ height: "90vh",overflow:"hidden" }}>
      <h3 className="py-2">{t("Search-results")} "{decodedQuery}"</h3>


      <div ref={scrollRef} style={{ height:"80vh", overflowY: "auto", padding: "0 1rem" }}>
  <GetDataComponent
        currentLanguage={currentLanguage}
        APIURL={API}
        ProductsLoading={setIsProductLoading}
        totalsize={setTotalSize}
        ApiBody={APIBody}
        SelectedProduct={setSelectedProduct}
        setShowModal={setShowModal}
        onDataLoaded={handleDataLoaded}
      />

        
      </div>

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

export default SearchResalutage;
