"use client";

import { PromoType } from "@/types/PromoType";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ClientPageLoading from "@/components/ClientPageLoading";

interface Props {
  promos: PromoType[];
}

const PromoContent: React.FC<Props> = ({ promos }) => {
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(false);

  return (
    <React.Fragment>
      <div className="w-full lg:min-h-[calc(100vh-536px)] md:min-h-[calc(100vh-480px)] min-h-[calc(100vh-130px)] flex justify-center lg:mt-[150px] md:mt-[100px] mt-[80px]">
        <div className="w-[90%]">
          <div className="client-title">Promos</div>

          {promos.length < 1 ? (
            <div className="w-full text-center mt-20">
              Opss, promo not found.
            </div>
          ) : (
            <div className="flex-1 grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 mt-10">
              {promos.map((promos: PromoType, index) => (
                <Link
                  href={`/promos/${promos.slug}`}
                  key={index}
                  onClick={() => setIsLoadingPage(true)}
                >
                  <div className="w-full 2xl:h-[270px] h-[210px] overflow-hidden">
                    <Image
                      src={promos.image}
                      alt={promos.name}
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

export default PromoContent;
