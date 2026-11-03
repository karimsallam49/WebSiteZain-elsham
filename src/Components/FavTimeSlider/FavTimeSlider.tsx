import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import "./FavTimeSlider.css";

export interface TimeSlot {
  start: string;
  end: string;
}

interface FavTimeSliderProps {
  timeSlots: TimeSlot[] | undefined;
  onSelectTime?: (slot: string) => void;
}

const FavTimeSlider: React.FC<FavTimeSliderProps> = ({
  timeSlots = [],
  onSelectTime,
}) => {
  const { t, i18n } = useTranslation();
  const [selectedTime, setSelectedTime] = useState<TimeSlot | null>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const isRtl = i18n.dir() === "rtl";

  const scrollRail = (dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    el.scrollBy({
      left: (isRtl ? -dir : dir) * el.clientWidth,
      behavior: "smooth",
    });
  };

  const handleSelect = (slot: TimeSlot) => {
    setSelectedTime(slot);
    if (onSelectTime) onSelectTime(slot.start);
  };

  if (!timeSlots.length) {
    return <div className="text-muted">{t("checkout.no_available_times")}</div>;
  }

  return (
    <div className="favtime-container w-100">
      <button
        type="button"
        className="favtime-arrow prev"
        onClick={() => scrollRail(-1)}
        aria-label="previous"
      >
        {isRtl ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
      </button>
      <div className="favtime-rail" ref={railRef}>
        {timeSlots.map((slot, index) => (
          <button
            key={index}
            type="button"
            className={`time-btn ${
              selectedTime?.start === slot.start ? "active" : ""
            }`}
            onClick={() => handleSelect(slot)}
          >
            <Clock size={13} strokeWidth={2} />
            <span dir="ltr">
              {slot.start} - {slot.end}
            </span>
          </button>
        ))}
      </div>
      <button
        type="button"
        className="favtime-arrow next"
        onClick={() => scrollRail(1)}
        aria-label="next"
      >
        {isRtl ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
      </button>
    </div>
  );
};

export default FavTimeSlider;
