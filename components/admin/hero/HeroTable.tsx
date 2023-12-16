"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { HeroType } from "@/types/HeroType";
import { toast } from "react-toastify";
import axios from "axios";
import ButtonLoading from "@/components/ButtonLoading";
import LoadingGif from "@/components/LoadingGif";
import WarningAlert from "../WarningAlert";

interface HeroTableProps {
  heros: HeroType[];
  setHeros: Dispatch<SetStateAction<HeroType[]>>;
  getHeros: () => void;
}

const HeroTable: React.FC<HeroTableProps> = ({ heros, setHeros, getHeros }) => {
  const [image, setImage] = useState<string>("");
  const [isOpenImage, setIsOpenImage] = useState<boolean>(false);
  const [heroId, setHeroId] = useState<string>("");
  const [isLoadingDelete, setIsLoadingDelete] = useState<boolean>(false);
  const [isOpenWarningDelete, setIsOpenWarningDelete] =
    useState<boolean>(false);

  useEffect(() => {
    for (let i = 0; i < heros.length; i++) {
      heros[i].isLoading = false;
    }
  }, [heros]);

  const selectItemComponent = () => {
    let selectItem = [];

    for (let i = 0; i < heros.length; i++) {
      selectItem.push(
        <SelectItem value={`${i + 1}`} key={i}>
          {i + 1}
        </SelectItem>
      );
    }

    return selectItem;
  };

  const handleChangePosition = async (
    firstPosition: number,
    secondPosition: string
  ) => {
    const secondValue = parseInt(secondPosition);

    const firstIndex = heros
      .map((hero) => hero.position)
      .indexOf(firstPosition);

    const secondIndex = heros.map((hero) => hero.position).indexOf(secondValue);

    let newHeros = [...heros];
    newHeros[firstIndex].position = secondValue;
    newHeros[secondIndex].position = firstPosition;

    newHeros.sort((a, b) => a.position - b.position);

    setHeros(newHeros);

    try {
      await axios.patch("/api/admin/hero/patch", {
        firstPosition,
        secondPosition: parseInt(secondPosition),
      });
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoadingDelete(true);

      await axios.delete(`/api/admin/hero/${heroId}/delete`);

      getHeros();

      toast.success("Gambar hero telah dihapus");

      setHeroId("");

      setIsLoadingDelete(false);
      setIsOpenWarningDelete(false);
    } catch (error: any) {
      toast.error(error.response.data.message);
      setIsLoadingDelete(false);
      setIsOpenWarningDelete(false);
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-[50%]">
        <Table className="bg-white rounded-md mt-10">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Gambar</TableHead>
              <TableHead className="text-center">Position</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {heros.length > 0 ? (
              heros.map((hero: HeroType, index) => (
                <TableRow key={index}>
                  <TableCell className="flex justify-center">
                    <Image
                      src={hero.image}
                      alt={`Hero ` + index}
                      width={300}
                      height={100}
                      className="object-contain h-[100px] w-auto cursor-pointer"
                      priority
                      onClick={() => {
                        setImage(hero.image);
                        setIsOpenImage(true);
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      <Select
                        value={hero.position.toString()}
                        onValueChange={(prev) =>
                          handleChangePosition(hero.position, prev)
                        }
                      >
                        <SelectTrigger className="w-[70px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="!max-w-[70px]">
                          <SelectGroup>{selectItemComponent()}</SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="destructive"
                      size="sm"
                      type="button"
                      onClick={() => {
                        setIsOpenWarningDelete(true);
                        setHeroId(hero.id);
                      }}
                    >
                      Hapus
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  Data kosong
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <Dialog open={isOpenImage} onOpenChange={setIsOpenImage}>
          <DialogContent
            className="!max-w-none flex justify-center bg-transparent border-none shadow-none"
            onClick={() => setIsOpenImage(false)}
          >
            <Image
              src={image}
              alt="preview"
              width={2000}
              height={2000}
              className="object-contain md:!h-[80vh] md:!w-auto !h-auto !w-full"
              onClick={(e) => e.stopPropagation()}
            />
          </DialogContent>
        </Dialog>

        <WarningAlert
          isOpen={isOpenWarningDelete}
          setIsOpen={setIsOpenWarningDelete}
          isLoading={isLoadingDelete}
          handleStoreData={handleDelete}
          title="Apakah anda yakin ingin menghapus gambar?"
        />
      </div>
    </div>
  );
};

export default HeroTable;
