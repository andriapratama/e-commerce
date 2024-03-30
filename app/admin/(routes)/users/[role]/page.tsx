"use client";

import axios from "axios";
import dynamic from "next/dynamic";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

import ContentLoading from "@/components/ContentLoading";
import PageLoading from "@/components/PageLoading";
import { useLoadingPageContext } from "@/context/LoadingPageContext";
import { AdminUserType } from "@/types/UserType";

const Title = dynamic(() => import("@/components/admin/Title"));
const UserSearch = dynamic(() => import("@/components/admin/user/UserSearch"));
const UserTable = dynamic(() => import("@/components/admin/user/UserTable"));

const Users = () => {
  const [users, setUsers] = useState<AdminUserType[]>([]);

  const { isLoadingPage, setIsLoadingPage } = useLoadingPageContext();

  const [totalPage, setTotalPage] = useState<number>(0);

  const router = useRouter();

  const params = useParams();

  const role = params.role;

  const searchParams = useSearchParams();

  const pageParams = searchParams.get("page");

  const pageNow = parseInt(pageParams ? pageParams : "1");

  const searchValueParams = searchParams.get("search");

  const getUsers = useCallback(async () => {
    try {
      const pathName = `/api/admin/users/get?role=${role}`;

      let route = "";

      if (searchValueParams) {
        route = `${pathName}&search=${searchValueParams}`;
      } else {
        route = `${pathName}&page=${pageNow}`;
      }

      const res = await axios.get(route);

      setUsers(res.data.data.users);

      setTotalPage(res.data.data.totalPage);
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  }, [pageNow, searchValueParams, role]);

  useEffect(() => {
    if (role === "member") {
      getUsers();
    } else if (role === "guest") {
      getUsers();
    } else {
      router.push("/404");
    }
  }, [getUsers, role]);

  useEffect(() => {
    setIsLoadingPage(false);
  }, []);

  if (isLoadingPage) {
    return <PageLoading />;
  } else {
    return (
      <section className="admin__container">
        <div className="admin__container-body">
          <ToastContainer />

          <Title
            title={`${
              role === "member" ? "Pelanggan" : role === "guest" ? "Tamu" : ""
            }`}
          />

          <div className="my-4">
            <UserSearch />
          </div>

          <UserTable
            users={users}
            setIsLoadingPage={setIsLoadingPage}
            totalPage={totalPage}
          />
        </div>
      </section>
    );
  }
};

export default Users;
