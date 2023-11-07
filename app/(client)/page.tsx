import Hero from "@/components/client/home/Hero";
import Products from "@/components/client/home/Products";
import axios from "axios";

const Home = async () => {
  try {
    const res = await axios.get(`${process.env.WEB_URL}/api/products/special`);
    const products = res.data.data;

    return (
      <main className="min-h-screen w-full">
        <Hero />
        <Products products={products} />
      </main>
    );
  } catch (error) {
    console.log(error);
  }
};

export default Home;
