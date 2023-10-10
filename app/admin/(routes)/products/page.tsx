import Title from "@/components/admin/Title";
import ProductTable from "@/components/admin/product/ProductTable";
import { ProductType } from "@/types/ProductType";
import React from "react";

const _data: ProductType[] = [
  {
    id: "1",
    image: "wine.webp",
    name: "jim beam kentucky straight",
    category: "gin",
    cost: 1000000,
    price: 1200000,
    stock: 100,
    status: "active",
    sale: "false",
  },
  {
    id: "2",
    image: "wine.webp",
    name: "jim beam kentucky straight",
    category: "gin",
    cost: 1000000,
    price: 1200000,
    stock: 100,
    status: "active",
    sale: "false",
  },
  {
    id: "3",
    image: "wine.webp",
    name: "jim beam kentucky straight",
    category: "gin",
    cost: 1000000,
    price: 1200000,
    stock: 100,
    status: "active",
    sale: "false",
  },
];

const Product = () => {
  return (
    <section className="admin__container">
      <div className="admin__container-body">
        <Title
          title="Produk"
          nameBtn="Tambah Produk"
          link="/admin/products/1"
        />
        <ProductTable data={_data} />
      </div>
    </section>
  );
};

export default Product;
