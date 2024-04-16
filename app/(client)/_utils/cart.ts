import axios from "axios";

export const getCountCart = async (email: string | undefined) => {
  try {
    const res = await axios.get(
      `${process.env.WEB_URL}/api/cart/${email}/count`
    );

    const countCart: number = res.data.data;

    return countCart;
  } catch (error) {
    console.log(error);
  }
};
