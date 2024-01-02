"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { ProductInputType } from "@/components/admin/promo-add/PromoAddForm";
import { ToastContainer, toast } from "react-toastify";
import Title from "@/components/admin/Title";
import PromoEditProvisions from "@/components/admin/promo-edit/PromoEditProvision";
import { useParams, useRouter } from "next/navigation";
import { PromoProductType } from "@/types/PromoType";
import PromoEditBonus from "@/components/admin/promo-edit/PromoEditBonus";
import { handleSetNumber } from "@/utils/HandleSetNumber";
import PromoAddOpenProduct from "@/components/admin/promo-add/PromoAddOpenProduct";
import WarningAlert from "@/components/admin/WarningAlert";

const formSchema = z.object({
  productProvisions: z.any().superRefine((val, ctx) => {
    if (val.length <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Syarat produk harus diisi",
      });
    }
  }),
  productBonus: z.any().superRefine((val, ctx) => {
    if (val.length <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Bonus produk harus diisi",
      });
    }
  }),
  firstPrice: z
    .string()
    .min(1, "Harga awal harus diisi")
    .min(4, "Harga awal minimal Rp 1.000"),
  promoPrice: z
    .string()
    .min(1, "Harga promo harus diisi")
    .min(4, "Harga promo minimal Rp 1.000"),
});

const PromoEditProducts = () => {
  const [firstPrice, setFirstPrice] = useState<string>("0");
  const [promoPrice, setPromoPrice] = useState<string>("0");
  const [productProvisions, setProductProvisions] = useState<
    ProductInputType[]
  >([]);
  const [productBonus, setProductBonus] = useState<ProductInputType[]>([]);
  const [subTotalProvision, setSubTotalProvision] = useState<number>(0);
  const [subTotalBonus, setSubTotalBonus] = useState<number>(0);
  const [status, setStatus] = useState<"provision" | "bonus">("provision");
  const [isOpenProduct, setIsOpenProduct] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [isOpenWarning, setIsOpenWarning] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const params = useParams();

  const slug: string | string[] = params.id;

  const getPromo = useCallback(async () => {
    try {
      const res = await axios.get(`/api/admin/promos/${slug}/get`);

      setName(res.data.data.name);

      setPromoPrice(res.data.data.promoPrice.toString());

      const provision: PromoProductType[] = res.data.data.promoProductProvision;
      const bonus: PromoProductType[] = res.data.data.promoProductBonus;

      const newProvision: ProductInputType[] = [];

      provision.forEach((item: PromoProductType) => {
        const product = {
          image: item.product.image,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          subTotal: item.subTotal,
        };

        newProvision.push(product);
      });

      setProductProvisions(newProvision);

      const totalProvision = Object.values(newProvision).reduce(
        (a, b) => a + b.subTotal,
        0
      );

      setSubTotalProvision(totalProvision);

      const newBonus: ProductInputType[] = [];

      bonus.forEach((item: PromoProductType) => {
        const product = {
          image: item.product.image,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          subTotal: item.subTotal,
        };

        newBonus.push(product);
      });

      setProductBonus(newBonus);

      const totalBonus = Object.values(newBonus).reduce(
        (a, b) => a + b.subTotal,
        0
      );

      setSubTotalBonus(totalBonus);
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  }, []);

  useEffect(() => {
    getPromo();
  }, [getPromo]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      productProvisions: productProvisions,
      productBonus: productBonus,
      firstPrice: firstPrice,
      promoPrice: promoPrice,
    },
  });

  const handleIncrease = (status: "provision" | "bonus", index: number) => {
    let newProduct = [];

    if (status === "provision") {
      newProduct = [...productProvisions];
    } else {
      newProduct = [...productBonus];
    }

    const quantity = newProduct[index].quantity;
    const price = newProduct[index].price;
    const subTotal = newProduct[index].subTotal;

    if (quantity >= 1000) {
      newProduct[index].quantity = 1000;
      newProduct[index].subTotal = 1000 * price;
    } else {
      newProduct[index].quantity = quantity + 1;
      newProduct[index].subTotal = subTotal + price;
    }

    if (status === "provision") {
      setProductProvisions(newProduct);
      handleSumSubTotal(newProduct, "provision");
    } else {
      handleSumSubTotal(newProduct, "bonus");
      setProductBonus(newProduct);
    }
  };

  const handleSetQuantity = (
    value: number,
    status: "provision" | "bonus",
    index: number
  ) => {
    let newProduct = [];

    if (status === "provision") {
      newProduct = [...productProvisions];
    } else {
      newProduct = [...productBonus];
    }

    const price = newProduct[index].price;

    if (value >= 1000) {
      newProduct[index].quantity = 1000;
      newProduct[index].subTotal = 1000 * price;
    } else if (value <= 1 || !value) {
      newProduct[index].quantity = 1;
      newProduct[index].subTotal = price;
    } else {
      newProduct[index].quantity = value;
      newProduct[index].subTotal = value * price;
    }

    if (status === "provision") {
      handleSumSubTotal(newProduct, "provision");
      setProductProvisions(newProduct);
    } else {
      handleSumSubTotal(newProduct, "bonus");
      setProductBonus(newProduct);
    }
  };

  const handleDecrease = (status: "provision" | "bonus", index: number) => {
    let newProduct = [];

    if (status === "provision") {
      newProduct = [...productProvisions];
    } else {
      newProduct = [...productBonus];
    }

    const quantity = newProduct[index].quantity;
    const price = newProduct[index].price;
    const subTotal = newProduct[index].subTotal;

    if (quantity <= 1) {
      newProduct[index].quantity = 1;
      newProduct[index].subTotal = price;
    } else {
      newProduct[index].quantity = quantity - 1;
      newProduct[index].subTotal = subTotal - price;
    }

    if (status === "provision") {
      handleSumSubTotal(newProduct, "provision");
      setProductProvisions(newProduct);
    } else {
      handleSumSubTotal(newProduct, "bonus");
      setProductBonus(newProduct);
    }
  };

  const handleDelete = (status: "provision" | "bonus", index: number) => {
    let newProduct: any[] = [];

    if (status === "provision") {
      newProduct = [...productProvisions];
    } else {
      newProduct = [...productBonus];
    }

    const productFilter = newProduct.filter((product, idx) => idx !== index);

    if (status === "provision") {
      handleSumSubTotal(productFilter, "provision");
      setProductProvisions(productFilter);
    } else {
      handleSumSubTotal(productFilter, "bonus");
      setProductBonus(productFilter);
    }
  };

  const handleSumSubTotal = (
    products: ProductInputType[],
    status: "provision" | "bonus"
  ) => {
    const total = Object.values(products).reduce((a, b) => a + b.subTotal, 0);

    if (status === "provision") {
      setSubTotalProvision(total);
      setPromoPrice(total.toString());
    } else {
      setSubTotalBonus(total);
    }
  };

  useEffect(() => {
    const total = subTotalProvision + subTotalBonus;
    setFirstPrice(total.toString());
  }, [subTotalBonus, subTotalProvision]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsOpenWarning(true);
  };

  const handleStoreData = async () => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("firstPrice", firstPrice);
      formData.append("promoPrice", promoPrice);
      formData.append(`provisions`, JSON.stringify(productProvisions));
      formData.append(`bonus`, JSON.stringify(productBonus));

      await axios.patch(`/api/admin/promos/${slug}/product/patch`, formData);

      router.push(`/admin/promos/${slug}`);

      setTimeout(() => {
        toast("Produk berhasil diubah");
      }, 1000);
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error.response.data.message);
    }
  };

  return (
    <section className="admin__container">
      <div className="admin__container-body">
        <ToastContainer />

        <Title title={`Edit Produk ${name}`} />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full bg-white p-5 rounded shadow"
          >
            <PromoEditProvisions
              form={form}
              productProvisions={productProvisions}
              handleDecrease={handleDecrease}
              handleSetQuantity={handleSetQuantity}
              handleIncrease={handleIncrease}
              handleDelete={handleDelete}
              subTotalProvision={subTotalProvision}
              setIsOpenProduct={setIsOpenProduct}
              setStatus={setStatus}
            />

            <PromoEditBonus
              form={form}
              productBonus={productBonus}
              handleDecrease={handleDecrease}
              handleSetQuantity={handleSetQuantity}
              handleIncrease={handleIncrease}
              handleDelete={handleDelete}
              subTotalBonus={subTotalBonus}
              setIsOpenProduct={setIsOpenProduct}
              setStatus={setStatus}
            />

            <div className="lg:flex block gap-3 w-full mt-5">
              <FormField
                control={form.control}
                name="firstPrice"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-gray-700">Harga Awal</FormLabel>
                    <FormControl>
                      <Input
                        className="mb-3"
                        placeholder="Harga jual"
                        {...field}
                        value={firstPrice}
                        onChange={(e) =>
                          handleSetNumber(e.target.value, setFirstPrice)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="promoPrice"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-gray-700">Harga Promo</FormLabel>
                    <FormControl>
                      <Input
                        className="mb-3 w-full"
                        placeholder="Harga pokok"
                        {...field}
                        value={promoPrice}
                        onChange={(e) =>
                          handleSetNumber(e.target.value, setPromoPrice)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="w-full flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/admin/promos/${slug}`)}
              >
                Kembali
              </Button>
              <Button type="submit" variant="default">
                Simpan
              </Button>
            </div>
          </form>
        </Form>

        <PromoAddOpenProduct
          isOpen={isOpenProduct}
          setIsOpen={setIsOpenProduct}
          productProvisions={productProvisions}
          setProductProvisions={setProductProvisions}
          productBonus={productBonus}
          setProductBonus={setProductBonus}
          status={status}
          handleSumSubTotal={handleSumSubTotal}
        />

        <WarningAlert
          isOpen={isOpenWarning}
          setIsOpen={setIsOpenWarning}
          isLoading={isLoading}
          handleStoreData={handleStoreData}
        />
      </div>
    </section>
  );
};

export default PromoEditProducts;
