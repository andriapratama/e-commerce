"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

interface AnnouncementContentProps {
  active?: boolean;
}

const AnnouncementContent: React.FC<AnnouncementContentProps> = ({
  active,
}) => {
  const router = useRouter();

  useEffect(() => {
    if (active === false) {
      signOut({
        redirect: false,
      });
      router.push(`${process.env.NEXT_PUBLIC_WEB_URL}`);
    }
  }, [active]);

  return (
    <div className="w-full text-center text-2xl h-screen items-center flex justify-center font-serif">
      Please verification your email first.
      <br />
      After that, login again.
    </div>
  );
};

export default AnnouncementContent;
