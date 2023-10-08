import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { ConvertIDR } from "@/utils/ConvertIDR";

interface OrderDetailTableProps {
  image: string;
  name: string;
  price: number;
  quantity: number;
  subTotal: number;
}

const _data: OrderDetailTableProps[] = [
  {
    image: "wine.webp",
    name: "Carbenet Suvignon",
    price: 1000000,
    quantity: 2,
    subTotal: 2000000,
  },
  {
    image: "wine.webp",
    name: "Carbenet Suvignon 1",
    price: 1000000,
    quantity: 2,
    subTotal: 2000000,
  },
  {
    image: "wine.webp",
    name: "Carbenet Suvignon 2",
    price: 1000000,
    quantity: 2,
    subTotal: 2000000,
  },
];

const OrderDetailTable = () => {
  return (
    <>
      <div className="w-full h-10 flex justify-center items-center bg-gray-200 mt-10">
        <span className="font-medium md:text-sm text-gray-800">
          Detail Produk
        </span>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Gambar</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Harga/Unit</TableHead>
            <TableHead>Jumlah</TableHead>
            <TableHead>Sub Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {_data.map((data, index) => (
            <TableRow key={data.name}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <Image
                  src={`/${data.image}`}
                  alt={data.name}
                  width={50}
                  height={50}
                  className="object-contain"
                />
              </TableCell>
              <TableCell>{data.name}</TableCell>
              <TableCell>{ConvertIDR(data.price)}</TableCell>
              <TableCell>{data.quantity}</TableCell>
              <TableCell>{ConvertIDR(data.subTotal)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default OrderDetailTable;
