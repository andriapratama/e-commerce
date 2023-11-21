"use client";

import { CartType } from "@/types/CartType";
import React, { useEffect, useState } from "react";

import CheckoutPayment from "./CheckoutPayment";
import CheckoutTotal from "./CheckoutTotal";
import CheckoutTable from "./CheckoutTable";
import { Textarea } from "@/components/ui/textarea";
import { ToastContainer } from "react-toastify";
import { UserType } from "@/types/UserType";
import CheckoutWarning from "./CheckoutWarning";

interface CheckoutContentProps {
  carts?: CartType[];
  user?: UserType;
}

const CheckoutContent: React.FC<CheckoutContentProps> = ({ carts, user }) => {
  const [note, setNote] = useState<string>("");
  const [isOpenWarning, setIsOpenWarning] = useState<boolean>(false);

  const handleCheckPofileUser = () => {
    if (!user?.address || !user.phone) {
      setIsOpenWarning(true);
    } else {
      setIsOpenWarning(false);
    }
  };

  useEffect(() => {
    handleCheckPofileUser();
  }, [user]);

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

      <CheckoutWarning isOpen={isOpenWarning} />
    </React.Fragment>
  );
};

export default CheckoutContent;
