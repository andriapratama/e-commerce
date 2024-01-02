"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TableHeader,
} from "@/components/ui/table";
import { ConvertIDR } from "@/utils/ConvertIDR";
import { Dispatch, SetStateAction } from "react";
import { ProductInputType } from "../promo-add/PromoAddForm";

interface Props {
  form: any;
  productProvisions: ProductInputType[];
  handleDecrease: (status: "provision" | "bonus", index: number) => void;
  handleSetQuantity: (
    value: number,
    status: "provision" | "bonus",
    index: number
  ) => void;
  handleIncrease: (status: "provision" | "bonus", index: number) => void;
  handleDelete: (status: "provision" | "bonus", index: number) => void;
  subTotalProvision: number;
  setIsOpenProduct: Dispatch<SetStateAction<boolean>>;
  setStatus: Dispatch<SetStateAction<"provision" | "bonus">>;
}

const PromoEditProvisions: React.FC<Props> = ({
  form,
  productProvisions,
  handleDecrease,
  handleSetQuantity,
  handleIncrease,
  handleDelete,
  subTotalProvision,
  setIsOpenProduct,
  setStatus,
}) => {
  return (
    <FormField
      control={form.control}
      name="productProvisions"
      render={({ field }) => (
        <FormItem className="w-full border-b pb-5">
          <FormLabel>Syarat Produk</FormLabel>
          <br />

          <Table className="h-full bg-white rounded mt-1 mb-2">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Gambar</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead className="text-center">Jumlah</TableHead>
                <TableHead className="text-center">Sub Total</TableHead>
                <TableHead className="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productProvisions.map((product: ProductInputType, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={50}
                        height={50}
                        className="object-contain h-[50px] w-auto"
                        priority
                      />
                    </TableCell>
                    <TableCell className="capitalize">{product.name}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          onClick={() => {
                            handleDecrease("provision", index);
                          }}
                          disabled={product.quantity <= 1 ? true : false}
                        >
                          -
                        </Button>
                        <Input
                          type="text"
                          className="text-center w-[100px] h-9"
                          value={product.quantity}
                          onChange={(e) =>
                            handleSetQuantity(
                              parseInt(e.target.value),
                              "provision",
                              index
                            )
                          }
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          onClick={() => handleIncrease("provision", index)}
                          disabled={product.quantity >= 1000 ? true : false}
                        >
                          +
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {ConvertIDR(product.subTotal)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        type="button"
                        onClick={() => handleDelete("provision", index)}
                      >
                        Hapus
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableBody className="font-semibold">
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  Total
                </TableCell>
                <TableCell className="text-center">
                  {ConvertIDR(subTotalProvision)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <FormMessage />

          <Button
            variant="default"
            size="sm"
            onClick={() => {
              setIsOpenProduct(true);
              setStatus("provision");
            }}
            type="button"
          >
            Tambah
          </Button>
        </FormItem>
      )}
    />
  );
};

export default PromoEditProvisions;
