import React, { type FC, useState, useCallback, useMemo } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { useAppSelector } from "../../Hooks/hooks";
import { useTranslation } from "react-i18next";
import "../../App.css";

interface ChangePopupProps {
  onSelectPayment: (paymentType: string) => void;
  setBringChangeAmount: (paymentType: number) => void;
  onPartialChange?: (isPartial: boolean) => void;
  totalAmount?: number;
}

const ChangePaymentSection: FC<ChangePopupProps> = React.memo(
  ({ onSelectPayment, setBringChangeAmount, onPartialChange, totalAmount = 0 }) => {
    const { resturantdata } = useAppSelector((state) => state.restaurantSettingsSlice);
    const { UserData } = useAppSelector((state) => state.UserInfoSLice);
    const { t } = useTranslation();

    const [selectedPayment, setSelectedPayment] = useState<string>("");
    const [showInput, setShowInput] = useState(false);
    const [isPartial, setIsPartial] = useState(false);

    const activePaymentMethods = useMemo(
      () => resturantdata?.active_payment_method_list ?? [],
      [resturantdata?.active_payment_method_list]
    );

    const isCashOnDelivery = resturantdata?.cash_on_delivery ?? false;

    const paymentMethods = (resturantdata as any)?.payment_methods;
    const walletEnabled = paymentMethods
      ? !!paymentMethods.wallet_payment
      : resturantdata?.wallet_status === 1;
    const partialCfg = paymentMethods?.partial_payment;
    const partialEnabled = paymentMethods
      ? !!partialCfg?.enabled
      : resturantdata?.partial_payment === 1;
    const combineWith =
      partialCfg?.combine_with ?? resturantdata?.partial_payment_combine_with ?? "all";

    const walletBalance = Number(UserData?.wallet_balance) || 0;
    const showWallet = walletEnabled && walletBalance > 0;
    const walletCoversAll = walletBalance >= totalAmount && totalAmount > 0;
    const canPartial =
      showWallet &&
      partialEnabled &&
      !walletCoversAll &&
      (combineWith === "all" ||
        (selectedPayment &&
          selectedPayment !== "wallet_payment" &&
          combineWith === selectedPayment));

    const handleSelectPayment = useCallback(
      (method: string) => {
        setSelectedPayment(method);
        if (method === "wallet_payment") {
          setIsPartial(false);
          onPartialChange?.(false);
        }
        onSelectPayment(method);
      },
      [onSelectPayment, onPartialChange]
    );

    const handlePartialToggle = (checked: boolean) => {
      setIsPartial(checked);
      onPartialChange?.(checked);
    };

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

        {/* 👛 المحفظة */}
        {showWallet && (
          <Card className="p-3 mb-3">
            <div className="d-flex flex-row justify-content-between align-items-center">
              <div>
                <h6 className="mb-0 fw-semibold">
                  {t("payment.wallet") || "المحفظة"}
                </h6>
                <small className="text-muted">
                  {t("payment.wallet_balance") || "رصيدك"}:{" "}
                  {walletBalance.toFixed(2)} {t("currency") || "EGP"}
                  {!walletCoversAll &&
                    ` — ${t("payment.wallet_partial_hint") || "أقل من إجمالي الطلب (دفع جزئي)"}`}
                </small>
              </div>

              <Form.Check
                className="custom-radio-fav"
                type="radio"
                name="payment"
                disabled={!walletCoversAll}
                checked={selectedPayment === "wallet_payment"}
                onChange={() => handleSelectPayment("wallet_payment")}
              />
            </div>

            {canPartial &&
              selectedPayment &&
              selectedPayment !== "wallet_payment" && (
                <div className="mt-2 pt-2 border-top">
                  <Form.Check
                    type="checkbox"
                    className="custom-radio-fav"
                    checked={isPartial}
                    onChange={(e) => handlePartialToggle(e.target.checked)}
                    label={
                      t("payment.use_wallet_partial") ||
                      `ادفع ${walletBalance.toFixed(2)} من محفظتك والباقي بالطريقة المختارة`
                    }
                  />
                </div>
              )}
          </Card>
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
