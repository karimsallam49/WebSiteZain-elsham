import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "react-bootstrap";
import "./MyOrders.css";
import OngoingOrders from "../../Components/OnGoingOrders/OnGoinOrder";
import HistoryOrders from "../../Components/HistroyOrders/HistoryOrders";
import { useTranslation } from "react-i18next";

const MyOrdersPage = () => {
  const [activeTab, setActiveTab] = useState<"continuous" | "history">("continuous");
  const { t } = useTranslation();

  return (
    <div className="container my-orders-page d-flex flex-column align-items-center justify-content-center py-4">
    
      <div className="d-flex w-100 d-flex align-content-center justify-content-center gap-3 mb-4">
        <Button
          variant="none"
          className={`${
            activeTab === "continuous" ? " backgroundMainColor text-light " : ""
          }" px-5 py-2 fw-bold border-0 "`}
          onClick={() => setActiveTab("continuous")}
        >
          {t("orders.ongoing")}
        </Button>
        <Button
          variant="none"
          className={`${
            activeTab === "history" ? " backgroundMainColor text-light " : ""
          }" px-5 py-2 fw-bold border-0 "`}
          onClick={() => setActiveTab("history")}
        >
          {t("orders.history")}
        </Button>
      </div>

      {/* 🔹 المحتوى مع حركة */}
      <div className="w-100 container ">
        <AnimatePresence mode="wait">
          {activeTab === "continuous" && (
            <motion.div
              key="continuous"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              <OngoingOrders />
            </motion.div>
          )}

          {activeTab === "history" && (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              <HistoryOrders />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MyOrdersPage;
