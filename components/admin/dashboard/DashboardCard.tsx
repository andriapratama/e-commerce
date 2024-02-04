import React from "react";

interface Props {
  title: string;
  value: string;
}

const DashboardCard: React.FC<Props> = ({ title, value }) => {
  return (
    <div className="w-full h-fit rounded-xl border shadow p-6 bg-white">
      <div className="mb-2 text-sm font-medium">{title}</div>
      <div className="text-2xl font-bold text-end">{value}</div>
    </div>
  );
};

export default DashboardCard;
