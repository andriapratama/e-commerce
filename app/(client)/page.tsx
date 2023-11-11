import Footer from "@/components/client/Footer";
import Navbar from "@/components/client/Navbar";
import Topbar from "@/components/client/Topbar";
import Hero from "@/components/client/home/Hero";
import Products from "@/components/client/home/Products";
import { authOptions } from "@/lib/auth";
import axios from "axios";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const Home = async () => {
  try {
    const session = await getServerSession(authOptions);

    if (session) {
      await axios.get(`${process.env.WEB_URL}/api/users/${session.user.email}`);
    }

    const productsRes = await axios.get(
      `${process.env.WEB_URL}/api/products/special`
    );
    const products = productsRes.data.data;

    return (
      <main className="min-h-screen w-full">
        <Topbar role={session?.user.role} />
        <Navbar />
        <Hero />
        <Products products={products} />
        <Footer />
      </main>
    );
  } catch (error: any) {
    if (error.response.data.data === false) {
      return redirect(process.env.WEB_URL + "/announcement");
    } else {
      console.log(error);
    }
  }
};

export default Home;
