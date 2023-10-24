"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

interface BackButtonProps {
  name: string;
  slug: string;
  price: string;
  cost: string;
  linkGojek: string;
  description: string;
  image: string;
  isLoading: boolean;
}

const BackButton = ({
  name,
  slug,
  price,
  cost,
  linkGojek,
  description,
  image,
  isLoading,
}: BackButtonProps) => {
  const router = useRouter();

  if (name || slug || price || cost || linkGojek || description || image) {
    return (
      <AlertDialog>
        <AlertDialogTrigger className="!rounded-md !text-sm !font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
          Kembali
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Data yang anda masukkan di halaman ini akan terhapus.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => router.back()}>
              Ya
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  } else {
    return (
      <Button type="button" disabled={isLoading} onClick={() => router.back()}>
        Kembali
      </Button>
    );
  }
};

export default BackButton;
