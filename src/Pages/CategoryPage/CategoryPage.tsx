import { useParams, Link } from "react-router-dom";
import { useState, useMemo, useEffect, useRef } from "react";
import { ChevronRight } from "lucide-react";
import { GetCategoriesProductUrl } from "../../EndPoints/EndPoints";
import ProductSkeleton from "../../scelton/ProductScelton";
import type { ProductDTO } from "../../DTO/ProductsDTO";
import { ProductModal } from "../../Components/ProductsDetails/ProductModal";
import { GetDataComponent } from "../../Components/GetDataComponents/GetDataComponent";
import "./CategoryPage.css";
import imageplaceholder from "../../assets/BackGround.png";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../Hooks/hooks";
import { throttle } from "lodash";

const CategoryPage = () => {
  const { t } = useTranslation();
  const [selectedProduct, setSelectedProduct] = useState<ProductDTO | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentSubcategory, setCurrentSubcategory] = useState<number | null>(null);
  const [offset, setOffset] = useState(1);
  const [, setMergedData] = useState<any>();
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const {currentLanguage}=useAppSelector((state)=>state.LanguageSlice)
  const params = useParams();
    const [isProductLoading, setIsProductLoading] = useState(false);
  const [, setTotalSize] = useState<number>(1);

  const categoryId = params.categoryId;
  const { categories, loading, error } = useAppSelector((state)=>state.CategoriesSlice);

  const data = useMemo(
    () => categories.filter((cat) => cat.id.toString() === categoryId),
    [categories, categoryId]
  );

const subcategories = useMemo(() => {
    const currentCategory = categories.find(
        (cat) => cat.id.toString() === categoryId?.toString()
    );

    if (currentCategory?.childes&&currentCategory?.childes?.length > 0) {
        return currentCategory.childes;
    } else {
       
        return categories.filter(
            (cat) => cat.parent_id?.toString() === categoryId?.toString()
        );
    }
}, [categories, categoryId]);

  const APIURL = useMemo(() => {
    const idToUse = currentSubcategory || categoryId;
    return idToUse
      ? `${GetCategoriesProductUrl}${idToUse}?offset=${offset}&limit=10&product_type=all`
      : "";
  }, [currentSubcategory, categoryId, offset]);

const handleDataLoaded = (newLen: boolean) => {
setIsLoadingMore(newLen)
}



  useEffect(() => {
    setOffset(1);
    setHasMore(true);
    setMergedData(0);
   
  }, [currentSubcategory, categoryId]);
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
      setOffset((prev) => prev + 1);
    }
  }, 350);

  target.addEventListener("scroll", throttledScroll);

  return () => {
    target.removeEventListener("scroll", throttledScroll);
  };
}, [scrollRef, isLoadingMore, isProductLoading]);


  if (loading)
    return (
      <div style={{ height: "100vh", width: "100%", overflow: "hidden" }}>
        <ProductSkeleton />
      </div>
    );

  if (error) return <p>حدث خطأ أثناء تحميل القائمة.</p>;

  return (
    <div
      className="container py-1 category-page-container"
      ref={scrollRef}
      style={{ maxHeight: "90vh", overflowY: "auto" }}
    >
     
      <div
        className="mb-3 d-flex flex-column justify-content-end align-items-start position-relative category-banner"
        style={{
          backgroundImage: `url(${data[0]?.banner_image_full_path ?? imageplaceholder})`,
        }}
      >
        <Link
          to="/"
          className="position-absolute top-0 start-0 m-3 text-white bg-dark bg-opacity-50 rounded-circle d-flex align-items-center justify-content-center"
          style={{ width: "35px", height: "35px" }}
        >
          <ChevronRight size={20} style={{ transform: "rotate(180deg)" }} />
        </Link>

        <h5 className="text-center text-white w-100 mb-3">{data[0]?.name}</h5>
      </div>

      {subcategories.length > 0 && (
        <div className="subcategory-tabs-wrapper mb-4">
          <button
            onClick={() => setCurrentSubcategory(null)}
            className={`subcategory-tab-btn ${
              currentSubcategory === null ? "active" : ""
            }`}
          >
            {t("All")}
          </button>

          {subcategories.map((sub) => (
            <button
              key={sub.id}
              onClick={() => setCurrentSubcategory(sub.id)}
              className={`subcategory-tab-btn ${
                currentSubcategory === sub.id ? "active" : ""
              }`}
            >
              {sub.name}
            </button>
          ))}
        </div>
      )}

      
       <GetDataComponent
        currentLanguage={currentLanguage}
        APIURL={APIURL}
        currentSubcategory={currentSubcategory}
        ProductsLoading={setIsProductLoading}
        categoryId={categoryId}
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


    
      {!hasMore && (
        <p className="text-center text-secondary py-3">
          {t("No more products to show")}
        </p>
      )}
    </div>
  );
};
export default CategoryPage