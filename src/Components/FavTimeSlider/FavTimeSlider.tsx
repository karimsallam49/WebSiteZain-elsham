import React, { useState } from "react";
import Slider from "react-slick";
import { Clock } from "lucide-react";
import "./FavTimeSlider.css";

export interface TimeSlot {
  start: string;
  end: string;

}


interface FavTimeSliderProps {
  timeSlots: TimeSlot[]|undefined;
  onSelectTime?: (slot: string) => void;
}

const FavTimeSlider: React.FC<FavTimeSliderProps> = ({
  timeSlots = [],
  onSelectTime,
}) => {
  const [selectedTime, setSelectedTime] = useState<TimeSlot | null>(null);

  const handleSelect = (slot: TimeSlot) => {
    setSelectedTime(slot);
      const deliveryTime = slot.start;

    if (onSelectTime) onSelectTime(deliveryTime);
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 1,
    swipeToSlide: true,
    arrows: true,
    responsive: [
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 },
      },
    ],
  };

  return (
    <div className="favtime-container w-100">

      {timeSlots.length > 0 ? (
        <Slider  {...settings}>
          {timeSlots.map((slot, index) => (
            <div key={index} className="px-2">
              <button
                className={`time-btn   ${
                  selectedTime?.start === slot.start ? "active" : " text-muted"
                }`}
                onClick={() => handleSelect(slot)}
              >
                <Clock size={12} strokeWidth={2} />
                <span dir="ltr">{slot.start} - {slot.end}</span>
              </button>
            </div>
          ))}
        </Slider>
      ) : (
        <div className="text-muted">No available times</div>
      )}

      
    </div>
  );
};

export default FavTimeSlider;
