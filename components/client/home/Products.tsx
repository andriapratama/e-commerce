"use client";

import axios from "axios";
import Autoplay from "embla-carousel-autoplay";
import React from "react";
import useSWR, { Fetcher } from "swr";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ClientProductType } from "@/types/ProductType";

import ProductCard from "../ProductCard";

interface ProductProps {
  title: string;
  status: string;
}

const Products: React.FC<ProductProps> = ({ title, status }) => {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  const fetcher: Fetcher<{
    data: { products: ClientProductType[]; totalPage: number };
    message: string;
  }> = (url: string) => axios.get(url).then((res) => res.data);

  const { data } = useSWR(`/api/products/get?status=${status}`, fetcher);

  if (!data?.data || data?.data.products.length < 1) return null;

  return (
    <React.Fragment>
      <section className="relative w-full flex justify-center md:mt-[100px] mt-14">
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
              {data.data.products.map((product, index) => (
                <CarouselItem
                  key={index}
                  className={`pl-1 ${
                    data.data.products.length === 3
                      ? "lg:basis-1/3 md:basis-1/2"
                      : data.data.products.length === 2
                      ? "md:basis-1/2"
                      : data.data.products.length === 1
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
                data.data.products.length < 5 ? "lg:invisible" : "lg:visible"
              }`}
            />
            <CarouselNext
              className={`invisible ${
                data.data.products.length < 5 ? "lg:invisible" : "lg:visible"
              }`}
            />
          </Carousel>
        </div>
      </section>
    </React.Fragment>
  );
};

export default Products;
