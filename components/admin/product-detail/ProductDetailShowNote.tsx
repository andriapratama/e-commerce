"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const ProductDetailShowNote = ({
  note,
  invoice,
}: {
  note: string;
  invoice?: string;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Buka
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Catatan</DialogTitle>
          <DialogDescription>
            {note}
            {invoice ? (
              <Link
                className="ml-1 hover:text-blue-500"
                href={`/admin/orders/${invoice}`}
              >
                {invoice}
              </Link>
            ) : null}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailShowNote;
