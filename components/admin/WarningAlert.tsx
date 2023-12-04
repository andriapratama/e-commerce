"use client";

import React, { Dispatch, SetStateAction } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ButtonLoading from "../ButtonLoading";

interface WarningAlertProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  handleStoreData: () => void;
  title?: string;
}

const WarningAlert: React.FC<WarningAlertProps> = ({
  isOpen,
  setIsOpen,
  isLoading,
  handleStoreData,
  title,
}) => {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {title ? title : "Apakah anda yakin ingin menyiman data?"}
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleStoreData()}
            disabled={isLoading}
          >
            {isLoading ? <ButtonLoading /> : "Ya"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default WarningAlert;
