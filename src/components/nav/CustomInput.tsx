import React, { useState, useEffect } from "react";

const inputRegex = /^\d*\.?\d*$/;

type CustomInputProps = {
  unit: string;
  value: string | number;
  onChange: (value: string) => void;
};

const CustomInput: React.FC<CustomInputProps> = ({ unit, value, onChange }) => {
  const [internalValue, setInternalValue] = useState(value.toString());

  useEffect(() => {
    setInternalValue(value.toString());
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/,/g, ".");

    if (newValue === "" || newValue === ".") {
      setInternalValue(newValue);
      onChange(newValue === "." ? "0." : newValue);
      return;
    }

    if (inputRegex.test(newValue)) {
      setInternalValue(newValue);
      onChange(newValue);
    }
  };

  return (
    <div className="flex items-center bg-input-grad border-2 border-cardborder rounded-md p-2 w-[40%]">
      <input
        type="text"
        inputMode="decimal"
        className="bg-transparent text-white placeholder-base-gray focus:outline-none focus:ring-0 w-full"
        value={internalValue}
        onChange={handleChange}
        placeholder="0.000"
        autoComplete="off"
        autoCorrect="off"
        minLength={1}
        maxLength={15}
        spellCheck="false"
      />
      <span className="ml-2 text-base-gray">{unit}</span>
    </div>
  );
};

export default CustomInput;
