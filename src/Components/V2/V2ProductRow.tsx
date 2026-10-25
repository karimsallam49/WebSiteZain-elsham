import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import type { ProductDTO } from "../../DTO/ProductsDTO";
import { ImageUrl } from "../../EndPoints/EndPoints";
import PlaceHolderImage from "../../assets/WhatsApp Image 2025-10-08 at 16.02.14.jpeg";
import { useAppSelector } from "../../Hooks/hooks";
import {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
} from "../../store/Cart/CartSlice";
import FeedbackToast from "../FeedbackToast/FeedbackToast";

interface Props {
  product: ProductDTO;
  onOpen: (product: ProductDTO) => void;
}

const V2ProductRow = ({ product, onOpen }: Props) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { CartData } = useAppSelector((state) => state.cartSlice);
  const [showToast, setShowToast] = useState(false);

  const cartItem = CartData.find((el) => el.id === product.id);

  const originalPrice = Number(product.price) || 0;
  const discountAmount =
    product.discount_type === "percent"
      ? (originalPrice * (Number(product.discount) || 0)) / 100
      : Number(product.discount) || 0;
  const discountedPrice = Math.max(originalPrice - discountAmount, 0);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (originalPrice === 0) {
      onOpen(product);
      return;
    }
    dispatch(
      addToCart({
        products: {
          ...product,
          price: discountedPrice,
          original_price: originalPrice,
        },
        quantity: 1,
      })
    );
    setShowToast(true);
  };

  if (product.status !== 1) return null;

  return (
    <>
      <div
        className="v2-product-row"
        onClick={() => onOpen(product)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onOpen(product)}
      >
        <div className="v2-product-thumb">
          <img
            loading="lazy"
            src={product.image ? `${ImageUrl}/${product.image}` : PlaceHolderImage}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = PlaceHolderImage;
            }}
            alt={product.name}
          />
        </div>

        <div className="v2-product-body">
          <span className="v2-product-name">
            {product.name}
            {product.discount > 0 && (
              <span className="v2-product-badge">{t("v2.offer")}</span>
            )}
            {product.product_type === "veg" && (
              <span className="v2-product-badge">{t("diet")}</span>
            )}
          </span>
          {product.description && (
            <p className="v2-product-desc">{product.description}</p>
          )}
          <div className="v2-product-price">
            {originalPrice > 0 ? (
              <>
                {product.discount > 0 && (
                  <del>
                    {originalPrice.toFixed(2)} {t("currency")}
                  </del>
                )}
                <span>
                  {discountedPrice.toFixed(2)} {t("currency")}
                </span>
              </>
            ) : (
              <span>
                {i18n.language === "ar"
                  ? "السعر حسب الاختيار"
                  : "Price on selection"}
              </span>
            )}
          </div>
        </div>

        <div className="v2-product-side">
          {cartItem ? (
            <span
              className="v2-qty"
              onClick={(e) => e.stopPropagation()}
              role="group"
            >
              <button
                type="button"
                aria-label="decrease"
                onClick={() => dispatch(decreaseQuantity(product.id))}
              >
                −
              </button>
              <span className="qty-num">{cartItem.quantity}</span>
              <button
                type="button"
                aria-label="increase"
                onClick={() => dispatch(increaseQuantity(product.id))}
              >
                +
              </button>
            </span>
          ) : (
            <button
              type="button"
              className="v2-add-btn"
              onClick={handleAdd}
              aria-label={t("addToCart") || "add"}
            >
              +
            </button>
          )}
        </div>
      </div>

      <FeedbackToast
        message={t("item_added_successfully")}
        show={showToast}
        onClose={() => setShowToast(false)}
        type="success"
      />
    </>
  );
};

export default V2ProductRow;
