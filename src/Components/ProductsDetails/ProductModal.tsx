import { useState } from "react";
import { Modal, Image, Badge, Button } from "react-bootstrap";
import "./Productmodule.css";
import { ImageUrl } from "../../EndPoints/EndPoints";
import PlaceHolderImage from "../../assets/WhatsApp Image 2025-10-08 at 16.02.14.jpeg";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../Hooks/hooks";
import {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
} from "../../store/Cart/CartSlice";
import { FaPlus, FaMinus } from "react-icons/fa";
import { actAddTowishList } from "../../store/WishList/actAddTowishList";
import { actRemoveFromWishList } from "../../store/WishList/actRemoveFromWishList";
import { actWishList } from "../../store/WishList/actWishList";
import { Heart } from "lucide-react";
import NotAvailableIcon from "../../assets/svg/clock_svg.svg"; 
import AddonsList from "../AddonsList/AddonsList";
import FeedbackToast from "../FeedbackToast/FeedbackToast";

export const ProductModal = ({ show, handleClose, product }: any) => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const { CartData } = useAppSelector((state) => state.cartSlice);
  const { wishlistData } = useAppSelector((state) => state.wishlistSlice);
const [selectedVariations, setSelectedVariations] = useState<any[]>([]);
const [adoons, setaddons] = useState<any>();
const [toast, setToast] = useState<{
  show: boolean;
  message: string;
  type?: "success" | "error";
}>({ show: false, message: "", type: "error" });

  const IsProductinWishList = wishlistData?.products.some(
    (el) => el.id === product.id
  );

  const existingProduct = CartData.find((item) => item.id === product.id);
  const [quantity, setQuantity] = useState(existingProduct?.quantity || 1);
  const [isFav, setIsFav] = useState(IsProductinWishList);

  const now = new Date();
  const startTime = product.available_time_starts;
  const endTime = product.available_time_ends;
const formatTime = (timeStr?: string) => {
  
  if (!timeStr || !timeStr.includes(":")) return "";

  const [hours, minutes] = timeStr.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0);

  if (isNaN(date.getTime())) return "";

  return date.toLocaleTimeString(i18n.language === "ar" ? "ar-EG" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const availableFrom = formatTime(product?.available_time_starts);
const availableTo = formatTime(product?.available_time_ends);


  const [startHours, startMinutes] = startTime?.split(":") || [];
  const [endHours, endMinutes] = endTime?.split(":") || [];

  const start = new Date();
  start.setHours(+startHours || 0, +startMinutes || 0, 0);

  const end = new Date();
  end.setHours(+endHours || 23, +endMinutes || 59, 59);

  const isAvailable = now >= start && now <= end;

 const handleAddToCart = () => {
  if (Array.isArray(product.variations) && product.variations.length > 0) {
    const allSelected = product.variations.every((_variation: any, index:  number) => 
      selectedVariations[index] && selectedVariations[index].values && selectedVariations[index].values.label?.length > 0
    );

    if (!allSelected) {
      setToast({
        show: true,
        message: t("please_select_all_variations"), 
        type: "error",
      });
      return; 
    }
  }

  const products = {
    ...product,
    quantity,
    price: discountedPrice,
    original_price: originalPrice,
    selected_addons:adoons&&adoons.selected_addons?adoons.selected_addons:[],
    add_on_ids:adoons?.add_on_ids??[],
    add_on_qtys:adoons?.add_on_qtys??[],
    variations: selectedVariations,
  };

  dispatch(addToCart({ products, quantity }));
  handleClose();
};
  const handleIncrease = () => {
    setQuantity((q) => q + 1);
    if (existingProduct) dispatch(increaseQuantity(product.id));
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
      if (existingProduct) dispatch(decreaseQuantity(product.id));
    }
  };

  const handleToggleWishlist = (id: any) => {
    const body = { product_id: id };

    if (isFav) {
      dispatch(actRemoveFromWishList(body)).then(() => {
        dispatch(actWishList());
        setIsFav(false);
      });
    } else {
      dispatch(actAddTowishList(body)).then(() => {
        dispatch(actWishList());
        setIsFav(true);
      });
    }
  };

  const CurrentPhoto = product.product_type === "veg";
const addonsTotal = adoons?.selected_addons?.reduce(
  (sum: number, addon: any) =>
    sum + (Number(addon.price) || 0) * (Number(addon.qty) || 1),
  0
) || 0;

const variationsTotal = selectedVariations.reduce(
  (sum, v) => sum + (Number(v.optionPrice) || 0),
  0
);

const originalPrice = Number(product.price) || 0;
const discountAmount =
  product.discount_type === "percent"
    ? (originalPrice * (Number(product.discount) || 0)) / 100
    : Number(product.discount) || 0;
const discountedPrice = Math.max(originalPrice - discountAmount, 0);

const totalPrice = (discountedPrice + variationsTotal + addonsTotal) * (Number(quantity) || 1);
  return (
    <Modal
      show={show}
      onHide={handleClose}
      className="w-100 "
      dialogClassName="bottom-sheet-modal w-100 modal-dialog-product"
      backdropClassName="custom-backdrop w-100"
      contentClassName="bottom-sheet-content"
    >
      <Modal.Body
        className="align-items-center h-100 justify-content-center"
        style={{ paddingBottom: "2rem", padding: "1rem", direction: i18n.language === "ar" ? "rtl" : "ltr" }}
      >
        
        <div className="w-100 modal-pic-container position-relative d-flex align-items-center justify-content-center mb-3">
          <Image
            className="ModalImage"
            style={{
              maxHeight: 250,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "10px",
            }}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = PlaceHolderImage;
            }}
            src={product.image ? `${ImageUrl}/${product.image}` : PlaceHolderImage}
            alt={product.name}
            fluid
          />

          
          <div
            className="position-absolute top-0 end-0 m-3 p-2 rounded-circle bg-light shadow-sm "
            style={{ cursor: "pointer",zIndex:"100" }}
            onClick={() => handleToggleWishlist(product.id)}
          >
            <Heart
              size={24}
              fill={isFav ? "red" : "none"}
              color={isFav ? "red" : "gray"}
              strokeWidth={1.6}
            />
          </div>

          
          {!isAvailable && (
            <div
              className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.55)",
                color: "white",
                borderRadius: "10px",
                backdropFilter: "blur(3px)",
                zIndex: 10,
              }}
            >
              <img
                src={NotAvailableIcon}
                alt="not available"
                style={{ width: "60px", opacity: 0.9 }}
              />
              <span
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  marginTop: "10px",
                  color: "rgba(255,255,255,0.9)",
                  textTransform: "capitalize",
                }}
              >
                {t("not_available")}
              </span>
            </div>
          )}
        </div>

        
        <div
          style={{
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            height: "14%",
          }}
          className="w-100 rounded-4 d-flex flex-column align-items-start justify-content-center p-3"
        >
          <h6 className="fw-bold text-start">{product.name}</h6>
        <p className="text-muted text-start mb-0">
            <span style={{ display: "inline-block", fontSize: "small" }}>
              {Number(product.price) > 0 ? (
                product.discount > 0 ? (
                  <>
                    <del className="me-2 text-secondary">
                      {originalPrice.toFixed(2)} {t("currency")}
                    </del>
                    <span className="fw-bold">
                      {discountedPrice.toFixed(2)} {t("currency")}
                    </span>
                  </>
                ) : (
                  `${discountedPrice.toFixed(2)} ${t("currency")}`
                )
              ) : i18n.language === "ar" ? (
                "السعر حسب الاختيار"
              ) : (
                "Price according to selection"
              )}
            </span>
          </p>
        </div>

        <div className="product-info-body" style={{ height:!isAvailable?"21%":"36%" }}>
          <div className=" rounded-4 p-3 mb-3">
            <div className="d-flex align-items-start justify-content-between w-100">
              <span className="text-dark d-flex justify-content-start mb-2">
                {t("details")}
              </span>
              <div className="d-flex justify-content-between align-items-center">
                {CurrentPhoto && (
                  <span
                  className="position-absolute veg-modal"
                  style={{
                    [i18n.dir() === "rtl" ? "left" : "right"]: "7%",
                  }}
                >
                  {t("diet")}
                </span>
                )}
              </div>
            </div>
            <p className="mt-2 text-muted">{product.description}</p>
            {CurrentPhoto && (
              <>
                {product.calories}{" "}
                <Badge bg="success" className="mx-1">
                  {t("calories")}
                </Badge>
              </>
            )}
          </div>

   
    {Array.isArray(product.variations) && product.variations.length > 0 && (
  <div className="p-3  rounded-4 w-100 mb-4 variations-section">

   {product.variations.map((variation: any, vIndex: number) => (
  <div key={vIndex} className="mb-3">
    <p className="fw-semibold mb-2">
      {i18n.language === "ar" ? variation.ar_name : variation.name}
    </p>

    <div className="d-flex flex-wrap gap-2">
      {variation.values.map((value: any, valIndex: number) => {
        const isSelected =
          selectedVariations[vIndex]?.values?.label?.[0] === value.label;

        return (
          <div
            key={valIndex}
            className={`${isSelected ? "backgroundMainColor text-light " : ""}variation-box p-2 border rounded text-center d-flex align-items-center justify-content-center gap-2 flex-column`}
            style={{
              flex: "0 0 calc(50% - 0.5rem)", 
              cursor: "pointer",
              
              transition: "all 0.3s ease",
            }}
            onClick={() => {
              const updated = [...selectedVariations];
              updated[vIndex] = {
                name: variation.name,
                label: variation.name,
                ar_label: variation.ar_name,
                values: { label: [value.label] },
                optionPrice: value.optionPrice,
              };
              setSelectedVariations(updated);
            }}
          >
            {/* {value.imageFullPath && (
              <img
                src={value.imageFullPath}
                alt={value.label}
                className="variation-option-img mb-1"
                style={{ width: "100%", objectFit: "cover", borderRadius: 4 }}
              />
            )} */}
            <div className="d-flex align-items-center justify-content-center gap-1 ">
              <div>

              {i18n.language === "ar" ? value.ar_label : value.label}
            </div>
             {Number(value.optionPrice) > 0 && (
              <div
                className={`fw-semibod ${isSelected ? "text-light" : "text-muted"}`}
                style={{margin:"0 .3rem"}}
              >
                {value.optionPrice} {t("currency")}
              </div>
            )}
            </div>
          </div>
        );
      })}
    </div>
        </div>
      ))}

        </div>
      )}
        <AddonsList product={product} onChange={setaddons} />


        </div>
  
        
          
        
       <div className="d-flex justify-content-between flex-column mt-2  align-items-center w-100 mb-1">
                <div
            className=" d-flex align-items-center w-100 justify-content-between TextMainColor "
            style={{
              fontSize: "medium",
              padding:"0 1rem"
            }}
          >
            <span className="TextMainColor">
              {t("total")}
              </span> 
              <span className="TextMainColor">

                {totalPrice} {t("currency")}
                </span>  
          </div>
        <div className="d-flex w-100 ">

          <div className="d-flex align-items-center gap-3">
            <Button
              variant="light"
              size="sm"
              className="rounded-circle border"
              onClick={handleDecrease}
            >
              <FaMinus />
            </Button>
            <span className="fw-bold fs-5">{quantity}</span>
            <Button
              variant="light"
              size="sm"
              className="rounded-circle border"
              onClick={handleIncrease}
            >
              <FaPlus />
            </Button>
          </div>

        <div className="w-100">
            {!isAvailable && (
          <p
          className=" text-center TextMainColor "
            style={{
              fontSize: "medium",
              backgroundColor: "#e7f1ff",
            
            }}
          >
            {t("productNotAvailable")}{" "}
            <br />
            {t("availableFromTo", {
              from: availableFrom,
              to: availableTo,
            })}
          </p>
        )}


    
          <Button
            className="fw-semibold w-100 px-4 py-2 rounded-4 text-white"
            style={{
              backgroundColor: 
              "var(--MainColor)",
              border: "none",
              margin: "0 10px",
              cursor: "pointer",
            }}
            onClick={ handleAddToCart }
            >
            {
              existingProduct
              ? t("updateCart")
              : t("addToCart")
            }
          </Button>
            </div>
              </div>
        </div>
      </Modal.Body>
      <FeedbackToast
          message={toast.message}
          show={toast.show}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
    </Modal>
  );
};
