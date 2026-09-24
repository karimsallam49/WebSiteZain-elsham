import { useEffect } from "react";
import "./FeedbackToast.css";

interface FeedbackToastProps {
  message: string;
  show: boolean;
  onClose: () => void;
  type?: "success" | "error";
}

const FeedbackToast = ({ message, show, onClose, type = "success" }: FeedbackToastProps) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <>
    {
      show&&(

        <div className={`feedback-toast  show  ${type}`}>
      {message}
    </div>
      )
    }
    </>
  );
};

export default FeedbackToast;
