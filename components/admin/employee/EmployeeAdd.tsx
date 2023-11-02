"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import axios from "axios";
import React from "react";
import WarningAlert from "../WarningAlert";
import EmployeeAddResult from "./EmployeeAddResult";

const formSchema = z.object({
  name: z.string().min(3, { message: "Username minimal 3 karakter" }),
  username: z.string().min(3, { message: "Username minimal 3 karakter" }),
  role: z.string().min(1, { message: "Pilih role pegawai" }),
});

interface EmployeeAddProps {
  ShowEmployees: () => void;
}

const EmployeeAdd: React.FC<EmployeeAddProps> = ({ ShowEmployees }) => {
  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpenWarning, setIsOpenWarning] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      name: name,
      username: username,
      role: role,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsOpenWarning(true);
  };

  const handleSendData = async () => {
    try {
      setIsLoading(true);

      const res = await axios.post("/api/admin/employees", {
        name: name.toLowerCase(),
        username: username.toLowerCase(),
        role: role,
      });

      const data = res.data.data;

      setName(data.name);
      setUsername(data.username);
      setRole("");
      setPassword(data.password);
      setIsOpen(true);

      toast.success("Data karyawan berhasil disimpan!");

      ShowEmployees();
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
      setIsOpenWarning(false);
    }
  };
  return (
    <React.Fragment>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="md:w-2/3 w-full admin__card h-full"
        >
          <h2 className="admin__form-title">Tambah Pegawai</h2>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
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
              <FormItem>
                <FormLabel className="text-gray-700">Username</FormLabel>
                <FormControl>
                  <Input
                    className="mb-3"
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
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="mb-3">
                <FormLabel className="text-gray-700">Role</FormLabel>
                <Select onValueChange={setRole} value={role}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih role pegawai" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="superAdmin">Super Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="!mt-1" />
              </FormItem>
            )}
          />

          <Button type="submit">Simpan</Button>
        </form>
      </Form>

      <WarningAlert
        isOpenWarning={isOpenWarning}
        setIsOpenWarning={setIsOpenWarning}
        isLoading={isLoading}
        handleSendData={handleSendData}
      />

      <EmployeeAddResult
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        name={name}
        setName={setName}
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
      />
    </React.Fragment>
  );
};

export default EmployeeAdd;
