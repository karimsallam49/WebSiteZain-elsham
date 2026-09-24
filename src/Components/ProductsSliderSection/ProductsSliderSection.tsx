import React, { useState, useMemo, memo } from "react";
import Slider from "react-slick";
import { SectionName } from "../SectionName/SectionName";
import { ProductsCArd } from "../ProductsCards/ProductsCArd";
import { ProductModal } from "../ProductsDetails/ProductModal";
import type { ProductDTO, ProductListResponse } from "../../DTO/ProductsDTO";
import FeedbackToast from "../FeedbackToast/FeedbackToast";
import { useTranslation } from "react-i18next";
import "./style.css";

interface Props {
  title: string;
  data: ProductListResponse | undefined;
  settings: any;
}

const ProductsSliderSection: React.FC<Props> = memo(({ title, data, settings }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductDTO>();
  const [showToast, setShowToast] = useState(false);
  const { t } = useTranslation();
  
  
  const productsList = useMemo(() => data?.products || [], [data]);

  return (
    <div className="w-100">
      <SectionName title={title} />

      <div className="recommendations-section w-100 py-2" style={{ height: "350px" }}>
        <div
          className="position-relative h-100 w-100"
          style={{ maxHeight: "70%", margin: "1rem 0" }}
        >
          <Slider className="recommm-swiper w-100 h-100" {...settings}>
           {productsList
  .filter((product) => product && product.status === 1)
  .map((product, index) => (
    <div
      key={product.id || index}
      className="w-100 h-100"
      style={{ padding: "0 10px", maxWidth: "220px" }}
    >
      <ProductsCArd
        records={product}
        setProductInfo={setSelectedProduct}
        setopen={setShowModal}
        onAddToCartSuccess={() => setShowToast(true)}
      />
    </div>
  ))}

          </Slider>
        </div>
      </div>

      {showModal && selectedProduct && (
        <ProductModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          product={selectedProduct}
        />
      )}

      <FeedbackToast
        message={t("item_added_successfully")}
        show={showToast}
        onClose={() => setShowToast(false)}
        type="success"
      />
    </div>
  );
});

ProductsSliderSection.displayName = "ProductsSliderSection";

export default ProductsSliderSection;
