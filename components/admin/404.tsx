import Link from "next/link";
import React from "react";

const NotFound = () => {
  return (
    <div className="w-full h-[70vh] flex flex-col items-center justify-center text-center">
      <p className="text-7xl md:text-8xl lg:text-9xl font-bold tracking-wider text-gray-300">
        404
      </p>
      <p className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-wider text-gray-300 mt-2">
        Halaman Tidak Ditemukan
      </p>
      <p className="text-lg md:text-xl lg:text-2xl text-gray-500 my-12">
        Maaf, halaman yang anda cari tidak ditemukan.
      </p>
      <Link
        href="/admin/orders"
        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-gray-100 px-4 py-2 rounded transition duration-150"
        title="Return Order"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          ></path>
        </svg>
        <span>Kembali ke Order</span>
      </Link>
    </div>
  );
};

export default NotFound;
