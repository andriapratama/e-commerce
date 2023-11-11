"use client";

import { PhoneCall, Send } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";

interface TopbarProps {
  role: string | undefined;
}

const Topbar: React.FC<TopbarProps> = ({ role }) => {
  return (
    <section className="w-full flex justify-center bg-black absolute">
      <div className="lg:w-[80%] w-[90%] sm:h-[35px] h-[40px] flex justify-between items-center text-gray-200 text-xs">
        <div className="sm:flex block gap-3">
          <div className="flex items-center gap-2">
            <PhoneCall width={15} height={15} />
            <span className="text-[10px] leading-3">+62 81-888-222-999</span>
          </div>
          <div className="flex items-center gap-2">
            <Send width={15} height={15} />
            <span className="text-[10px] leading-3">test@mail.com</span>
          </div>
        </div>
        {role === "member" ? (
          <div className="uppercase font-serif" onClick={() => signOut()}>
            Logout
          </div>
        ) : (
          <div className="flex h-full items-center gap-4 uppercase font-serif">
            <Link href="/register">Register</Link>
            <Link href="/login">Login</Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Topbar;
