"use client";

import Image from "next/image";
import React, { Dispatch, SetStateAction } from "react";

import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ShowImageProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  image: string;
}

const ShowImage: React.FC<ShowImageProps> = ({ isOpen, setIsOpen, image }) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-full h-fit">
        <Image
          src={image}
          alt="preview"
          height={2000}
          width={600}
          className="object-cover h-[90vh] w-full"
        />
      </DialogContent>
    </Dialog>
  );
};

export default ShowImage;
