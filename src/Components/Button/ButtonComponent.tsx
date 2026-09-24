import React from "react";
import { Button, Spinner } from "react-bootstrap";

interface LoadingButtonProps {
  text: string; 
  loading?: boolean; 
  onClick?: () => void; 
  disabled?: boolean; 
  className?: string; 
  type?: "button" | "submit" | "reset"; 
}
 import "../../App.css"
const ButtonComponent: React.FC<LoadingButtonProps> = ({
  text,
  loading = false,
  onClick,
  disabled = false,
  className = "",
  type = "button",
}) => {
  return (
    <Button
      type={type}
      className={`backgroundMainColor border-0 text-light ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? <Spinner animation="border" size="sm" /> : text}
    </Button>
  );
};

export default ButtonComponent;
