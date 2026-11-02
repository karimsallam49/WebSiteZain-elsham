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
      <span className="toast-icon">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          {type === "success" ? (
            <path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          ) : (
            <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          )}
        </svg>
      </span>
      <span>{message}</span>
    </div>
      )
    }
    </>
  );
};

export default FeedbackToast;
