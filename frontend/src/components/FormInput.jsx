import React from "react";

const FormInput = ({
  label,
  name,
  type,
  placeholder,
  value,
  onChange,
  className,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name}>{label}</label>
      <input
        className={
          "bg-slate-100 px-2 py-1 focus:outline-none border border-slate-300 rounded"
        }
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default FormInput;
