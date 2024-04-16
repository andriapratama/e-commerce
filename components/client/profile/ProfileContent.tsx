"use client";

import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { UserType } from "@/types/UserType";

import ProfileChangePassword from "./ProfileChangePassword";
import ProfileEditData from "./ProfileEditData";

interface ProfileContentProps {
  user: UserType;
}

const ProfileContent: React.FC<ProfileContentProps> = ({ user }) => {
  const [isOpenEditData, setIsOpenEditData] = useState<boolean>(false);
  const [isOpenChangePassword, setIsOpenChangePassword] =
    useState<boolean>(false);
  return (
    <React.Fragment>
      <div className="w-full lg:min-h-[calc(100vh-536px)] md:min-h-[calc(100vh-488px)] min-h-[calc(100vh-148px)] flex justify-center lg:mt-[150px] md:mt-[100px] mt-[80px]">
        <div className="lg:w-[50%] sm:w-[90%] w-full h-fit bg-white rounded-md shadow p-5 font-serif">
          <div className="w-full flex pb-3 border-b">
            <div className="lg:w-[150px] w-[100px] font-semibold capitalize">
              Full Name
            </div>
            <div className="flex-1">
              {user.firstName} {user.lastName}
            </div>
          </div>
          <div className="w-full flex pb-3 border-b mt-3">
            <div className="lg:w-[150px] w-[100px] font-semibold capitalize">
              Email
            </div>
            <div className="flex-1">{user.email}</div>
          </div>
          <div className="w-full flex pb-3 border-b mt-3">
            <div className="lg:w-[150px] w-[100px] font-semibold capitalize">
              Phone
            </div>
            <div className="flex-1">{user.phone}</div>
          </div>
          <div className="w-full flex pb-3 border-b mt-3">
            <div className="lg:w-[150px] w-[100px] font-semibold capitalize">
              Address
            </div>
            <div className="flex-1">{user.address}</div>
          </div>

          <div className="w-full flex justify-end mt-3 gap-3">
            <Button
              type="button"
              size="sm"
              onClick={() => setIsOpenEditData(true)}
            >
              Edit
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => setIsOpenChangePassword(true)}
            >
              Change Password
            </Button>
          </div>
        </div>
      </div>

      <ProfileEditData
        user={user}
        isOpen={isOpenEditData}
        setIsOpen={setIsOpenEditData}
      />

      <ProfileChangePassword
        isOpen={isOpenChangePassword}
        setIsOpen={setIsOpenChangePassword}
        email={user.email}
      />
    </React.Fragment>
  );
};

export default ProfileContent;
