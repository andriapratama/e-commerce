"use client";

import { CartType } from "@/types/CartType";
import React, { useState } from "react";

import CheckoutPayment from "./CheckoutPayment";
import CheckoutTotal from "./CheckoutTotal";
import CheckoutTable from "./CheckoutTable";
import { Textarea } from "@/components/ui/textarea";
import { ToastContainer } from "react-toastify";

interface CheckoutContentProps {
  carts?: CartType[];
}

const CheckoutContent: React.FC<CheckoutContentProps> = ({ carts }) => {
  const [note, setNote] = useState<string>("");

  return (
    <React.Fragment>
      <ToastContainer />
      <div className="w-full flex justify-center mt-[50px] font-serif">
        <div className="w-[80%]">
          <CheckoutTable carts={carts} />

          <Textarea
            className="mb-2 mt-10 resize-none"
            placeholder="Input note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <div className="w-full grid grid-cols-2 gap-5">
            <CheckoutTotal carts={carts} />
            <CheckoutPayment note={note} />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default CheckoutContent;
