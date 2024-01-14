import React from "react";
import Image from "next/image";
import Link from "next/link";

const NavbarLogo = () => {
  return (
    <React.Fragment>
      <Link href="/" className="w-full flex justify-center mb-2">
        <Image
          src="/logo.png"
          alt="logo"
          height={45}
          width={45}
          className="object-contain lg:w-[45px] lg:h-[45px] h-[30px] w-[30px]"
        />
      </Link>
      <div className="uppercase w-full text-center font-serif">
        <span className="text-primary-color">Bottle</span> Time
      </div>
    </React.Fragment>
  );
};

export default NavbarLogo;
