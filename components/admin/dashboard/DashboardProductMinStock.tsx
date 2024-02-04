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
import { ProductMinStockType } from "@/types/ProductType";
import { useRouter } from "next/navigation";

interface Props {
  productsMinStock: ProductMinStockType[];
}

const DashboardProductMinStock: React.FC<Props> = ({ productsMinStock }) => {
  const router = useRouter();

  if (productsMinStock.length > 0) {
    return (
      <div className="w-full h-fit rounded-xl border shadow p-6 bg-white">
        <div className="font-medium mb-5">Sisa Stok Produk</div>

        <Table className="bg-white">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[10%]">Gambar</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead className="text-center w-[10%]">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productsMinStock.map((product, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={200}
                    height={200}
                    className="object-contain w-[60px] h-[60px] cursor-pointer"
                    priority
                    onClick={() =>
                      router.push(`/admin/products/${product.slug}`)
                    }
                  />
                </TableCell>
                <TableCell className="capitalize">
                  <span
                    className="cursor-pointer hover:text-blue-500"
                    onClick={() =>
                      router.push(`/admin/products/${product.slug}`)
                    }
                  >
                    {product.name}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  {product.totalStock}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  } else {
    return null;
  }
};

export default DashboardProductMinStock;
