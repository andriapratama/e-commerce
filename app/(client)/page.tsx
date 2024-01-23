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
  const { products: productsBest } = await useGetProductsByStatusHook("best");

  const { products: productsSale } = await useGetProductsByStatusHook("sale");

  const { products: productsNew } = await useGetProductsByStatusHook("new");

  const { categories } = await useGetAllCategoriesHook();

  const { heros } = await useGetAllHerosData();

  const { promos } = await useGetAllPromoHook();

  const session = await getServerSession(authOptions);

  let thisCountCarts: number = 0;

  if (session?.user.role === "member") {
    let isUserActive: boolean = false;

    let user404: boolean = false;

    try {
      const { user } = await useGetUserByEmailHook();

      isUserActive = user.active;
    } catch (error: any) {
      if (error.response.status === 404) user404 = true;
    } finally {
      if (isUserActive === false) redirect("/announcement");
      if (user404) redirect("/denied");
    }

    let isCountCarts404: boolean = false;

    try {
      const { countCarts } = await useCountCartsHook();

      thisCountCarts = countCarts;
    } catch (error: any) {
      if (error.response.status === 404) isCountCarts404 = true;
    } finally {
      if (isCountCarts404) redirect("/denied");
    }
  }

  return (
    <main className="min-h-screen !w-full overflow-x-hidden">
      {session?.user.role === "member" ? (
        <Navbar
          countCarts={thisCountCarts}
          role={session?.user.role}
          categories={categories}
        />
      ) : (
        <Navbar categories={categories} />
      )}
      <Hero heros={heros} />
      <Products products={productsBest} title="best seller" />
      <Products products={productsNew} title="new" />
      <Products products={productsSale} title="sale" />
      <Promo promos={promos} />
      <Footer />
    </main>
  );
};

export default Home;
