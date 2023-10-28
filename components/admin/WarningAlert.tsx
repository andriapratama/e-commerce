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
  isOpenWarning: boolean;
  setIsOpenWarning: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  handleSendData: () => void;
}

const WarningAlert: React.FC<WarningAlertProps> = ({
  isOpenWarning,
  setIsOpenWarning,
  isLoading,
  handleSendData,
}) => {
  return (
    <AlertDialog open={isOpenWarning}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Apakah anda yakin ingin menyiman data?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => setIsOpenWarning(false)}
            disabled={isLoading}
          >
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleSendData()}
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
