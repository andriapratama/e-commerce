import Title from "@/components/admin/Title";
import CategoryContent from "@/components/admin/category/CategoryContent";
import { authOptions } from "@/lib/auth";
import { CategoryType } from "@/types/CategoryType";
import axios from "axios";
import { getServerSession } from "next-auth";
import React from "react";
import { ToastContainer } from "react-toastify";

const Categories = async () => {
  try {
    const session = await getServerSession(authOptions);

    const username = session?.user.username;

    const resCategories = await axios.get(
      `${process.env.WEB_URL}/api/${username}/categories/get`
    );

    const categories: CategoryType[] = resCategories.data.data;

    return (
      <section className="admin__container">
        <div className="admin__container-body">
          <ToastContainer />
          <Title title="Kategori" />
          <CategoryContent username={username} categories={categories} />
        </div>
      </section>
    );
  } catch (error) {
    console.log(error);
  }
};

export default Categories;
