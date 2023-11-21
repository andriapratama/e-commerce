"use client";

import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import ButtonLoading from "@/components/ButtonLoading";

interface CheckoutWarningProps {
  isOpen: boolean;
}

const CheckoutWarning: React.FC<CheckoutWarningProps> = ({ isOpen }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Warning</AlertDialogTitle>
          <AlertDialogDescription>
            Please complete your profile to continue the checkout process.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            onClick={() => {
              router.push("/profile");
              setIsLoading(true);
            }}
            disabled={isLoading}
          >
            {isLoading ? <ButtonLoading /> : "Complete your profile"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CheckoutWarning;
