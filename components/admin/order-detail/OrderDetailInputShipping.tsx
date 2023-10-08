"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Label } from "@radix-ui/react-label";

const OrderDetailInputShipping = () => {
  const [shipping, setShipping] = useState<string>("");
  const [errosMessage, setErrorMessage] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  const handleSetShipping = (value: string) => {
    if (value.match(/[a-z]/g)) {
      return null;
    } else {
      setErrorMessage("");
      setShipping(value);
    }
  };

  const handleSubmit = () => {
    if (!shipping) {
      setErrorMessage("Biaya pengiriman tidak boleh kosong");
    } else if (shipping.length < 4) {
      setErrorMessage("Minimal biaya Rp. 1.000");
    } else {
      console.log("masuk");
      setOpen(false);
      setShipping("");
    }
  };

  const handleCancel = () => {
    setOpen(false);
    setShipping("");
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full" onClick={() => setShipping("")}>
          Masukkan Biaya Pengiriman
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Label>Biaya Pengiriman</Label>
        <Input
          type="text"
          placeholder="Masukkan biaya pengiriman"
          value={shipping}
          onChange={(e) => handleSetShipping(e.target.value)}
        />
        {errosMessage ? (
          <div className="text-sm font-medium -mt-3 text-red-500">
            {errosMessage}
          </div>
        ) : null}
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
  );
};

export default OrderDetailInputShipping;
