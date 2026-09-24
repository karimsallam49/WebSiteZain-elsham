import { useState } from "react";
import { ProductsCArd } from "../../Components/ProductsCards/ProductsCArd"
import type { ProductDTO } from "../../DTO/ProductsDTO";
import { ProductModal } from "../../Components/ProductsDetails/ProductModal";
import { useAppSelector } from "../../Hooks/hooks";
import { useTranslation } from "react-i18next";
import "./WishList.css";

const WishList = () => {
        const [showModal, setShowModal] = useState(false);
        const [selectedproduct, setSelectedproduct] = useState<ProductDTO >();
        const {wishlistData}=useAppSelector((state)=>state.wishlistSlice)
        const {t}=useTranslation()
  return (
    <div
          className="container py-3 wishlist-page"
          
          style={{ minHeight: "100vh", overflowY: "auto" }}
        >
          <h3>
            {t("wishlist")}
          </h3>
    <div className="row">

      {wishlistData?.products.map((product,index) => (
                <div 
           className={`col-6 col-sm-6 col-md-4 col-lg-2`}
 
                
                key={product.id} style={{ padding: "0 10px " }}>
                  <ProductsCArd    
                   key={index}
                   setProductInfo={setSelectedproduct}
                   setopen={setShowModal}  records={product} />
                </div>
              ))}
              </div>
    
        
    
          
          {showModal && selectedproduct && (
            <ProductModal
              show={showModal}
              handleClose={() => setShowModal(false)}
              product={selectedproduct}
            />
          )}
        </div>
  )
}

export default WishList
