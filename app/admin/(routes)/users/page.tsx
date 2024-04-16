"use client";

import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

import Title from "@/components/admin/Title";
import UserSearch from "@/components/admin/user/UserSearch";
import UserTable from "@/components/admin/user/UserTable";
import PageLoading from "@/components/PageLoading";
import { useLoadingPageContext } from "@/context/LoadingPageContext";
import { AdminUserType } from "@/types/UserType";

const Users = () => {
  const [users, setUsers] = useState<AdminUserType[]>([]);

  const { isLoadingPage, setIsLoadingPage } = useLoadingPageContext();

  const [totalPage, setTotalPage] = useState<number>(0);

  const router = useRouter();

  const searchParams = useSearchParams();

  const roleParams = searchParams.get("role");

  const pageParams = searchParams.get("page");

  const pageNow = parseInt(pageParams ? pageParams : "1");

  const searchValueParams = searchParams.get("search");

  const getUsers = useCallback(async () => {
    try {
      const pathName = `/api/admin/users/get?role=${roleParams}`;

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
  }, [pageNow, searchValueParams, roleParams]);

  useEffect(() => {
    if (roleParams === "member") {
      getUsers();
    } else if (roleParams === "guest") {
      getUsers();
    } else {
      router.push("/404");
    }
  }, [getUsers, roleParams]);

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
              roleParams === "member"
                ? "Pelanggan"
                : roleParams === "guest"
                ? "Tamu"
                : ""
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
