"use client";

import ContentLoading from "@/components/ContentLoading";
import PageLoading from "@/components/PageLoading";
import Title from "@/components/admin/Title";
import UserDetailData from "@/components/admin/user-detail/UserDetailData";
import UserDetailOrder from "@/components/admin/user-detail/UserDetailOrder";
import { useLoadingPageContext } from "@/context/LoadingPageContext";
import { AdminUserOrderType, AdminUserType } from "@/types/UserType";
import axios from "axios";
import { useParams, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

const UserDetail = () => {
  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(true);

  const [isLoadingOrderContent, setIsLoadingOrderContent] =
    useState<boolean>(false);

  const { isLoadingPage, setIsLoadingPage } = useLoadingPageContext();

  const [user, setUser] = useState<AdminUserType>({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "member",
    address: null,
    phone: null,
    active: false,
  });

  const [orders, setOrders] = useState<AdminUserOrderType[]>([]);

  const [totalPage, setTotalPage] = useState<number>(0);

  const params = useParams();

  const searchParams = useSearchParams();

  const pageParams = searchParams.get("page");

  const role = params.role;

  const id = params.id;

  const pageNow = parseInt(pageParams ? pageParams : "1");

  const getUser = useCallback(async () => {
    try {
      const res = await axios.get(`/api/admin/users/${id}/get?page=${pageNow}`);

      setUser(res.data.data.user);

      setOrders(res.data.data.user.order);

      setTotalPage(res.data.data.totalPage);

      setIsLoadingContent(false);
      setIsLoadingOrderContent(false);
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  }, [id, pageNow]);

  useEffect(() => {
    getUser();
  }, [getUser]);

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
              role === "member"
                ? "Detail Pelanggan"
                : role === "guest"
                ? "Detail Tamu"
                : ""
            }`}
          />

          {isLoadingContent ? (
            <ContentLoading className="mt-10" />
          ) : (
            <React.Fragment>
              <UserDetailData user={user} />

              {isLoadingOrderContent ? (
                <ContentLoading className="mt-10" />
              ) : (
                <UserDetailOrder
                  orders={orders}
                  setIsLoadingPage={setIsLoadingPage}
                  setIsLoadingOrderContent={setIsLoadingOrderContent}
                  totalPage={totalPage}
                />
              )}
            </React.Fragment>
          )}
        </div>
      </section>
    );
  }
};

export default UserDetail;
