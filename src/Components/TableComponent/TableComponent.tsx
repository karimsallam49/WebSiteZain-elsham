import React from "react";
import "./TableStyle.css";
import type { Order } from "../../DTO/OrderDTO";
import { ImageUrl } from "../../EndPoints/EndPoints";
import { useNavigate } from "react-router";
import { ChevronLeft, ChevronRight, Clock, Package } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SimpleTableProps {
  columns: string[];
  rows: Order[];
  className?: string;
}

/* خريطة حالة الأوردر → كلاس لون الشارة */
const statusClass = (status: string) => {
  switch (status) {
    case "pending":
      return "st-pending";
    case "confirmed":
    case "accepted":
    case "processing":
      return "st-processing";
    case "out_for_delivery":
      return "st-out";
    case "delivered":
      return "st-delivered";
    case "canceled":
    case "failed":
    case "returned":
      return "st-danger";
    default:
      return "st-muted";
  }
};

const TableComponent: React.FC<SimpleTableProps> = ({ rows, className }) => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const now = new Date();

  return (
    <div className={`orders-cards ${className || ""}`}>
      {rows?.map((cell) => {
        const [hours, minutes, seconds] = cell.delivery_time
          .split(":")
          .map(Number);
        const deliveryDate = new Date();
        deliveryDate.setHours(hours, minutes, seconds, 0);
        const estimatedArrival = Math.max(
          Math.round((deliveryDate.getTime() - now.getTime()) / 60000),
          0
        );
        const imgs = cell.product_images ?? [];

        return (
          <button
            key={cell.id}
            type="button"
            className="order-card"
            onClick={() => navigate(`/OrderDetails/${cell.id}`)}
          >
            {/* صور المنتجات متلاصقة + عداد الزيادة */}
            <div className="oc-imgs">
              {imgs.slice(0, 3).map((el, i) => (
                <img key={i} src={`${ImageUrl}/${el}`} alt="" loading="lazy" />
              ))}
              {imgs.length > 3 && (
                <span className="oc-more">+{imgs.length - 3}</span>
              )}
              {imgs.length === 0 && (
                <span className="oc-more">
                  <Package size={16} />
                </span>
              )}
            </div>

            <div className="oc-main">
              <span className="oc-id">#{cell.id}</span>
              <span className="oc-meta">
                <Package size={12} />
                {cell.total_quantity}
                {estimatedArrival > 0 && (
                  <>
                    <Clock size={12} />
                    {estimatedArrival}m
                  </>
                )}
              </span>
            </div>

            <div className="oc-side">
              <span className={`oc-status ${statusClass(cell.order_status)}`}>
                {cell.order_status}
              </span>
              <span className="oc-total">
                {cell.totals
                  ? Number(cell.totals.grand_total).toFixed(2)
                  : cell.order_amount}
              </span>
            </div>

            {i18n.language === "ar" ? (
              <ChevronLeft size={18} className="oc-arrow" />
            ) : (
              <ChevronRight size={18} className="oc-arrow" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default TableComponent;
