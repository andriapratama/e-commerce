"use client";

import React from "react";
import WarningAlert from "../WarningAlert";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
import { ConvertIDR } from "@/utils/ConvertIDR";
import { Dispatch, SetStateAction } from "react";
import { useODEditTransactionHook } from "@/hooks/admin/OrderDetailHook";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";

interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  subTotal: number;
  tax: number;
  shipping: number | null;
  discount: number | null;
  grandTotal: number;
  getOrder: () => void;
}

const OrderDetailEditTransaction: React.FC<Props> = ({
  isOpen,
  setIsOpen,
  subTotal,
  tax,
  shipping,
  discount,
  getOrder,
}) => {
  const {
    value,
    errorShipping,
    errorDiscount,
    handleShipping,
    handleDiscount,
    handleSubmit,
    handleCancel,
    isOpenWarningAlert,
    setIsOpenWarningAlert,
    isLoadingStore,
    handleStoreData,
  } = useODEditTransactionHook(
    setIsOpen,
    shipping,
    discount,
    subTotal,
    tax,
    getOrder
  );

  return (
    <React.Fragment>
      <Dialog open={isOpen} onOpenChange={handleCancel}>
        <DialogContent className="!w-[450px] !gap-2">
          <div className="flex justify-between items-center mt-5">
            <Label>Total</Label>
            <Input
              type="text"
              defaultValue={ConvertIDR(subTotal)}
              className="w-[250px] text-end"
              disabled
            />
          </div>

          <div className="flex justify-between items-center">
            <Label>Pajak (11%)</Label>
            <Input
              type="text"
              placeholder="0.00"
              defaultValue={ConvertIDR(tax)}
              className="w-[250px] text-end"
              disabled
            />
          </div>

          <div className="w-full">
            <div className="flex justify-between items-center">
              <Label>Biaya Pengiriman</Label>
              <Input
                type="text"
                placeholder="0"
                value={value.shipping.toString()}
                onChange={(e) => handleShipping(e.target.value)}
                className="w-[250px] text-end"
              />
            </div>
            {errorShipping.error ? (
              <div className="text-sm font-medium text-red-500">
                {errorShipping.message}
              </div>
            ) : null}
          </div>

          <div className="w-full">
            <div className="flex justify-between items-center">
              <Label>Diskon</Label>
              <Input
                type="text"
                placeholder="0"
                value={value.discount.toString()}
                onChange={(e) => handleDiscount(e.target.value)}
                className="w-[250px] text-end"
              />
            </div>
            {errorDiscount.error ? (
              <div className="text-sm font-medium text-red-500">
                {errorDiscount.message}
              </div>
            ) : null}
          </div>

          <div className="flex justify-between items-center">
            <Label>Grand Total</Label>
            <Input
              type="text"
              value={ConvertIDR(value.grandTotal)}
              className="w-[250px] text-end"
              disabled
            />
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => handleCancel()}>
              Batal
            </Button>
            <Button size="sm" onClick={() => handleSubmit()}>
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <WarningAlert
        isOpen={isOpenWarningAlert}
        setIsOpen={setIsOpenWarningAlert}
        isLoading={isLoadingStore}
        handleStoreData={handleStoreData}
      />
    </React.Fragment>
  );
};

export default OrderDetailEditTransaction;
