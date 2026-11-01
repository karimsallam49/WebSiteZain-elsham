import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ProductDTO } from "../../DTO/ProductsDTO";
import V2ProductCard from "./V2ProductCard";
import { ProductModal } from "../ProductsDetails/ProductModal";
import { useDragScroll } from "../../Hooks/useDragScroll";

interface Props {
  title: ReactNode;
  products: ProductDTO[];
  /** عنصر إضافي جنب العنوان (countdown / badge...) */
  extra?: ReactNode;
}

const V2ProductRail = ({ title, products, extra }: Props) => {
  const { i18n } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductDTO | null>(
    null
  );

  const railRef = useDragScroll<HTMLDivElement>();

  const isRtl = i18n.language === "ar";
  const scrollRail = (dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    const amt = el.clientWidth * 0.7;
    el.scrollBy({
      left: (isRtl ? -dir : dir) * amt,
      behavior: "smooth",
    });
  };

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
        <div className="v2-rail-arrows" dir="ltr">
          <button
            type="button"
            className="v2-rail-arrow"
            aria-label="previous"
            onClick={() => scrollRail(-1)}
          >
            <ChevronLeft size={15} strokeWidth={2.4} />
          </button>
          <button
            type="button"
            className="v2-rail-arrow"
            aria-label="next"
            onClick={() => scrollRail(1)}
          >
            <ChevronRight size={15} strokeWidth={2.4} />
          </button>
        </div>
      </div>

      <div className="v2-rail" ref={railRef}>
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
