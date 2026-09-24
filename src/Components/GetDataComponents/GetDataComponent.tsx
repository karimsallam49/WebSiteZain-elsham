import { memo, useMemo, useState, useEffect } from "react";
import type { ProductListResponse } from "../../DTO/ProductsDTO";
import { ProducList } from "../ProductsList/ProductsList";
import type { Props } from "../../DTO/GenralDTO";
import ProductScelton from "../../scelton/ProductScelton";
import { useFetch } from "../../Hooks/useFetch";
import { usePost } from "../../Hooks/UsePost";
import { useLocation } from "react-router";
import { ProductsCArd } from "../ProductsCards/ProductsCArd";

interface GetDataProps extends Props {
  isGrid?: boolean;
  ApiBody?: any;
  currentSubcategory?:any;
  categoryId?:any;
      ProductsLoading:(Loading:boolean)=>void,

  currentLanguage: "ar" | "en";
  onDataLoaded?: (datalenght: any, total: number) => void;
  totalsize?: (size: number) => void;
  setIsLoading?: (loading: boolean) => void;
}

export const GetDataComponent = memo(
  ({
    APIURL,
    SelectedProduct,
    setShowModal,
    currentLanguage,
    currentSubcategory,
    isGrid = true,
    ProductsLoading,
    ApiBody,
    setIsLoading,
    categoryId,
    totalsize,
    onDataLoaded
  }: GetDataProps) => {

    const location = useLocation();
    const isPost = Boolean(ApiBody);

    const {
      data: fetchData,
      isLoading: fetchLoading,
      error: fetchError,
    } = useFetch<ProductListResponse>(currentLanguage, APIURL, { enabled: !isPost });

    const {
      mutate,
      isPending: postLoading,
      error: postError,
    } = usePost<ProductListResponse, object>(currentLanguage, APIURL);

    const [mergedList, setMergedList] = useState<any[]>([]);

    useEffect(() => {
      setMergedList([]);
    }, [categoryId,currentSubcategory]);

    useEffect(() => {
        if (!isPost) return;

      if (isPost) {
        mutate(ApiBody, {
          onSuccess: (res) => {
            totalsize?.(res.total_size);
            setMergedList((prev) => [...prev, ...res.products]);
            onDataLoaded?.(res.products, res.total_size);
          },
        });
      }
    }, [isPost, APIURL, currentLanguage]);

    useEffect(() => {
      if (!isPost && fetchData&&!fetchLoading) {
        totalsize?.(fetchData.total_size);
setMergedList((prev) => {
  const updated = [...prev, ...fetchData.products];
  if (updated.length >= fetchData.total_size) {
    onDataLoaded?.(false, fetchData.total_size);  
  } else {
    onDataLoaded?.(true, fetchData.total_size);
  }

  return updated;
});
      }
      
    }, [fetchData,fetchLoading,APIURL]);


    const isLoading = isPost ? postLoading : fetchLoading;
    const error = isPost ? postError : fetchError;

    useEffect(() => {
      setIsLoading?.(isLoading);
      ProductsLoading(isLoading)
    }, [isLoading]);



    const allProducts = useMemo(() => mergedList, [mergedList]);


    if (isLoading && mergedList.length === 0)
      return (
        <div className="d-flex justify-content-center align-items-center w-100" style={{ height: "200px" ,marginTop:"4rem"}}>
          <ProductScelton />
        </div>
      );

    if (error) return <p>حدث خطأ أثناء تحميل القائمة.</p>;

    const isHome = location.pathname === "/";

    return (
      <>
        {isGrid ? (
          <div className="row g-4 p-1">
            {allProducts.map((product, index) => (
              <div
                key={index}
                className={`col-6 col-sm-6 col-md-4 col-lg-${isHome ? "3" : "2"}`}
              >
                <ProductsCArd
                  records={product}
                  setProductInfo={SelectedProduct}
                  setopen={setShowModal}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {allProducts.map((product, index) => (
              <ProducList
                key={index}
                records={product}
                setProductInfo={SelectedProduct}
                setopen={setShowModal}
              />
            ))}
          </div>
        )}

        {isLoading && (
          <div className="d-flex justify-content-center align-items-center mt-4 mb-5">
            <div className="spinner-border" role="status"
              style={{ width: "2.5rem", height: "2.5rem", color: "#722914" }}
            />
          </div>
        )}
      </>
    );
  }
);
