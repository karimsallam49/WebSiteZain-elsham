import { useState } from "react";
import { Heart } from "lucide-react";
import type { ProductDTO } from "../../DTO/ProductsDTO";
import { ProductModal } from "../../Components/ProductsDetails/ProductModal";
import V2ProductRow from "../../Components/V2/V2ProductRow";
import { useAppSelector } from "../../Hooks/hooks";
import { useTranslation } from "react-i18next";
import "./WishList.css";

const WishList = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedproduct, setSelectedproduct] = useState<ProductDTO>();
  const { wishlistData } = useAppSelector((state) => state.wishlistSlice);
  const { t } = useTranslation();

  const products = (wishlistData?.products ?? []).filter(
    (p) => p.status === 1
  );

  return (
    <div className="wishlist-page">
      <div className="v2-rail-head">
        <h2 className="v2-rail-title">{t("wishlist")}</h2>
        {products.length > 0 && (
          <span className="wl-count">{products.length}</span>
        )}
      </div>

      {products.length ? (
        <div className="v2-menu-list">
          {products.map((product) => (
            <V2ProductRow
              key={product.id}
              product={product}
              onOpen={(p) => {
                setSelectedproduct(p);
                setShowModal(true);
              }}
            />
          ))}
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
