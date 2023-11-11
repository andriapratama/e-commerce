"use client";

import axios from "axios";
import { signOut } from "next-auth/react";
import React, { useEffect } from "react";

interface AnnouncementProps {
  email: string | undefined;
}

const AnnouncementPage: React.FC<AnnouncementProps> = ({ email }) => {
  const getUserActive = async () => {
    try {
      if (email) {
        await axios.get(`/api/users/${email}`);
      }
    } catch (error: any) {
      const active = error.response.data.data;
      if (active === false) {
        signOut();
      }
    }
  };

  useEffect(() => {
    getUserActive();
  }, []);
  return (
    <div className="w-full text-center text-2xl my-[50px] font-serif">
      Please verify your email first.
      <br />
      After that, login again.
    </div>
  );
};

export default AnnouncementPage;
