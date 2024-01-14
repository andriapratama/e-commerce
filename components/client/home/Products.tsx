"use client";

import React from "react";
import ProductCard from "../ProductCard";
import Autoplay from "embla-carousel-autoplay";
import { ClientProductType } from "@/types/ProductType";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ProductProps {
  products: ClientProductType[];
  title: string;
}

const Products: React.FC<ProductProps> = ({ products, title }) => {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  if (products.length < 1) {
    return null;
  } else {
    return (
      <React.Fragment>
        <section className="w-full flex justify-center md:mt-[100px] mt-14">
          <div className="lg:w-[80%] sm:w-[90%] w-[80%]">
            <div
              className={`md:text-5xl text-3xl w-full text-center mb-10 md:mb-14 capitalize font-serif`}
            >
              {title}
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
                {products.map((product, index) => (
                  <CarouselItem
                    key={index}
                    className={`pl-1 ${
                      products.length === 3
                        ? "lg:basis-1/3 md:basis-1/2"
                        : products.length === 2
                        ? "md:basis-1/2"
                        : products.length === 1
                        ? "md:basis-full"
                        : "lg:basis-1/4 md:basis-1/2"
                    }`}
                  >
                    <div className="p-1">
                      <ProductCard product={product} key={product.slug} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious
                className={`invisible ${
                  products.length < 5 ? "lg:invisible" : "lg:visible"
                }`}
              />
              <CarouselNext
                className={`invisible ${
                  products.length < 5 ? "lg:invisible" : "lg:visible"
                }`}
              />
            </Carousel>
          </div>
        </section>
      </React.Fragment>
    );
  }
};

export default Products;
