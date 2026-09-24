import { useState } from "react";
import { GeOrderDetailsUrl } from "../../EndPoints/EndPoints";
import { useAppSelector } from "../../Hooks/hooks";
import type { OrderListResponse } from "../../DTO/OrderDTO";
import { useFetch } from "../../Hooks/useFetch";
import TableComponent from "../TableComponent/TableComponent";
import "./HistoryOrders.css";
import { useTranslation } from "react-i18next";

const HistoryOrders = () => {
  const [currentOffset, setCurrentOffset] = useState(1);
  const { t } = useTranslation();
  const { currentLanguage } = useAppSelector((state) => state.LanguageSlice);
  const { OTPToken } = useAppSelector((state) => state.OTPauthconfigration);

  const API = `${GeOrderDetailsUrl}?order_filter=history&offset=${currentOffset}&limit=10`;

  const { data } = useFetch<OrderListResponse>(
    currentLanguage,
    API,
    { enabled: true },
    OTPToken ?? "null"
  );

  const columns = [
    t("history_orders.columns.order_details"),
    t("history_orders.columns.quantity"),
    t("history_orders.columns.expected_arrival"),
    t("history_orders.columns.total"),
    t("history_orders.columns.order_status"),
  ];

  // 🧮 Pagination logic
  const totalSize = data?.total_size ?? 0;
  const limit = 10;
  const totalPages = Math.ceil(totalSize / limit);

  const handlePrev = () => {
    if (currentOffset > 1) setCurrentOffset((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentOffset < totalPages) setCurrentOffset((prev) => prev + 1);
  };

  return (
    <div className="ongoing-orders-container">
      {
       data&& data?.orders.length>0?(
          <>
                  <TableComponent columns={columns} rows={data?.orders ?? []} />

             <div className="pagination-container">
        <button
          onClick={handlePrev}
          disabled={currentOffset === 1}
          className={`pagination-btn ${currentOffset === 1 ? "disabled" : ""}`}
          >
          السابق
        </button>

        <span className="page-indicator">
          {currentOffset} / {totalPages || 1}
        </span>

        <button
          onClick={handleNext}
          disabled={currentOffset === totalPages || totalPages === 0}
          className={`pagination-btn ${
            currentOffset === totalPages || totalPages === 0 ? "disabled" : ""
            }`}
            >
          التالي
        </button>
      </div>
          </>
        ):(
          <div className="w-100 text-center h-100 text-muted">
          لا توجد بيانات 
          </div>
        )


   
        }
    </div>
  );
};

export default HistoryOrders;
