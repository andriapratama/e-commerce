"use client";

import React, { Dispatch, SetStateAction } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ButtonLoading from "../ButtonLoading";
import { Button } from "../ui/button";

interface AlertProps {
  status: "warning" | "success";
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
  desc: string;
  handlePush: () => void;
  isLoading?: boolean;
}

const Alert: React.FC<AlertProps> = ({
  status,
  isOpen,
  setIsOpen,
  title,
  desc,
  handlePush,
  isLoading,
}) => {
  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={status === "warning" ? setIsOpen : handlePush}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{desc}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {status === "warning" ? (
            <Button
              variant="outline"
              disabled={isLoading}
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
          ) : null}
          <Button disabled={isLoading} onClick={handlePush}>
            {isLoading ? (
              <ButtonLoading />
            ) : status === "warning" ? (
              "Continue"
            ) : (
              "Back"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Alert;
