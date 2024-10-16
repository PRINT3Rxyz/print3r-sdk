import { Tooltip } from "@nextui-org/react";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import React, { ReactNode } from "react";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import InfoTooltip from "./InfoTooltip";

type Props = {
  placeholder?: string;
  className?: string;
  wrapperClassName?: string;
  value?: string;
  onChange?: (e: any) => void;
  customOnBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  title?: string;
  error?: string;
  showError?: boolean;
  success?: string;
  showSuccess?: boolean;
  readonly?: boolean;
  symbol?: ReactNode;
  min?: number;
  max?: number;
  type?: string;
  step?: number;
  uppercase?: boolean;
  tooltip?: string;
  showTooltip?: boolean;
};

const truncateValue = (value: string | undefined, maxLength: number) => {
  if (value && value.length > maxLength) {
    return value.substring(0, maxLength) + "...";
  }
  return value;
};

const ValueInput = ({
  readonly,
  placeholder,
  className,
  value,
  onChange,
  customOnBlur,
  title,
  error,
  showError,
  success,
  showSuccess,
  symbol,
  type,
  min,
  max,
  step,
  wrapperClassName,
  uppercase,
  tooltip,
  showTooltip,
}: Props) => {
  const displayValue = truncateValue(value, 42);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = parseFloat(value);

    if (type === "number") {
      if (isNaN(numValue)) {
        e.target.value = "";
        onChange && onChange(e);
      } else if (min !== undefined && numValue < min) {
        e.target.value = min.toString();
        onChange && onChange(e);
      } else if (max !== undefined && numValue > max) {
        e.target.value = max.toString();
        onChange && onChange(e);
      } else {
        e.target.value = numValue.toString();
        onChange && onChange(e);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    if (uppercase) {
      value = value.toUpperCase();
      e.target.value = value;
    }

    if (type === "number") {
      if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
        onChange && onChange(e);
      }
    } else {
      onChange && onChange(e);
    }
  };

  return (
    <div className={`flex flex-col gap-1.5 ${wrapperClassName}`}>
      <div className="flex items-center gap-4 justify-between">
        {showTooltip ? (
          <InfoTooltip
            text={tooltip!}
            content={
              <div className="flex flex-row items-center gap-2 cursor-help">
                <p className="text-gray-text font-medium text-15 text-left">
                  {title}
                </p>
                <AiOutlineQuestionCircle className="text-gray-text" />
              </div>
            }
          />
        ) : (
          <p className="text-gray-text font-medium text-sm md:text-15 text-left text-nowrap">
            {title}
          </p>
        )}
        {showError && (
          <p className="text-printer-red font-medium text-15 text-right">
            {error}
          </p>
        )}
        {showSuccess && (
          <div className="flex flex-row gap-2">
            <p className="text-printer-green font-medium text-15 text-right">
              {success}
            </p>
            <IoMdCheckmarkCircleOutline className="text-printer-green text-2xl" />
          </div>
        )}
      </div>
      {readonly ? (
        <div
          className={`flex w-full px-4 py-3 bg-input-grad shadow-inner items-center rounded-3 ${className}`}
        >
          {symbol}
          <p
            className={`text-printer-gray bg-input-grad text-center md:text-left font-bold overflow-hidden text-ellipsis whitespace-nowrap`}
          >
            {uppercase ? displayValue?.toUpperCase() : displayValue}
          </p>
        </div>
      ) : (
        <div
          className={`flex w-full px-4 py-3 bg-input-grad shadow-inner items-center rounded-3 ${className}`}
        >
          {symbol}
          <input
            defaultValue={min ? min : undefined}
            min={min}
            max={max}
            step={step}
            type={type || "text"}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            className="bg-transparent outline-none focus:outline-none focus:ring-0 ring-0 w-full min-w-32 font-bold text-lg text-printer-gray overflow-hidden text-ellipsis"
            onBlur={customOnBlur || handleBlur}
          />
        </div>
      )}
    </div>
  );
};

export default ValueInput;
