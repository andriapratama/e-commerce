"use client";

import axios from "axios";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import useSWR, { Fetcher } from "swr";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { PromoType } from "@/types/PromoType";

const Promo = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  const router = useRouter();

  const fetcher: Fetcher<{
    data: PromoType[];
    message: string;
  }> = (url: string) => axios.get(url).then((res) => res.data);

  const { data } = useSWR(`/api/promo/get`, fetcher);

  if (!data?.data || data?.data.length < 1) return null;

  return (
    <section className="w-full flex justify-center md:mt-[100px] mt-14">
      <div className="lg:w-[80%] sm:w-[90%] w-[80%]">
        <div
          className={`md:text-5xl text-3xl w-full text-center mb-10 capitalize font-serif`}
        >
          Promo
        </div>

        <Carousel
          className="w-full"
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[plugin.current]}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.play}
        >
          <CarouselContent className="-ml-1">
            {data.data.map((promo: PromoType, index) => (
              <CarouselItem
                key={index}
                className={`pl-2 rounded  ${
                  data.data.length === 2
                    ? "md:basis-1/2 md:h-[400px]"
                    : data.data.length === 1
                    ? "md:basis-full"
                    : "lg:basis-1/3 md:basis-1/2 lg:h-[280px]"
                }`}
              >
                <div className="p-1">
                  <div className="w-full flex justify-center 2xl:h-[270px] h-[200px] overflow-hidden">
                    <Image
                      src={promo.image}
                      alt={promo.name}
                      width={500}
                      height={300}
                      className="basis-1/3 h-full object-cover rounded cursor-pointer"
                      priority
                      onClick={() =>
                        router.push(`promos/detail?promo=${promo.slug}`)
                      }
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            className={`${data.data.length < 4 ? "invisible" : "visible"}`}
          />
          <CarouselNext
            className={`${data.data.length < 4 ? "invisible" : "visible"}`}
          />
        </Carousel>
      </div>
    </section>
  );
};

export default Promo;
