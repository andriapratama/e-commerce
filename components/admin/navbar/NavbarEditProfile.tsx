"use client";

import { z } from "zod";
import axios from "axios";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import WarningAlert from "../WarningAlert";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LoadingGif from "@/components/LoadingGif";
import { zodResolver } from "@hookform/resolvers/zod";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setNameSession: Dispatch<SetStateAction<string>>;
}

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Nama harus diisi.")
    .min(3, "Nama minimal 3 karakter")
    .max(15, "Nama maksimal 15 karakter"),
  username: z
    .string()
    .min(1, "Username harus diisi.")
    .min(3, "Username minimal 3 karakter.")
    .max(15, "Username maksimal 15 karakter"),
});

const NavbarEditProfile: React.FC<Props> = ({
  isOpen,
  setIsOpen,
  setNameSession,
}) => {
  const [prevName, setPrevName] = useState<string>("");
  const [prevUsername, setPrevUsername] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [isOpenWarning, setIsOpenWarning] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(true);

  const { update } = useSession();

  const getProfile = useCallback(async () => {
    try {
      const res = await axios.get(`/api/admin/employees/profile/get`);

      const data: { name: string; username: string } = res.data.data;

      setPrevName(data.name);
      setPrevUsername(data.username);
      setName(data.name);
      setUsername(data.username);

      setIsLoadingContent(false);
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  }, []);

  useEffect(() => {
    if (isOpen === true && prevName === "") getProfile();
  }, [isOpen]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      name: name,
      username: username,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (values.name !== prevName || values.username !== prevUsername) {
      setIsOpenWarning(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleStoreData = async () => {
    try {
      setIsLoading(true);

      await axios.patch(`/api/admin/employees/profile/patch`, {
        name: name,
        username: username,
      });

      update({ name: name, username: username });

      setNameSession(name);

      setIsOpenWarning(false);
      setIsOpen(false);
      setIsLoading(false);

      setPrevName("");
      setPrevUsername("");
      setName("");
      setUsername("");

      toast.success("Data profil berhasil diubah");
    } catch (error: any) {
      toast.error(error.response.data.message);
      setIsLoading(false);
    }
  };
  return (
    <React.Fragment>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {isLoadingContent ? (
          <DialogContent
            className="!bg-transparent !max-w-full !h-screen flex justify-center items-center"
            closeButton={false}
          >
            <LoadingGif className="!h-6 !w-6" />
          </DialogContent>
        ) : (
          <DialogContent className="sm:max-w-[450px] lg:max-w-[400px]">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                <DialogHeader className="mb-5">
                  <DialogTitle>Edit Data Profil</DialogTitle>
                </DialogHeader>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-gray-700">Nama</FormLabel>
                      <FormControl>
                        <Input
                          className="mb-3"
                          placeholder="Masukkan nama"
                          {...field}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-gray-700">Username</FormLabel>
                      <FormControl>
                        <Input
                          className="mb-3 w-full"
                          placeholder="Masukkan username"
                          {...field}
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="submit">Simpan</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        )}
      </Dialog>

      <WarningAlert
        isOpen={isOpenWarning}
        setIsOpen={setIsOpenWarning}
        isLoading={isLoading}
        handleStoreData={handleStoreData}
      />
    </React.Fragment>
  );
};

export default NavbarEditProfile;
