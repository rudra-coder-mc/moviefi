// InputField.tsx
import React from "react";

interface InputFieldProps {
  id: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  width: string;
  height: string;
  bgColor?: string; // New prop for background color
  borderColor?: string; // New prop for border color
  hoverColor?: string; // New prop for hover color
  className?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  type,
  placeholder,
  value,
  onChange,
  width,
  height,
  bgColor, // Default background color
  borderColor, // Default border color
  hoverColor, // Default focus color
  className,
}) => {
  return (
    <div className="w-full sm:w-auto">
      <label htmlFor={id} className="sr-only">
        {placeholder}
      </label>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={` ${width} ${height} px-4 py-2 text-gray-100 ${bgColor} ${borderColor} rounded-md focus:outline-none focus:ring-2 ${hoverColor} ${className}`}
        required
      />
    </div>
  );
};

export default InputField;
