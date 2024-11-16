// Button.tsx
import React, { ReactNode } from "react";

interface ButtonProps {
  type: "submit" | "button" | "reset";
  onClick?: () => void;
  width: string;
  height: string;
  children: ReactNode;
  bgColor?: string; // New prop for background color
  borderColor?: string; // New prop for border color
  hoverColor?: string; // New prop for hover color
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  type,
  onClick,
  width,
  height,
  children,
  bgColor,
  borderColor,
  hoverColor,
  className,
  disabled,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={` ${width} ${height}  text-white ${bgColor} ${borderColor} rounded-md ${hoverColor}  ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
