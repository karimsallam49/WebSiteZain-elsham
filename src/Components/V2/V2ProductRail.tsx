import { useRef, useState, type ReactNode } from "react";
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
  const railEl = useRef<HTMLDivElement | null>(null);

  const isRtl = i18n.language === "ar";
  const scrollRail = (dir: 1 | -1) => {
    const el = railEl.current;
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
        <div className="v2-rail-head-start">
          <h2 className="v2-rail-title">{title}</h2>
          {extra}
        </div>
        <div className="v2-rail-arrows" dir="ltr">
          {/* في الـ RTL اتجاه "القدّام" شمال — فالسهم الشمال بيبقى next */}
          <button
            type="button"
            className="v2-rail-arrow"
            aria-label={isRtl ? "next" : "previous"}
            onClick={() => scrollRail(isRtl ? 1 : -1)}
          >
            <ChevronLeft size={15} strokeWidth={2.4} />
          </button>
          <button
            type="button"
            className="v2-rail-arrow"
            aria-label={isRtl ? "previous" : "next"}
            onClick={() => scrollRail(isRtl ? -1 : 1)}
          >
            <ChevronRight size={15} strokeWidth={2.4} />
          </button>
        </div>
      </div>

      <div
        className="v2-rail"
        ref={(node) => {
          railEl.current = node;
          railRef(node);
        }}
      >
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
