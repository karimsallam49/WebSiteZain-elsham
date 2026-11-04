import { useState } from "react";
import { Heart, Plus } from "lucide-react";
import type { ProductDTO } from "../../DTO/ProductsDTO";
import { ProductModal } from "../../Components/ProductsDetails/ProductModal";
import { useAppSelector } from "../../Hooks/hooks";
import { useTranslation } from "react-i18next";
import { useCart } from "../../Hooks/useCart";
import { ImageUrl } from "../../EndPoints/EndPoints";
import placeholderimg from "../../assets/image/placeholder_image .png";
import "./WishList.css";

const WishList = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedproduct, setSelectedproduct] = useState<ProductDTO>();
  const { wishlistData } = useAppSelector((state) => state.wishlistSlice);
  const { add } = useCart();
  const { t } = useTranslation();

  const openProduct = (p: ProductDTO) => {
    setSelectedproduct(p);
    setShowModal(true);
  };

  const priceOf = (p: ProductDTO) => {
    const original = Number(p.price) || 0;
    // الباك بيرجع final_price جاهزة — بنستخدمها لو موجودة، وإلا نحسب الخصم محليًا
    const final =
      p.final_price != null
        ? Number(p.final_price)
        : Math.max(
            original -
              (p.discount_type === "percent"
                ? (original * (Number(p.discount) || 0)) / 100
                : Number(p.discount) || 0),
            0
          );
    return { original, final };
  };

  return (
    <div className="container py-3 wishlist-page" style={{ minHeight: "100vh", overflowY: "auto" }}>
      <h3 className="wishlist-title">{t("wishlist")}</h3>

      {wishlistData?.products?.length ? (
        <div className="wl-grid">
          {wishlistData.products.map((product) => {
            const { original, final } = priceOf(product);
            return (
              <div
                key={product.id}
                className="wl-card"
                onClick={() => openProduct(product)}
              >
                <div className="wl-img-wrap">
                  <img
                    loading="lazy"
                    src={product.image ? `${ImageUrl}/${product.image}` : placeholderimg}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = placeholderimg;
                    }}
                    alt={product.name}
                  />
                  {product.discount > 0 && (
                    <span className="wl-disc">
                      {product.discount_type === "percent"
                        ? `-${product.discount}%`
                        : `-${product.discount}`}
                    </span>
                  )}
                </div>

                <div className="wl-body">
                  <p className="wl-name">{product.name}</p>
                  <div className="wl-foot">
                    <span className="wl-price">
                      {original > 0 ? (
                        <>
                          {final.toFixed(2)} {t("currency")}
                          {final < original && (
                            <del>{original.toFixed(2)}</del>
                          )}
                        </>
                      ) : (
                        t("price_on_select", "Price on selection")
                      )}
                    </span>
                    <button
                      type="button"
                      className="wl-add"
                      aria-label="add"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (original === 0) openProduct(product);
                        else
                          add(
                            { ...product, price: final, original_price: original },
                            1
                          );
                      }}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="wishlist-empty">
          <Heart size={40} />
          <p>{t("empty", "No data found")}</p>
        </div>
      )}

      {showModal && selectedproduct && (
        <ProductModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          product={selectedproduct}
        />
      )}
    </div>
  );
};

export default WishList;
