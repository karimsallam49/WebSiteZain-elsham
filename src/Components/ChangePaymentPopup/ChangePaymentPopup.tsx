import React, { type FC, useState, useCallback, useMemo } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { useAppSelector } from "../../Hooks/hooks";
import { useTranslation } from "react-i18next";
import "../../App.css";

interface ChangePopupProps {
  onSelectPayment: (paymentType: string) => void;
  setBringChangeAmount: (paymentType: number) => void;
}

const ChangePaymentSection: FC<ChangePopupProps> = React.memo(
  ({ onSelectPayment, setBringChangeAmount }) => {
    const { resturantdata } = useAppSelector((state) => state.restaurantSettingsSlice);
    const { t } = useTranslation();

    const [selectedPayment, setSelectedPayment] = useState<string>("");
    const [showInput, setShowInput] = useState(false);

    const activePaymentMethods = useMemo(
      () => resturantdata?.active_payment_method_list ?? [],
      [resturantdata?.active_payment_method_list]
    );

    const isCashOnDelivery = resturantdata?.cash_on_delivery ?? false;

    const handleSelectPayment = useCallback(
      (method: string) => {
        setSelectedPayment(method);
        setShowInput(method === "cash_on_delivery" ? false : false);
        onSelectPayment(method);
      },
      [onSelectPayment]
    );

    return (
      <div className="p-3 shadow-sm rounded border">
        <div className="text-start mb-3">
          <h5 className="fw-semibold">{t("payment.choose_method")}</h5>
        </div>

        {/* 💵 Cash on Delivery */}
        {isCashOnDelivery && (
          <Card className="p-3 mb-3 d-flex flex-row justify-content-between align-items-center">
            <div>
              <h6 className="mb-0 fw-semibold">{t("payment.cash_on_delivery")}</h6>
              <small className="text-muted">
                {t("payment.cash_on_delivery_desc")}
              </small>
            </div>

            <Form.Check
              className="custom-radio-fav"
              type="radio"
              name="payment"
              checked={selectedPayment === "cash_on_delivery"}
              onChange={() => handleSelectPayment("cash_on_delivery")}
            />
          </Card>
        )}

        {/* 💰 إدخال مبلغ الفكة */}
        {selectedPayment === "cash_on_delivery" && (
          <div className="text-center mb-3">
            {!showInput ? (
              <Button
                className="border-0 backgroundMainColor"
                size="sm"
                onClick={() => setShowInput(true)}
              >
                {t("payment.show_more")}
              </Button>
            ) : (
              <Form.Control
                type="number"
                placeholder={t("payment.enter_change_amount")}
                className="mt-2"
                onChange={(e) => setBringChangeAmount(Number(e.target.value))}
              />
            )}
          </div>
        )}

        {/* 🌐 Online Payment */}
        {activePaymentMethods.length > 0 && (
          <Card className="p-3">
            <h6 className="fw-semibold mb-3">{t("payment.online_payment")}</h6>
            {activePaymentMethods.map((el) => (
              <div
                key={el.gateway}
                className="d-flex justify-content-between align-items-center border-bottom py-2"
              >
                <div className="d-flex align-items-center gap-2">
                  {el.gateway_image && (
                    <img
                      src={`${resturantdata?.base_urls.gateway_image_url}/${el.gateway_image}`}
                      alt={el.gateway_title}
                      width={30}
                      height={30}
                      style={{ objectFit: "contain" }}
                    />
                  )}
                  <span>{el.gateway_title}</span>
                </div>

                <Form.Check
                  className="custom-radio-fav"
                  type="radio"
                  name="payment"
                  checked={selectedPayment === el.gateway}
                  onChange={() => handleSelectPayment(el.gateway)}
                />
              </div>
            ))}
          </Card>
        )}
      </div>
    );
  }
);

export default ChangePaymentSection;
