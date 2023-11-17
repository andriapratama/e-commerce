"use client";

import { signOut } from "next-auth/react";
import React, { useEffect } from "react";

interface AnnouncementContentProps {
  active?: boolean;
}

const AnnouncementContent: React.FC<AnnouncementContentProps> = ({
  active,
}) => {
  useEffect(() => {
    active === false && signOut();
  }, [active]);

  return (
    <div className="w-full text-center text-2xl my-[50px] font-serif">
      Please verify your email first.
      <br />
      After that, login again.
    </div>
  );
};

export default AnnouncementContent;
