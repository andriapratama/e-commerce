import { PromoType } from "@/types/PromoType";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  promos: PromoType[];
}

const PromoContent: React.FC<Props> = ({ promos }) => {
  return (
    <React.Fragment>
      <div className="w-full min-h-screen flex justify-center lg:mt-[150px] md:mt-[100px] mt-[80px]">
        <div className="w-[90%]">
          <div className="client-title">Promos</div>

          <div className="flex-1 grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 mt-10">
            {promos.map((promos: PromoType, index) => (
              <Link href={`/promos/${promos.slug}`} key={index}>
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
        </div>
      </div>
    </React.Fragment>
  );
};

export default PromoContent;
