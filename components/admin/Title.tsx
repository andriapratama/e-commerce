import React from "react";
import { Button } from "../ui/button";
import StatusOrder from "./StatusOrder";

interface TitleProps {
  title: string;
  handleClick?: () => void;
  nameBtn?: string;
  invoice?: string;
  statusOrder?: "new" | "ongoing" | "done" | "cancel";
}

const Title: React.FC<TitleProps> = ({
  title,
  handleClick,
  nameBtn,
  invoice,
  statusOrder,
}) => {
  return (
    <div className="w-full items-center mt-5 pb-3 border-b-2 border-slate-300 flex justify-between mb-5">
      <h1 className="font-semibold text-3xl">
        {title} {invoice}
      </h1>
      {handleClick ? (
        <Button type="button" onClick={handleClick}>
          {nameBtn}
        </Button>
      ) : statusOrder ? (
        StatusOrder(statusOrder)
      ) : null}
    </div>
  );
};

export default Title;
