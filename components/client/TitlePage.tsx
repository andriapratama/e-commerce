import React from "react";

interface TitlePageProps {
  title: string;
}

const TitlePage: React.FC<TitlePageProps> = ({ title }) => {
  return (
    <div className="w-full lg:h-[365px] sm:h-[250px] h-[200px] bg-hero bg-bottom overflow-hidden">
      <div className="w-full h-full bg-black/50 flex justify-center items-end sm:pb-10 pb-5">
        <h1 className="text-3xl font-serif text-gray-200">{title}</h1>
      </div>
    </div>
  );
};

export default TitlePage;
