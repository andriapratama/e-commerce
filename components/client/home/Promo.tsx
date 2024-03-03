"use client";

import React, { useState } from "react";
import Image from "next/image";
import { PromoType } from "@/types/PromoType";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ClientPageLoading from "@/components/ClientPageLoading";

interface Props {
  promos: PromoType[];
}

const Promo: React.FC<Props> = ({ promos }) => {
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(false);

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  return (
    <React.Fragment>
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
              {promos.map((promo: PromoType, index) => (
                <CarouselItem
                  key={index}
                  className={`pl-2 rounded  ${
                    promos.length === 2
                      ? "md:basis-1/2 md:h-[400px]"
                      : promos.length === 1
                      ? "md:basis-full"
                      : "lg:basis-1/3 md:basis-1/2 lg:h-[280px]"
                  }`}
                >
                  <Link
                    href={`promos/${promo.slug}`}
                    className="p-1"
                    onClick={() => setIsLoadingPage(true)}
                  >
                    <Image
                      src={promo.image}
                      alt={promo.name}
                      width={500}
                      height={300}
                      className="w-full h-auto object-cover rounded"
                      priority
                    />
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious
              className={`${promos.length < 4 ? "invisible" : "visible"}`}
            />
            <CarouselNext
              className={`${promos.length < 4 ? "invisible" : "visible"}`}
            />
          </Carousel>
        </div>
      </section>

      <Dialog open={isLoadingPage} onOpenChange={setIsLoadingPage}>
        <DialogContent
          className="!bg-white !max-w-full !h-screen flex justify-center items-center !outline-none !duration-0"
          closeButton={false}
        >
          <ClientPageLoading />
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default Promo;
