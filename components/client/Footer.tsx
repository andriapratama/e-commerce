"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import React from "react";

import { SettingType } from "@/types/SettingType";

const FacebookIcon = dynamic(() =>
  import("lucide-react").then((icon) => icon.FacebookIcon)
);
const Instagram = dynamic(() =>
  import("lucide-react").then((icon) => icon.Instagram)
);
const Map = dynamic(() => import("lucide-react").then((icon) => icon.Map));
const Phone = dynamic(() => import("lucide-react").then((icon) => icon.Phone));
const Send = dynamic(() => import("lucide-react").then((icon) => icon.Send));
const Twitter = dynamic(() =>
  import("lucide-react").then((icon) => icon.Twitter)
);

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
        link: "/cart",
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
        name: "Categories",
        link: "/collections",
      },
      {
        name: "Promo",
        link: "/promos",
      },
    ],
  },
];

interface Props {
  settingValue: SettingType;
}

const Footer: React.FC<Props> = ({ settingValue }) => {
  return (
    <React.Fragment>
      <footer className="w-full mt-[50px] flex bg-gray-100 justify-center text-gray-600">
        <div className="w-[80%] sm:w-[90%] lg:w-[70%] md:flex block gap-3 py-20">
          <div className="w-full mb-7 md:mb-0">
            <div className="text-lg font-serif mb-5 font-semibold">
              BOTTLE TIME
            </div>
            <div className="text-sm mb-4 w-[70%]">
              The best choice in finding your best drink.
            </div>
            <div className="w-full flex gap-3">
              {!settingValue.twitter ? null : (
                <Link href={settingValue.twitter} target="_blank">
                  <div className="w-10 h-10 rounded-full cursor-pointer bg-gray-800 text-white flex justify-center items-center ">
                    <Twitter height={15} width={15} />
                  </div>
                </Link>
              )}

              {!settingValue.facebook ? null : (
                <Link href={settingValue.facebook} target="_blank">
                  <div className="w-10 h-10 rounded-full cursor-pointer bg-gray-800 text-white flex justify-center items-center ">
                    <FacebookIcon height={15} width={15} />
                  </div>
                </Link>
              )}

              {!settingValue.twitter ? null : (
                <Link href={settingValue.instagram} target="_blank">
                  <div className="w-10 h-10 rounded-full cursor-pointer bg-gray-800 text-white flex justify-center items-center ">
                    <Instagram height={15} width={15} />
                  </div>
                </Link>
              )}
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
              <div className="text-sm font-serif">{settingValue.address}</div>
            </div>
            <div className="flex gap-3 mb-3">
              <Phone width={15} height={15} />
              <div className="text-sm font-serif">{settingValue.whatsapp}</div>
            </div>
            <div className="flex gap-3 mb-3">
              <Send width={15} height={15} />
              <div className="text-sm font-serif">{settingValue.email}</div>
            </div>
          </div>
        </div>
      </footer>

      <div className="fixed right-7 bottom-7 z-[99]">
        <Link href={`https://wa.me/${settingValue.whatsapp}`} target="_blank">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="48"
            height="48"
            viewBox="0 0 48 48"
            className="cursor-pointer"
          >
            <path
              fill="#fff"
              d="M4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98c-0.001,0,0,0,0,0h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303z"
            ></path>
            <path
              fill="#fff"
              d="M4.868,43.803c-0.132,0-0.26-0.052-0.355-0.148c-0.125-0.127-0.174-0.312-0.127-0.483l2.639-9.636c-1.636-2.906-2.499-6.206-2.497-9.556C4.532,13.238,13.273,4.5,24.014,4.5c5.21,0.002,10.105,2.031,13.784,5.713c3.679,3.683,5.704,8.577,5.702,13.781c-0.004,10.741-8.746,19.48-19.486,19.48c-3.189-0.001-6.344-0.788-9.144-2.277l-9.875,2.589C4.953,43.798,4.911,43.803,4.868,43.803z"
            ></path>
            <path
              fill="#cfd8dc"
              d="M24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,4C24.014,4,24.014,4,24.014,4C12.998,4,4.032,12.962,4.027,23.979c-0.001,3.367,0.849,6.685,2.461,9.622l-2.585,9.439c-0.094,0.345,0.002,0.713,0.254,0.967c0.19,0.192,0.447,0.297,0.711,0.297c0.085,0,0.17-0.011,0.254-0.033l9.687-2.54c2.828,1.468,5.998,2.243,9.197,2.244c11.024,0,19.99-8.963,19.995-19.98c0.002-5.339-2.075-10.359-5.848-14.135C34.378,6.083,29.357,4.002,24.014,4L24.014,4z"
            ></path>
            <path
              fill="#40c351"
              d="M35.176,12.832c-2.98-2.982-6.941-4.625-11.157-4.626c-8.704,0-15.783,7.076-15.787,15.774c-0.001,2.981,0.833,5.883,2.413,8.396l0.376,0.597l-1.595,5.821l5.973-1.566l0.577,0.342c2.422,1.438,5.2,2.198,8.032,2.199h0.006c8.698,0,15.777-7.077,15.78-15.776C39.795,19.778,38.156,15.814,35.176,12.832z"
            ></path>
            <path
              fill="#fff"
              fillRule="evenodd"
              d="M19.268,16.045c-0.355-0.79-0.729-0.806-1.068-0.82c-0.277-0.012-0.593-0.011-0.909-0.011c-0.316,0-0.83,0.119-1.265,0.594c-0.435,0.475-1.661,1.622-1.661,3.956c0,2.334,1.7,4.59,1.937,4.906c0.237,0.316,3.282,5.259,8.104,7.161c4.007,1.58,4.823,1.266,5.693,1.187c0.87-0.079,2.807-1.147,3.202-2.255c0.395-1.108,0.395-2.057,0.277-2.255c-0.119-0.198-0.435-0.316-0.909-0.554s-2.807-1.385-3.242-1.543c-0.435-0.158-0.751-0.237-1.068,0.238c-0.316,0.474-1.225,1.543-1.502,1.859c-0.277,0.317-0.554,0.357-1.028,0.119c-0.474-0.238-2.002-0.738-3.815-2.354c-1.41-1.257-2.362-2.81-2.639-3.285c-0.277-0.474-0.03-0.731,0.208-0.968c0.213-0.213,0.474-0.554,0.712-0.831c0.237-0.277,0.316-0.475,0.474-0.791c0.158-0.317,0.079-0.594-0.04-0.831C20.612,19.329,19.69,16.983,19.268,16.045z"
              clipRule="evenodd"
            ></path>
          </svg>
        </Link>
      </div>
    </React.Fragment>
  );
};

export default Footer;
