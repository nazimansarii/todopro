import React, { useContext, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";

export const Input = ({
  id,
  title,
  name,
  type,
  placeholder,
  value,
  onChange,
  error,
  
}) => {
  const [isDark] = useContext(ThemeContext);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <div className="flex w-full flex-col  relative rounded-md mb-1 ">
      <div className="flex items-center mb-1">
        <label htmlFor={id} className="text-inherit px-1">
          {title}
        </label>
      </div>
      <div className="relative">
        <input
          type={isPassword && showPassword ? "text" : type}
          name={name}
          id={id}
          value={value}
          onChange={onChange}
          className={`outline-none px-2 py-2 ${
            isDark ? "bg-[#313131] text-white" : "bg-gray-100 text-black"
          } rounded-md w-full  focus:border focus:border-blue-400 transition`}
          placeholder={placeholder}
        />
        {isPassword && (
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 cursor-pointer"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        )}
      </div>
      {error && (
        <p className="text-red-500  text-xs absolute top-full px-1  ">
          {error}
        </p>
      )}
    </div>
  );
};
