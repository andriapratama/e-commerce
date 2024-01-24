import React from "react";

interface Props {
  title: string;
  value: string;
  border?: "none";
}

const SettingItem: React.FC<Props> = ({ title, value, border }) => {
  return (
    <div
      className={`w-full flex flex-wrap py-2 px-3 text-sm ${
        border ? "" : "border-b"
      }`}
    >
      <div className="w-full md:w-[150px] font-semibold">{title}</div>
      <div className="w-full md:flex-1 mt-2 md:mt-0">{value}</div>
    </div>
  );
};

export default SettingItem;
