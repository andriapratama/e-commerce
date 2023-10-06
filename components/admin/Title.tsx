import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";

interface TitleProps {
  title: string;
  link?: string;
  onClick?: () => void;
  nameBtn?: string;
}

const Title: React.FC<TitleProps> = ({ title, link, onClick, nameBtn }) => {
  return (
    <div className="w-full mt-5 pb-3 border-b-2 border-slate-300 flex justify-between mb-5">
      <h1 className="font-semibold text-3xl">{title}</h1>
      {link ? (
        <Link
          className="px-4 py-2 bg-black text-white text-sm font-medium rounded-md flex items-center"
          href={`${link}`}
        >
          {nameBtn}
        </Link>
      ) : onClick ? (
        <Button type="button" onClick={onClick}>
          {nameBtn}
        </Button>
      ) : null}
    </div>
  );
};

export default Title;
