import { Alegreya_SC } from "next/font/google";
import Image from "next/image";
import React from "react";

const alegreya = Alegreya_SC({
  weight: "500",
  style: "italic",
  subsets: ["latin"],
});

const ClientPageLoading = () => {
  return (
    <div className="flex w-full h-screen justify-center items-center">
      <div className="block">
        <Image
          src="/loading.webp"
          alt="loading"
          width={200}
          height={200}
          className="object-contain"
          priority
        />
        <div className={`w-full text-center text-xl ${alegreya.className}`}>
          Loading...
        </div>
      </div>
    </div>
  );
};

export default ClientPageLoading;
