import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "./FavTimeSlider.css";
import clockimage from "../../assets/svg/clock_svg.svg"

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
  const [slidesToShow, setSlidesToShow] = useState(4);

  const handleSelect = (slot: TimeSlot) => {
    setSelectedTime(slot);
      const deliveryTime = slot.start; 

    if (onSelectTime) onSelectTime(deliveryTime);
  };

  useEffect(() => {
    const updateSlides = () => {
      const width = window.innerWidth;
      if (width < 576) setSlidesToShow(2);
      else if (width < 768) setSlidesToShow(2);
      else if (width < 992) setSlidesToShow(3);
      else setSlidesToShow(4);
    };

    // أول مرة عند التحميل
    updateSlides();

    // تحديث عند تغيير حجم الشاشة (بتردد قليل جدًا)
    const resizeHandler = () => {
      clearTimeout((resizeHandler as any)._t);
      (resizeHandler as any)._t = setTimeout(updateSlides, 150);
    };

    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, []);
  const settings = {
    dots: false,
    infinite: false,
    speed: 400,
    slidesToShow: slidesToShow,
    slidesToScroll: 2,
    arrows: true,
    responsive: [
      {
        breakpoint: 992,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 576,
        settings: { slidesToShow: 1 },
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
                <img width={20} src={clockimage} alt="" />

                <span className="w-100 ">
                {slot.start} - {slot.end}

                </span>
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
