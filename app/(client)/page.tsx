import Footer from "@/components/client/Footer";
import Navbar from "@/components/client/Navbar";
import Topbar from "@/components/client/Topbar";
import Hero from "@/components/client/home/Hero";
import Products from "@/components/client/home/Products";
import { useCountCartsHook } from "@/hooks/client/CartHook";
import { useGetSpecialProductsHook } from "@/hooks/client/ProductHook";
import { useGetUserByEmailHook } from "@/hooks/client/UserHook";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const Home = async () => {
  let isActive: boolean = true;

  try {
    const session = await getServerSession(authOptions);

    const { user } = await useGetUserByEmailHook();

    isActive = user.active;

    const { products } = await useGetSpecialProductsHook();

    const { countCarts } = await useCountCartsHook();

    return (
      <main className="min-h-screen w-full">
        <Topbar role={session?.user.role} userName={user.firstName} />
        <Navbar countCarts={countCarts} />
        <Hero />
        <Products products={products} />
        <Footer />
      </main>
    );
  } catch (error) {
    const { products } = await useGetSpecialProductsHook();

    return (
      <main className="min-h-screen w-full">
        <Topbar />
        <Navbar />
        <Hero />
        <Products products={products} />
        <Footer />
      </main>
    );
  } finally {
    isActive === false && redirect("/announcement");
  }
};

export default Home;
