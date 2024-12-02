import React from "react";

const SubmitButton = ({ children }) => {
  return (
    <button className="bg-black w-full text-white rounded-md p-1">
      {children}
    </button>
  );
};

export default SubmitButton;
