"use client";

import { Button } from "@/components/ui/button";
import { UserType } from "@/types/UserType";
import React, { useState } from "react";
import ProfileEditData from "./ProfileEditData";
import { ToastContainer } from "react-toastify";

interface ProfileContentProps {
  user: UserType;
}

const ProfileContent: React.FC<ProfileContentProps> = ({ user }) => {
  const [isOpenEditData, setIsOpenEditData] = useState<boolean>(false);
  return (
    <React.Fragment>
      <ToastContainer />
      <div className="w-full flex justify-center mt-[50px]">
        <div className="w-[50%] bg-white rounded-md shadow p-5 font-serif">
          <div className="w-full flex pb-3 border-b">
            <div className="w-[150px] font-semibold capitalize">Full Name</div>
            <div className="flex-1">
              {user.firstName} {user.lastName}
            </div>
          </div>
          <div className="w-full flex pb-3 border-b mt-3">
            <div className="w-[150px] font-semibold capitalize">Email</div>
            <div className="flex-1">{user.email}</div>
          </div>
          <div className="w-full flex pb-3 border-b mt-3">
            <div className="w-[150px] font-semibold capitalize">Phone</div>
            <div className="flex-1">{user.phone}</div>
          </div>
          <div className="w-full flex pb-3 border-b mt-3">
            <div className="w-[150px] font-semibold capitalize">Address</div>
            <div className="flex-1">{user.address}</div>
          </div>

          <div className="w-full flex justify-end mt-3">
            <Button
              type="button"
              size="sm"
              onClick={() => setIsOpenEditData(true)}
            >
              Edit
            </Button>
          </div>
        </div>
      </div>

      <ProfileEditData
        user={user}
        isOpen={isOpenEditData}
        setIsOpen={setIsOpenEditData}
      />
    </React.Fragment>
  );
};

export default ProfileContent;
