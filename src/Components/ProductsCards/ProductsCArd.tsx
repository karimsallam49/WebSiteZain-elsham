import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import type { ProductDTO } from "../../DTO/ProductsDTO";
import { ImageUrl } from "../../EndPoints/EndPoints";
import PlaceHolderImage from "../../assets/WhatsApp Image 2025-10-08 at 16.02.14.jpeg";
import "./ProductCardStyle.css";
import { Badge } from "react-bootstrap";
import { useAppSelector } from "../../Hooks/hooks";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/Cart/CartSlice";
import FeedbackToast from "../FeedbackToast/FeedbackToast"; 
import i18n from "../../i18n";

type ProductsCardProps = {
  records: ProductDTO;
  setProductInfo?: (product: ProductDTO) => void;
  setopen?: (open: boolean) => void;
   onAddToCartSuccess?: () => void; 
};

const ProductsCardComponent = ({ records, setProductInfo, setopen,onAddToCartSuccess }: ProductsCardProps) => {
  const { t } = useTranslation();
  const { currentLanguage } = useAppSelector((state) => state.LanguageSlice);
  const dispatch = useDispatch();

  const [showToast, setShowToast] = useState(false);

  const originalPrice = Number(records.price) || 0;
  const discountAmount =
    records.discount_type === "percent"
      ? (originalPrice * (Number(records.discount) || 0)) / 100
      : Number(records.discount) || 0;
  const discountedPrice = Math.max(originalPrice - discountAmount, 0);

  // const IsAvailable = useMemo(() => {
  //   if (!records.available_time_starts || !records.available_time_ends) return true;

  //   const now = new Date();
  //   const today = now.toISOString().split("T")[0];
  //   const productStartTime = new Date(`${today}T${records.available_time_starts}`);
  //   const productEndTime = new Date(`${today}T${records.available_time_ends}`);

  //   return now >= productStartTime && now <= productEndTime;
  // }, [records.available_time_starts, records.available_time_ends]);

  const handleClick = useCallback(() => {
    if (setProductInfo) setProductInfo(records);
    if (setopen) setopen(true);
  }, [records, setProductInfo, setopen]);

  const handleAddToCart = (products: ProductDTO) => {
    const quantity = 1;
    const productsWithDiscount = {
      ...products,
      price: discountedPrice,
      original_price: originalPrice,
    };
    dispatch(addToCart({ products: productsWithDiscount, quantity }));
    setShowToast(true); 
    if (onAddToCartSuccess) onAddToCartSuccess(); 
  };
  // const dispatch=useAppDispatch()
  // const [isFav,setIsFav]=useState(false)
    // const { wishlistData } = useAppSelector((state) => state.wishlistSlice);

  // const IsProductinWishList = wishlistData?.products.some(
  //   (el) => el.id === records.id
  // );
  // const handleToggleWishlist = (id: any) => {
  //   const body = { product_id: id };

  //   if (isFav) {
  //     dispatch(actRemoveFromWishList(body)).then(() => {
  //       dispatch(actWishList());
  //       setIsFav(false);
  //     });
  //   } else {
      
  //     dispatch(actAddTowishList(body)).then(() => {
  //       dispatch(actWishList());
  //       setIsFav(true);
  //     });
  //   }
  // };

  return (
    <>

    {
records && records.status === 1 &&(

  <div
  style={{ cursor: "pointer" }}
  className="w-100 h-100 product-cart-contain"
  onClick={handleClick}
      >
        <div
          className="card position-relative h-100 shadow-sm product-card"
          style={{
            borderRadius: "20px",
            overflow: "hidden",
            cursor: "pointer",
            zIndex: "100",
            minHeight: "230px",
          }}
          >
          <div style={{ position: "relative" }}>
            <img
            loading="lazy"
              src={records.image ? `${ImageUrl}/${records.image}` : PlaceHolderImage}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = PlaceHolderImage;
              }}
              alt={records.name}
              className="card-img-top w-100 object-fit-cover"
              style={{ height: "120px" }}
            />

        
          </div>

          <div
            style={{ maxHeight: "50%" }}
            className="card-bod w-100 h-100 p-1 d-flex flex-column justify-content-between"
          >
            <p
              className="card-titl m-0 fw-semibold w-100"
              style={{
                fontSize: "0.82rem",
                height: "45%",
                overflow: "hidden",
                    whiteSpace: "normal",
                textOverflow: "ellipsis",
                direction: currentLanguage === "ar" ? "rtl" : "ltr",
              }}
            >
              {records.name}
            </p>

            {records.product_type === "veg" && (
              <p className="card-title fw-normal w-100 text-start mt-1" style={{fontSize:"0.72rem"}}>
                {records.calories}{" "}
                <Badge bg="success" className="mx-1 p-1" style={{fontSize:"x-small"}}>
                  {t("calories")}
                </Badge>
              </p>
            )}

    <p
  className="card-text mb-0 text-danger"
  style={{  marginTop: "auto",  direction: currentLanguage === "ar" ? "rtl" : "ltr", }}
>
  <span className="price-place fw-semibold text-danger">
    {Number(records.price) > 0
      ? records.discount > 0
        ? (
          <>
            <del className="text-secondary">
              {originalPrice.toFixed(2)} {t("currency")}
            </del>
            <span>{discountedPrice.toFixed(2)} {t("currency")}</span>
          </>
        )
        : `${discountedPrice.toFixed(2)} ${t("currency")}`
      : i18n.language === "ar"
      ? "السعر حسب الاختيار"
      : "Price according to selection"}
  </span>
</p>

           {/* {IsAvailable && ( */}
             <div
             onClick={(e) => {
               e.stopPropagation(); 
      if (originalPrice === 0) {
        handleClick();
      } else {
        handleAddToCart(records);
      }
    }}
    className={`position-absolute card-bottom backgroundMainColor text-light mt-auto`}
    style={{
      right: currentLanguage === "en"  ? '0' : 'auto', 
      left: currentLanguage === "ar" ? '0' : 'auto', 
      borderRadius: currentLanguage === 'en' ? '10px 0 5px 0' : '0 10px 0 5px',
    }}
    >
    +
  </div>
{/* )} */}


            {records.product_type === "veg" && (
              <span className="position-absolute veg">{t("diet")}</span>
            )}
          </div>
        </div>
      </div>

      )
    }
    <FeedbackToast
        message={t("item_added_successfully")}
        show={showToast}
        onClose={() => setShowToast(false)}
        type="success"
        />
        
        </>
  );
};

export const ProductsCArd = React.memo(ProductsCardComponent);
