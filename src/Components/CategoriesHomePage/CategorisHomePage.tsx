import React, { useState, useEffect, useCallback, memo } from "react";
import { GetCategoriesProductUrl, latestProductUrl } from "../../EndPoints/EndPoints";
import { GetDataComponent } from "../GetDataComponents/GetDataComponent";
import { ProductModal } from "../ProductsDetails/ProductModal";
import type { ProductDTO } from "../../DTO/ProductsDTO";
import type { Category } from "../../DTO/CategoriesDTO";
import { useAppSelector } from "../../Hooks/hooks";
import { throttle } from "lodash";

interface Props {
  category?: Category | null;
  isGrid?: boolean;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
}

const CategorisHomePage: React.FC<Props> = memo(({ category, isGrid, scrollRef }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductDTO | null>(null);
  const [currentOffset, setCurrentOffset] = useState(1);
  const [, setMergedData] = useState<any[]>([]);
    const [isProductLoading, setIsProductLoading] = useState(false);
  const [, setTotalSize] = useState<number>(1);
const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { currentLanguage } = useAppSelector((state) => state.LanguageSlice);

  useEffect(() => {
    setCurrentOffset(1);
    setMergedData([]);
  }, [category, currentLanguage]);

  const APIURL = useCallback(() => {
    return category
      ? `${GetCategoriesProductUrl}${category.id}?offset=${currentOffset}&limit=10&product_type=all`
      : `${latestProductUrl}?limit=10&offset=${currentOffset}&sort_by=default_type`;
  }, [category, currentOffset]);

useEffect(() => {
  const shouldUseRef =
    scrollRef?.current &&
    scrollRef.current.scrollHeight > scrollRef.current.clientHeight; 

  const target = shouldUseRef ? scrollRef.current! : window;

  const getScrollValues = () => {
    if (shouldUseRef && scrollRef?.current) {
      const el = scrollRef.current;
      return {
        scrollPos: el.scrollTop + el.clientHeight,
        pageBottom: el.scrollHeight - 120
      };
    }

    return {
      scrollPos: window.innerHeight + window.scrollY,
      pageBottom: document.documentElement.offsetHeight - 120
    };
  };

  const throttledScroll = throttle(() => {
    if (!isLoadingMore || isProductLoading) return;

    const { scrollPos, pageBottom } = getScrollValues();

    if (scrollPos >= pageBottom) {
      setCurrentOffset((prev) => prev + 1);
    }
  }, 350);

  target.addEventListener("scroll", throttledScroll);

  return () => {
    target.removeEventListener("scroll", throttledScroll);
  };
}, [scrollRef, isLoadingMore, isProductLoading]);


const handleDataLoaded = (newLen: boolean) => {
setIsLoadingMore(newLen)
}

  return (
    <div className="menu-products p-4">
      <section className="w-100" id={category ? `cat-${category.id}` : "all-products"}>
        <GetDataComponent
        categoryId={category?.id}
          currentLanguage={currentLanguage}
          APIURL={APIURL()}
          SelectedProduct={setSelectedProduct}
          setShowModal={setShowModal}
          isGrid={isGrid}
                  ProductsLoading={setIsProductLoading}
                          totalsize={setTotalSize}


          onDataLoaded={handleDataLoaded}
        />

        {showModal && selectedProduct && (
          <ProductModal
            show={showModal}
            handleClose={() => setShowModal(false)}
            product={selectedProduct}
          />
        )}
      </section>
    </div>
  );
});

CategorisHomePage.displayName = "CategorisHomePage";

export default CategorisHomePage;
