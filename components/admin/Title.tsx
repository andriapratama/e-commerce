import React from "react";
import { Button } from "../ui/button";

interface TitleProps {
  title: string;
  handleClick?: () => void;
  nameBtn?: string;
  invoice?: string;
}

const Title: React.FC<TitleProps> = ({
  title,
  handleClick,
  nameBtn,
  invoice,
}) => {
  return (
    <div className="w-full mt-5 pb-3 border-b-2 border-slate-300 flex justify-between mb-5">
      <h1 className="font-semibold text-3xl">
        {title} {invoice}
      </h1>
      {handleClick ? (
        <Button type="button" onClick={handleClick}>
          {nameBtn}
        </Button>
      ) : null}
    </div>
  );
};

export default Title;
