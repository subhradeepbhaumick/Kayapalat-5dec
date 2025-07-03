"use client";

import React from "react";

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({ label, checked, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`w-12 h-6 flex items-center rounded-full p-2 transition-colors duration-300 ${
          checked ? "bg-[#00423D]" : "bg-gray-300"
        }`}
      >
        <div
          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
            checked ? "translate-x-6" : "translate-x-0"
          }`}
        ></div>
      </button>
    </div>
  );
};

export default Toggle;
