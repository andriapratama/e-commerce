import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import Footer from "@/components/client/Footer";
import Navbar from "@/components/client/Navbar/Navbar";
import Hero from "@/components/client/home/Hero";
import Products from "@/components/client/home/Products";
import { useCountCartsHook } from "@/hooks/client/CartHook";
import { useGetUserByEmailHook } from "@/hooks/client/UserHook";
import { useGetProductsByStatusHook } from "@/hooks/client/ProductHook";
import { useGetAllCategoriesHook } from "@/hooks/client/CategoriesHook";
import { useGetAllHerosData } from "@/hooks/client/HeroHook";
import { useGetAllPromoHook } from "@/hooks/client/PromoHook";
import Promo from "@/components/client/home/Promo";

const Home = async () => {
  let isActive: boolean = true;

  try {
    const session = await getServerSession(authOptions);

    const { user } = await useGetUserByEmailHook();

    isActive = user.active;

    const { products: productsBest } = await useGetProductsByStatusHook("best");

    const { products: productsSale } = await useGetProductsByStatusHook("sale");

    const { products: productsNew } = await useGetProductsByStatusHook("new");

    const { categories } = await useGetAllCategoriesHook();

    const { countCarts } = await useCountCartsHook();

    const { heros } = await useGetAllHerosData();

    const { promos } = await useGetAllPromoHook();

    return (
      <main className="min-h-screen !w-full overflow-x-hidden">
        <Navbar
          countCarts={countCarts}
          role={session?.user.role}
          categories={categories}
        />
        <Hero heros={heros} />
        <Products products={productsBest} title="best seller" />
        <Products products={productsNew} title="new" />
        <Products products={productsSale} title="sale" />
        <Promo promos={promos} />
        <Footer />
      </main>
    );
  } catch (error) {
    const { products: productsBest } = await useGetProductsByStatusHook("best");

    const { products: productsSale } = await useGetProductsByStatusHook("sale");

    const { products: productsNew } = await useGetProductsByStatusHook("new");

    const { categories } = await useGetAllCategoriesHook();

    const { heros } = await useGetAllHerosData();

    const { promos } = await useGetAllPromoHook();

    return (
      <main className="min-h-screen !w-full overflow-x-hidden">
        <Navbar categories={categories} />
        <Hero heros={heros} />
        <Products products={productsBest} title="best seller" />
        <Products products={productsNew} title="new" />
        <Products products={productsSale} title="sale" />
        <Promo promos={promos} />
        <Footer />
      </main>
    );
  } finally {
    isActive === false && redirect("/announcement");
  }
};

export default Home;
