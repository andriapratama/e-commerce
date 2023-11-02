"use client";

import React, { Dispatch, SetStateAction } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface EmployeeAddResultProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  username: string;
  setUsername: Dispatch<SetStateAction<string>>;
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
}

const EmployeeAddResult: React.FC<EmployeeAddResultProps> = ({
  isOpen,
  setIsOpen,
  name,
  setName,
  username,
  setUsername,
  password,
  setPassword,
}) => {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="!w-[300px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Data Pegawai</AlertDialogTitle>
        </AlertDialogHeader>
        <div>
          Nama: <span className="font-semibold">{name}</span>
        </div>
        <div>
          Username: <span className="font-semibold">{username}</span>
        </div>
        <div>
          Password: <span className="font-semibold">{password}</span>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setIsOpen(false);
              setName("");
              setUsername("");
              setPassword("");
            }}
          >
            Tutup
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EmployeeAddResult;
