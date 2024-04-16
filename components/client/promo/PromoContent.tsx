"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import useSWR, { Fetcher } from "swr";

import { PromoType } from "@/types/PromoType";

const PromoContent = () => {
  const fetcher: Fetcher<{
    data: PromoType[];
    message: string;
  }> = (url: string) => axios.get(url).then((res) => res.data);

  const { data } = useSWR("/api/promo/get", fetcher);

  const promos = data?.data;

  if (!promos) {
    return null;
  }

  return (
    <div className="w-full lg:min-h-[calc(100vh-536px)] md:min-h-[calc(100vh-480px)] min-h-[calc(100vh-130px)] flex justify-center lg:mt-[150px] md:mt-[100px] mt-[80px]">
      <div className="w-[90%]">
        <div className="client-title">Promos</div>

        {promos.length < 1 ? (
          <div className="w-full text-center mt-20">Opss, promo not found.</div>
        ) : (
          <div className="flex-1 grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 mt-10">
            {promos.map((promo: PromoType, index) => (
              <Link href={`/promos/detail?promo=${promo.slug}`} key={index}>
                <div className="w-full 2xl:h-[270px] h-[210px] overflow-hidden">
                  <Image
                    src={promo.image}
                    alt={promo.name}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover rounded-md"
                    priority
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PromoContent;
