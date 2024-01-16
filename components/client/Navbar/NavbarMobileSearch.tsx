"use client";

import { Search } from "lucide-react";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import NavbarSearch from "./NavbarSearch";
import MobileLogo from "../MobileLogo";

const NavbarMobileSearch = () => {
  const [isOpenSearch, setIsOpenSearch] = useState<boolean>(false);
  return (
    <React.Fragment>
      <Search
        width={25}
        height={25}
        className="lg:hidden block text-primary-color"
        onClick={() => setIsOpenSearch(true)}
      />

      <Dialog open={isOpenSearch} onOpenChange={setIsOpenSearch}>
        <DialogContent className="!top-[30%] !p-0 !pb-5 font-serif">
          <DialogHeader className="pt-5 px-5"></DialogHeader>
          <DialogTitle>
            <MobileLogo />
          </DialogTitle>
          <DialogTitle className="w-full text-center uppercase mt-2">
            Search
          </DialogTitle>

          <NavbarSearch className="block lg:hidden px-2" />
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default NavbarMobileSearch;
