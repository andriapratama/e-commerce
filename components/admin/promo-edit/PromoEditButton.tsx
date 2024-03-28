"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PromoType } from "@/types/PromoType";

import PromoEditData from "./PromoEditData";
import PromoEditImage from "./PromoEditImage";

interface Props {
  promo: PromoType;
}

const PromoEditButton: React.FC<Props> = ({ promo }) => {
  const [isOpenEditData, setIsOpenEditData] = useState<boolean>(false);
  const [isOpenEditImage, setIsOpenEditImage] = useState<boolean>(false);

  const router = useRouter();

  const params: { id: string | string[] } = useParams();

  const slug: string | string[] = params.id;
  return (
    <React.Fragment>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm">Edit</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setIsOpenEditData(true)}
          >
            Data Promo
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setIsOpenEditImage(true)}
          >
            Gambar
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => router.push(`/admin/promos/${slug}/edit`)}
          >
            Produk
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <PromoEditData
        promo={promo}
        isOpen={isOpenEditData}
        setIsOpen={setIsOpenEditData}
      />

      <PromoEditImage isOpen={isOpenEditImage} setIsOpen={setIsOpenEditImage} />
    </React.Fragment>
  );
};

export default PromoEditButton;
