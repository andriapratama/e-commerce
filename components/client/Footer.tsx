import {
  FacebookIcon,
  Instagram,
  Map,
  Phone,
  Send,
  Twitter,
} from "lucide-react";
import Link from "next/link";
import React from "react";

const menus = [
  {
    title: "My Account",
    subMenus: [
      {
        name: "My Account",
        link: "/profile",
      },
      {
        name: "Register",
        link: "/register",
      },
      {
        name: "Login",
        link: "/login",
      },
      {
        name: "My Order",
        link: "/my-order",
      },
    ],
  },
  {
    title: "Pages",
    subMenus: [
      {
        name: "Home",
        link: "/",
      },
      {
        name: "Products",
        link: "/products",
      },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="w-full mt-[50px] flex bg-gray-100 justify-center text-gray-600">
      <div className="w-[80%] sm:w-[90%] lg:w-[70%] md:flex block gap-3 py-20">
        <div className="w-full mb-7 md:mb-0">
          <div className="text-lg font-serif mb-5 font-semibold">
            DRINKS STORE
          </div>
          <div className="text-sm mb-4 w-[70%]">
            The best choice in finding your best drink.
          </div>
          <div className="w-full flex gap-3">
            <div className="w-10 h-10 rounded-full cursor-pointer bg-gray-800 text-white flex justify-center items-center ">
              <Twitter height={15} width={15} />
            </div>
            <div className="w-10 h-10 rounded-full cursor-pointer bg-gray-800 text-white flex justify-center items-center ">
              <FacebookIcon height={15} width={15} />
            </div>
            <div className="w-10 h-10 rounded-full cursor-pointer bg-gray-800 text-white flex justify-center items-center ">
              <Instagram height={15} width={15} />
            </div>
          </div>
        </div>

        {menus.map((menu) => (
          <div className="w-full mb-7 md:mb-0" key={menu.title}>
            <div className="text-lg font-serif mb-5 font-semibold">
              {menu.title}
            </div>
            {menu.subMenus.map((subMenu) => (
              <div className="text-sm mb-3 font-serif" key={subMenu.name}>
                <Link href={subMenu.link}>{subMenu.name}</Link>
              </div>
            ))}
          </div>
        ))}

        <div className="w-full mb-7 md:mb-0">
          <div className="text-lg font-serif mb-5 font-semibold">
            Have a Questions?
          </div>
          <div className="flex gap-3 mb-3">
            <Map width={20} height={20} />
            <div className="text-sm font-serif">
              Jln. Renon, Kabupaten Denpasar, Prov. Bali
            </div>
          </div>
          <div className="flex gap-3 mb-3">
            <Phone width={15} height={15} />
            <div className="text-sm font-serif">+62 82 999 222 888</div>
          </div>
          <div className="flex gap-3 mb-3">
            <Send width={15} height={15} />
            <div className="text-sm font-serif">test@mail.com</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
