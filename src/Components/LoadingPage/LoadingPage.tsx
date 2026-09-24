import { useEffect, useState } from "react";

import Loadingpic1 from "../../assets/loader/loader_image_1.png";
import Loadingpic2 from "../../assets/loader/loader_image_3.png";
import Loadingpic4 from "../../assets/loader/loader_image_4.png";
import Loadingpic6 from "../../assets/loader/loader_image_6.png";
import Loadingpic7 from "../../assets/loader/loader_image_7.png";
import Loadingpic8 from "../../assets/loader/loader_image_8.png";

const LoadingPage = () => {
  const images = [
    Loadingpic1,
    Loadingpic2,
    Loadingpic4,
    Loadingpic6,
    Loadingpic7,
    Loadingpic8,
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 500);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 vw-100">
      <img
        src={images[currentIndex]}
        alt="Loading..."
        style={{
          width: "200px",
          height: "200px",
          objectFit: "contain",
        }}
      />
    </div>
  );
};

export default LoadingPage;
