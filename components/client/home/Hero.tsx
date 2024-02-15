"use client";

import React, { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { HeroClientType } from "@/types/HeroType";

interface Props {
  heros: HeroClientType[];
}

const Hero: React.FC<Props> = ({ heros }) => {
  const [isActive, setIsActive] = useState<boolean>(false);

  const plugin = React.useRef(
    Autoplay({ delay: 10000, stopOnInteraction: true })
  );

  if (heros.length > 0) {
    return (
      <Carousel
        className="w-full h-fit mt-[50px] md:mt-[80px] lg:mt-[100px] overflow-x-hidden"
        opts={{
          loop: true,
        }}
        plugins={[plugin.current]}
        onMouseEnter={() => {
          plugin.current.stop();
          setIsActive(true);
        }}
        onMouseLeave={() => {
          plugin.current.play();
          setIsActive(false);
        }}
      >
        <CarouselContent className="w-full !ml-0 h-[220px] md:h-[320px] lg:h-[650px] !relative">
          {heros.map((hero, index) => (
            <CarouselItem
              className="w-full h-full flex justify-center items-center !pl-0"
              key={index}
            >
              <Image
                src={hero.image}
                alt={`hero-${index}`}
                width={2000}
                height={1000}
                className="w-full h-auto object-cover"
                priority
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          className={`!absolute transition-all ease-in-out duration-300 ${
            isActive ? "left-10" : "-left-10"
          }`}
        />
        <CarouselNext
          className={`!absolute transition-all ease-in-out duration-300 ${
            isActive ? "right-10" : "-right-10"
          }`}
        />
      </Carousel>
    );
  } else {
    return null;
  }
};

export default Hero;
