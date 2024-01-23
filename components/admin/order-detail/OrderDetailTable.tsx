import React from "react";
import Image from "next/image";
import { ConvertIDR } from "@/utils/ConvertIDR";
import { OrderDetailType, OrderType } from "@/types/admin/OrderType";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface OrderDetailTableProps {
  order: OrderType;
}

const OrderDetailTable: React.FC<OrderDetailTableProps> = ({ order }) => {
  const orderDetail: OrderDetailType[] = order.orderDetail;
  return (
    <>
      <div className="w-full h-10 flex justify-center items-center bg-gray-200">
        <span className="font-medium text-base text-gray-800">
          Detail Produk
        </span>
      </div>
      <Table className="bg-white rounded-md mb-5 text-base">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center w-[2%]">#</TableHead>
            <TableHead className="text-center w-[13%]">Gambar</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Harga/Unit</TableHead>
            <TableHead>Jumlah</TableHead>
            <TableHead>Sub Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orderDetail.length > 0 ? (
            orderDetail.map((data: OrderDetailType, index) => (
              <TableRow key={data.name}>
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell className="flex justify-center">
                  {data.product && (
                    <Image
                      src={data.product.image}
                      alt={data.name}
                      width={200}
                      height={200}
                      className="object-contain h-[60px] w-auto"
                    />
                  )}
                  {data.promo && (
                    <Image
                      src={data.promo.image}
                      alt={data.name}
                      width={300}
                      height={200}
                      className="object-contain h-[60px] w-auto"
                    />
                  )}
                </TableCell>
                <TableCell>{data.name}</TableCell>
                <TableCell>{ConvertIDR(data.price)}</TableCell>
                <TableCell>{data.quantity}</TableCell>
                <TableCell>{ConvertIDR(data.total)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Data kosong
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default OrderDetailTable;
