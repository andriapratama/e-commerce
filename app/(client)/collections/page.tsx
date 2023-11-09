import Footer from "@/components/client/Footer";
import Navbar from "@/components/client/Navbar";
import TitlePage from "@/components/client/TitlePage";
import Topbar from "@/components/client/Topbar";
import Categories from "@/components/client/collection/Categories";
import Products from "@/components/client/collection/Products";
import SearchByCategory from "@/components/client/collection/SearchByCategory";
import SearchByName from "@/components/client/collection/SearchByName";
import { authOptions } from "@/lib/auth";
import axios from "axios";
import { getServerSession } from "next-auth";
import React from "react";

const Collections = async () => {
  try {
    const session = await getServerSession(authOptions);

    const categoriesRes = await axios.get(
      `${process.env.WEB_URL}/api/categories`
    );

    const categories = categoriesRes.data.data;

    const productsRes = await axios.get(`${process.env.WEB_URL}/api/products`);

    const products = productsRes.data.data;

    return (
      <section className="w-full min-h-screen">
        <Topbar session={session} />
        <Navbar />
        <TitlePage title="Our Collections" />

        <div className="w-full flex justify-center mt-5">
          <div className="w-[90%] flex gap-5 mt-[100px]">
            <div className="w-full">
              <SearchByName />

              <SearchByCategory categories={categories} />

              <Products products={products} />
            </div>
            <Categories categories={categories} />
          </div>
        </div>
        <Footer />
      </section>
    );
  } catch (error) {
    console.log(error);
  }
};

export default Collections;
