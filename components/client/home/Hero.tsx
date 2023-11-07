import React from "react";
import { Alegreya_SC } from "next/font/google";
import Link from "next/link";

const alegreya = Alegreya_SC({
  weight: "500",
  style: "italic",
  subsets: ["latin"],
});

const Hero = () => {
  return (
    <section className="w-full h-screen overflow-hidden bg-hero bg-center">
      <div className="w-full h-full bg-black/50 flex justify-center items-center">
        <div className="block w-auto h-fit">
          <div
            className={`lg:text-[100px] md:text-7xl text-5xl lg:leading-[80px] md:leading-[60px] leading-[50px] text-gray-200 text-center ${alegreya.className}`}
          >
            Cheers
            <br />
            to the Good Times!
          </div>
          <div className="w-full flex justify-center mt-10">
            <Link href="/collections">
              <button className="bg-black px-7 py-3 rounded-full text-gray-200 font-serif cursor-pointer text-sm hover:bg-gray-200 hover:text-black duration-500 ease-in-out">
                Shop Now
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
