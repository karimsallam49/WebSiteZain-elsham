import { useState, type ReactNode } from "react";
import type { ProductDTO } from "../../DTO/ProductsDTO";
import V2ProductCard from "./V2ProductCard";
import { ProductModal } from "../ProductsDetails/ProductModal";

interface Props {
  title: ReactNode;
  products: ProductDTO[];
  /** عنصر إضافي جنب العنوان (countdown / badge...) */
  extra?: ReactNode;
}

const V2ProductRail = ({ title, products, extra }: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductDTO | null>(
    null
  );

  const openProduct = (p: ProductDTO) => {
    setSelectedProduct(p);
    setShowModal(true);
  };

  if (products.length === 0) return null;

  return (
    <section className="v2-rail-section">
      <div className="v2-rail-head">
        <h2 className="v2-rail-title">{title}</h2>
        {extra}
      </div>

      <div className="v2-rail">
        {products.map((product) => (
          <V2ProductCard
            key={product.id}
            product={product}
            onOpen={openProduct}
          />
        ))}
      </div>

      {showModal && selectedProduct && (
        <ProductModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          product={selectedProduct}
        />
      )}
    </section>
  );
};

export default V2ProductRail;
