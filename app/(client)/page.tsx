import Footer from "@/components/client/Footer";
import Navbar from "@/components/client/Navbar";
import Topbar from "@/components/client/Topbar";
import Hero from "@/components/client/home/Hero";
import Products from "@/components/client/home/Products";
import { useCountCartsHook } from "@/hooks/client/CartHook";
import { useGetSpecialProductsHook } from "@/hooks/client/ProductHook";
import { authOptions } from "@/lib/auth";
import axios from "axios";
import { getServerSession } from "next-auth";

const Home = async () => {
  try {
    const session = await getServerSession(authOptions);

    await axios.get(`${process.env.WEB_URL}/api/users/${session?.user.email}`);

    const { products } = await useGetSpecialProductsHook();

    const { countCarts } = await useCountCartsHook();

    return (
      <main className="min-h-screen w-full">
        <Topbar role={session?.user.role} />
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
        <Topbar role={undefined} />
        <Navbar />
        <Hero />
        <Products products={products} />
        <Footer />
      </main>
    );
  }
};

export default Home;
