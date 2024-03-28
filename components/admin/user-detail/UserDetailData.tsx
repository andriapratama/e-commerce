import React from "react";

import { AdminUserType } from "@/types/UserType";

interface Props {
  user: AdminUserType | undefined;
}

const UserDetailData: React.FC<Props> = ({ user }) => {
  if (!user) {
    return null;
  }

  return (
    <div className="admin__card">
      <div className="w-full flex mb-2">
        <div className="w-[100px] font-semibold">Nama</div>
        <div className="capitalize">
          : {`${user.firstName} ${user.lastName}`}
        </div>
      </div>

      <div className="w-full flex mb-2">
        <div className="w-[100px] font-semibold">Email</div>
        <div>: {user.email}</div>
      </div>

      <div className="w-full flex mb-2">
        <div className="w-[100px] font-semibold">No Hp</div>
        <div>: {user.phone}</div>
      </div>

      <div className="w-full flex mb-2">
        <div className="w-[100px] font-semibold">Status</div>
        <div>: {user.active === true ? "Aktif" : "Tidak aktif"}</div>
      </div>

      <div className="w-full flex">
        <div className="w-[100px] font-semibold">Alamat</div>
        <div>: {user.address}</div>
      </div>
    </div>
  );
};

export default UserDetailData;
