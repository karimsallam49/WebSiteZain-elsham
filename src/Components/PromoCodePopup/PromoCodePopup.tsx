import { useState } from "react";
import { Form, Modal } from "react-bootstrap";
// import { useFetch } from "../../Hooks/useFetch";
import { useAppDispatch, useAppSelector } from "../../Hooks/hooks";
import { PromoUrl } from "../../EndPoints/EndPoints";
import coponimage from "../../assets/svg/no_coupon_svg.svg"
import { actValidateCoupon } from "../../store/Coupon/actgetcoupon/actValidateCoupon";
import ButtonComponent from "../Button/ButtonComponent";
// import type { CouponDTO } from "../../DTO/promoDTO";
// import { createAppAsyncThunk } from "../../store/FetchData/FetchData";
const PromoCodePopup = ({
  showPromoModal,
  setShowPromoModal,
  onApplyPromo,
}: any) => {
  const [promoCode, setPromoCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch=useAppDispatch()
  const {CouponVerifyData}=useAppSelector((state)=>state.CouponSlice)
  // const {currentLanguage}=useAppSelector((state)=>state.LanguageSlice)
  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      setError("Please enter a promo code");
      return;
    }

    setError("");
    setLoading(true);

    try {
        const API=`${PromoUrl}code=${promoCode}`
     dispatch(actValidateCoupon(API)).unwrap().then(()=>{
      onApplyPromo(CouponVerifyData)
     });
    
      setShowPromoModal(false);
    } catch (err) {
      onApplyPromo({ success: false, message: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={showPromoModal} onHide={() => setShowPromoModal(false)} centered>
      <Modal.Header closeButton>
        
      </Modal.Header>

      <Modal.Body style={{ height:"55vh" }} >
        <Form.Group controlId="promoCode">
          <Form.Label>Enter Promo Code</Form.Label>
          <div className="d-flex align-items-center justify-content-between gap-4">

          <Form.Control
            type="text"
            placeholder="e.g. SAVE20"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            disabled={loading}
            />
          <ButtonComponent
  text="Apply"
  loading={loading}
  onClick={handleApplyPromo}
/>
          </div>
        </Form.Group>

        <div className="w-100 d-flex align-items-center justify-content-center h-100 p-5">
          <img src={coponimage} className="w-100 h-100 object-fit-contain" alt="" />
        </div>
        {error && <div className="text-danger mt-2 small">{error}</div>}
      </Modal.Body>

      
    </Modal>
  );
};

export default PromoCodePopup;
