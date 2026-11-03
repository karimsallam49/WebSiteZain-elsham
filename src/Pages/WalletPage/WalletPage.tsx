import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { ArrowDownLeft, ArrowUpRight, Star, Wallet } from "lucide-react";
import { useAppSelector } from "../../Hooks/hooks";
import {
  WalletTransactionsUrl,
  // TransferPointsUrl, // معطّل مؤقتًا مع سكشن تحويل النقاط
  WalletBonusUrl,
} from "../../EndPoints/EndPoints";
// import { actGetUser } from "../../store/User/actGetUser"; // معطّل مع سكشن التحويل
import FeedbackToast from "../../Components/FeedbackToast/FeedbackToast";
import "./WalletPage.css";

interface WalletTx {
  id: number;
  transaction_type: string;
  debit: number;
  credit: number;
  balance: number;
  created_at: string;
}

interface WalletBonus {
  id: number;
  title: string;
  description?: string;
  bonus_type: "amount" | "percent";
  bonus_amount: number;
  minimum_add_amount: number;
}

const WalletPage = () => {
  const { t, i18n } = useTranslation();
  // const dispatch = useAppDispatch(); // معطّل مع سكشن التحويل

  const { UserData } = useAppSelector((s) => s.UserInfoSLice);
  const { OTPToken } = useAppSelector((s) => s.OTPauthconfigration);
  const { resturantdata, selectedBranch } = useAppSelector(
    (s) => s.restaurantSettingsSlice
  );
  const { currentLanguage } = useAppSelector((s) => s.LanguageSlice);

  const [transactions, setTransactions] = useState<WalletTx[]>([]);
  const [bonuses, setBonuses] = useState<WalletBonus[]>([]);
  // const [pointsInput, setPointsInput] = useState(""); // معطّل مع سكشن التحويل
  // const [transferring, setTransferring] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type?: "success" | "error";
  }>({ show: false, message: "", type: "success" });

  const walletEnabled = resturantdata?.wallet_status === 1;
  const balance = Number(UserData?.wallet_balance) || 0;
  const userPoints = Number(UserData?.point) || 0;
  // معطّل مع سكشن التحويل
  // const exchangeRate = Number(resturantdata?.loyalty_point_exchange_rate) || 0;
  // const minPoints = Number(resturantdata?.loyalty_point_minimum_point) || 0;
  // const loyaltyOn = resturantdata?.loyalty_point_status === 1;

  const headers = {
    Authorization: `Bearer ${OTPToken}`,
    "Branch-id": `${selectedBranch}`,
    "x-localization": currentLanguage || "ar",
  };

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(WalletTransactionsUrl, {
        params: { limit: 10, offset: 1 },
        headers,
      });
      setTransactions(res.data?.data ?? []);
    } catch {
      /* silent — تفضل الليستة فاضية */
    }
  };

  useEffect(() => {
    if (!OTPToken || !walletEnabled) return;
    fetchTransactions();
    axios
      .get(WalletBonusUrl, { headers })
      .then((res) => setBonuses(res.data ?? []))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [OTPToken, walletEnabled]);

  // معطّل مع سكشن تحويل النقاط
  // const handleTransfer = async () => {
  //   const pts = Number(pointsInput);
  //   if (!pts || pts <= 0) return;
  //   setTransferring(true);
  //   try {
  //     await axios.post(TransferPointsUrl, { point: pts }, { headers });
  //     setToast({ show: true, message: t("walletPage.transfer_success"), type: "success" });
  //     setPointsInput("");
  //     dispatch(actGetUser());
  //     fetchTransactions();
  //   } catch (err: any) {
  //     const msg =
  //       err?.response?.data?.errors?.[0]?.message ||
  //       err?.response?.data?.message ||
  //       t("walletPage.transfer_error");
  //     setToast({ show: true, message: msg, type: "error" });
  //   } finally {
  //     setTransferring(false);
  //   }
  // };

  if (!walletEnabled) {
    return (
      <div className="wallet-page d-flex flex-column align-items-center justify-content-center py-5">
        <Wallet size={40} />
        <p className="mt-3">{t("walletPage.not_available")}</p>
      </div>
    );
  }

  const formatDate = (s: string) =>
    new Date(s).toLocaleDateString(i18n.language === "ar" ? "ar-EG" : "en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="wallet-page">
      <h4 className="wallet-page-title">{t("walletPage.title")}</h4>

      {/* الرصيد */}
      <div className="wallet-balance-card">
        <div className="wallet-balance-label">{t("walletPage.balance")}</div>
        <div className="wallet-balance-amount">
          {balance.toFixed(2)} <span>{t("currency")}</span>
        </div>
        <div className="wallet-points">
          <Star size={14} fill="currentColor" />
          {userPoints} {t("walletPage.your_points")}
        </div>
      </div>

      {/* تحويل نقاط — معطّل مؤقتًا، مش عايزين اليوزر يبدل النقط لمحفظة دلوقتي */}
      {/* {loyaltyOn && exchangeRate > 0 && (
        <div className="wallet-card">
          <div className="wallet-card-title">{t("walletPage.transfer_title")}</div>
          <p className="wallet-card-hint">
            {t("walletPage.rate_hint", { rate: exchangeRate })}
            {minPoints > 0 &&
              ` · ${t("walletPage.min_hint", { min: minPoints })}`}
          </p>
          <div className="wallet-transfer-row">
            <input
              type="number"
              className="wallet-input"
              dir="ltr"
              placeholder={t("walletPage.enter_points")}
              value={pointsInput}
              min={1}
              onChange={(e) => setPointsInput(e.target.value)}
            />
            <button
              className="wallet-gold-btn"
              disabled={transferring || !pointsInput}
              onClick={handleTransfer}
            >
              {t("walletPage.transfer_btn")}
            </button>
          </div>
        </div>
      )} */}

      {/* البونصات */}
      {bonuses.length > 0 && (
        <div className="wallet-card">
          <div className="wallet-card-title">{t("walletPage.bonuses")}</div>
          {bonuses.map((b) => (
            <div key={b.id} className="wallet-bonus-row">
              <span className="wallet-bonus-title">{b.title}</span>
              <span className="wallet-bonus-desc">
                {b.description ||
                  `${t("walletPage.bonus_hint", {
                    amount: b.minimum_add_amount,
                    bonus:
                      b.bonus_type === "percent"
                        ? `${b.bonus_amount}%`
                        : `${b.bonus_amount} ${t("currency")}`,
                  })}`}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* المعاملات */}
      <div className="wallet-card">
        <div className="wallet-card-title">{t("walletPage.transactions")}</div>
        {transactions.length === 0 ? (
          <p className="wallet-empty">{t("walletPage.empty")}</p>
        ) : (
          transactions.map((tx) => {
            const isCredit = tx.credit > 0;
            return (
              <div key={tx.id} className="wallet-tx-row">
                <span className={`wallet-tx-icon ${isCredit ? "in" : "out"}`}>
                  {isCredit ? <ArrowDownLeft size={15} /> : <ArrowUpRight size={15} />}
                </span>
                <div className="wallet-tx-info">
                  <div className="wallet-tx-type">
                    {t(`walletPage.type.${tx.transaction_type}`)}
                  </div>
                  <div className="wallet-tx-date">{formatDate(tx.created_at)}</div>
                </div>
                <div className="wallet-tx-amounts">
                  <span className={isCredit ? "wallet-tx-credit" : "wallet-tx-debit"}>
                    {isCredit ? "+" : "−"}
                    {(isCredit ? tx.credit : tx.debit).toFixed(2)} {t("currency")}
                  </span>
                  <span className="wallet-tx-balance">
                    {t("walletPage.after")} {tx.balance.toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <FeedbackToast
        message={toast.message}
        show={toast.show}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
};

export default WalletPage;
