import React, { useState, useMemo, useCallback } from "react";
import { Card, Form } from "react-bootstrap";
import { useAppSelector } from "../../Hooks/hooks";
import FavTimeSlider from "../FavTimeSlider/FavTimeSlider";
import { useTranslation } from "react-i18next"; // ✅ تم إضافة الترجمة
import "./FavTimeStyle.css";

type FavTimeSelectForOrderProps = {
  SetSelectedDeliveryTime: (deliveryTime: string) => void;
  SetSelectedDeliveryDate: (deliveryDate: string) => void;
};

const FavTimeSelectForOrder: React.FC<FavTimeSelectForOrderProps> = React.memo(
  ({ SetSelectedDeliveryTime, SetSelectedDeliveryDate }) => {
    const { resturantdata } = useAppSelector((state) => state.restaurantSettingsSlice);
    const restaurantSchedule = resturantdata?.restaurant_schedule_time;
    const timeSlot = resturantdata?.schedule_order_slot_duration;
    const { t } = useTranslation(); // ✅ Hook الترجمة

    const [dayOffset, setDayOffset] = useState<number>(0);

    const currentDayIndex = useMemo(() => {
      const today = new Date();
      const todayIndex = (today.getDay() + 6) % 7;
      return (todayIndex + dayOffset) % 7;
    }, [dayOffset]);

    const currentDayInRes = useMemo(() => {
      return restaurantSchedule?.filter((el) => el.day === currentDayIndex) ?? [];
    }, [restaurantSchedule, currentDayIndex]);

    const startTime = useMemo(() => {
      if (dayOffset === 0) {
        const now = new Date();
        return `${now.getHours().toString().padStart(2, "0")}:${now
          .getMinutes()
          .toString()
          .padStart(2, "0")}`;
      } else {
        const todaySchedule = restaurantSchedule?.find(
          (el) => el.day === currentDayIndex
        );
        return todaySchedule?.opening_time || "00:00";
      }
    }, [dayOffset, restaurantSchedule, currentDayIndex]);

    const OrderTimes = useMemo(() => {
      if (!timeSlot || !currentDayInRes?.length) return [];

      return currentDayInRes.flatMap((el) => {
        const [startH, startM] = startTime.split(":").map(Number);
        const [closeH, closeM] = el.closing_time.split(":").map(Number);

        const start = new Date();
        start.setHours(startH, startM, 0, 0);

        const end = new Date();
        end.setHours(closeH, closeM, 0, 0);

        const slots: { start: string; end: string }[] = [];

        while (start < end) {
          const slotStart = new Date(start);
          start.setMinutes(start.getMinutes() + timeSlot);
          const slotEnd = new Date(start);

          if (slotEnd <= end) {
            slots.push({
              start: slotStart.toTimeString().slice(0, 5),
              end: slotEnd.toTimeString().slice(0, 5),
            });
          }
        }
        return slots;
      });
    }, [currentDayInRes, timeSlot, startTime]);

    const handleTimeSelect = useCallback(
      (selectedTime: string) => {
        const today = new Date();
        today.setDate(today.getDate() + dayOffset);
        const dateStr = today.toISOString().split("T")[0];

        SetSelectedDeliveryDate(dateStr);
        SetSelectedDeliveryTime(selectedTime);
      },
      [dayOffset, SetSelectedDeliveryDate, SetSelectedDeliveryTime]
    );

    return (
      <Card className="p-3 border-0 w-100 shadow-sm mb-3 rounded-4">
        <div className="w-100">
          <h4 className="mb-3 fw-semibold">{t("checkout.favorite_time")}</h4>

          <div className="d-flex gap-4 mb-3 align-items-center">
            <Form.Check
              type="radio"
              id="today"
              label={t("checkout.today")}
              name="daySelect"
              checked={dayOffset === 0}
              onChange={() => setDayOffset(0)}
              className="custom-radio-fav"
            />
            <Form.Check
              type="radio"
              id="tomorrow"
              label={t("checkout.tomorrow")}
              name="daySelect"
              checked={dayOffset === 1}
              onChange={() => setDayOffset(1)}
              className="custom-radio-fav"
            />
          </div>

          <FavTimeSlider timeSlots={OrderTimes} onSelectTime={handleTimeSelect} />
        </div>
      </Card>
    );
  }
);

export default FavTimeSelectForOrder;
