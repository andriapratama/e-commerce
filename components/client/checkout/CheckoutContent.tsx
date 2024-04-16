"use client";

import React, { useEffect, useRef, useState } from "react";

import { Textarea } from "@/components/ui/textarea";
import { CartType } from "@/types/CartType";
import { UserType } from "@/types/UserType";
import AutosizeTextArea from "@/utils/AutosizeTextArea";

import CheckoutPayment from "./CheckoutPayment";
import CheckoutTable from "./CheckoutTable";
import CheckoutTotal from "./CheckoutTotal";
import CheckoutWarning from "./CheckoutWarning";

interface CheckoutContentProps {
  carts?: CartType[];
  user?: UserType;
}

const CheckoutContent: React.FC<CheckoutContentProps> = ({ carts, user }) => {
  const [note, setNote] = useState<string>("");
  const [isOpenWarning, setIsOpenWarning] = useState<boolean>(false);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  AutosizeTextArea(textAreaRef.current, note);

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
      <div className="w-full lg:min-h-[calc(100vh-536px)] md:min-h-[calc(100vh-488px)] lg:mt-[150px] md:mt-[100px] mt-[80px]">
        <div className="w-full text-center text-2xl font-serif font-semibold mb-3 capitalize">
          Checkout
        </div>

        <div className="w-full flex justify-center mt-10 font-serif">
          <div className="lg:w-[80%] w-[90%]">
            <CheckoutTable carts={carts} />

            <Textarea
              className="mb-2 mt-10 resize-none"
              placeholder="Input note (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              ref={textAreaRef}
            />

            <div className="w-full grid md:grid-cols-2 grid-cols-1 gap-5">
              <CheckoutTotal carts={carts} />
              <CheckoutPayment note={note} />
            </div>
          </div>
        </div>
      </div>

      <CheckoutWarning isOpen={isOpenWarning} />
    </React.Fragment>
  );
};

export default CheckoutContent;
