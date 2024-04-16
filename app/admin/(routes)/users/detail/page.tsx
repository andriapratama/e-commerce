"use client";

import axios from "axios";
import { default as lazyLoading } from "next/dynamic";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import useSWR, { Fetcher } from "swr";

import ContentLoading from "@/components/ContentLoading";
import PageLoading from "@/components/PageLoading";
import { useLoadingPageContext } from "@/context/LoadingPageContext";
import { AdminUserOrderType, AdminUserType } from "@/types/UserType";

const Title = lazyLoading(() => import("@/components/admin/Title"));
const UserDetailData = lazyLoading(
  () => import("@/components/admin/user-detail/UserDetailData")
);
const UserDetailOrder = lazyLoading(
  () => import("@/components/admin/user-detail/UserDetailOrder")
);

interface User extends AdminUserType {
  order: AdminUserOrderType[];
}

const UserDetail = () => {
  const [route, setRoute] = useState<string>("");

  const { isLoadingPage, setIsLoadingPage } = useLoadingPageContext();

  const searchParams = useSearchParams();

  const pageParams = searchParams.get("page");

  const roleParams = searchParams.get("role");

  const idParams = searchParams.get("id");

  const pageNow = parseInt(pageParams ? pageParams : "1");

  const fetcher: Fetcher<{
    data: { user: User; totalPage: number } | undefined;
    message: string;
  }> = (url: string) => axios.get(url).then((res) => res.data);

  const { data, isLoading } = useSWR(route, fetcher);

  useEffect(() => {
    setRoute(`/api/admin/users/${idParams}/get?page=${pageNow}`);
  }, [idParams, pageNow]);

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
                ? "Detail Pelanggan"
                : roleParams === "guest"
                ? "Detail Tamu"
                : ""
            }`}
          />

          {isLoading ? (
            <ContentLoading className="mt-10" />
          ) : (
            <React.Fragment>
              <UserDetailData user={data?.data?.user} />

              <UserDetailOrder
                orders={data?.data?.user.order}
                setIsLoadingPage={setIsLoadingPage}
                totalPage={data?.data?.totalPage}
              />
            </React.Fragment>
          )}
        </div>
      </section>
    );
  }
};

export default UserDetail;
