"use client";

import React, { Dispatch, SetStateAction } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";

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
          height={1000}
          width={300}
          className="object-cover h-[90vh] w-full"
        />
      </DialogContent>
    </Dialog>
  );
};

export default ShowImage;
