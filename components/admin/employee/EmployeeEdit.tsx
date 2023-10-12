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
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import ButtonLoading from "@/components/ButtonLoading";
import axios from "axios";
import { EditEmployeeType } from "@/types/admin/Employees";

const formSchema = z.object({
  name: z.string().min(3, { message: "Username minimal 3 karakter" }),
  username: z.string().min(3, { message: "Username minimal 3 karakter" }),
  role: z.string().min(1, { message: "Pilih role pegawai" }),
});

interface EmployeeEditProps {
  editEmployee: EditEmployeeType;
  setEditEmployee: Dispatch<SetStateAction<EditEmployeeType>>;
  ShowEmployees: () => void;
}

const EmployeeEdit: React.FC<EmployeeEditProps> = ({
  editEmployee,
  setEditEmployee,
  ShowEmployees,
}) => {
  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      name: name,
      username: username,
      role: role,
    },
  });

  useEffect(() => {
    setName(editEmployee.name);
    setUsername(editEmployee.username);
    setRole(editEmployee.role);
  }, [editEmployee]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      await axios.patch(`/api/admin/employees/${editEmployee.id}`, {
        name: values.name.toLowerCase(),
        username: values.username.toLowerCase(),
        role: values.role,
      });

      form.reset();

      toast.success("Data karyawan berhasil diubah!");

      ShowEmployees();
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="md:w-2/3 w-full admin__card h-full"
      >
        <h2 className="admin__form-title">Edit Pegawai</h2>
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
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih role pegawai" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="super admin">Super Admin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="!mt-1" />
            </FormItem>
          )}
        />

        <div className="flex gap-3 ">
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              setEditEmployee({
                id: "",
                name: "",
                username: "",
                role: "",
              })
            }
            disabled={loading}
          >
            Batal
          </Button>
          <Button disabled={loading} size="sm" type="submit">
            {loading ? <ButtonLoading /> : "Simpan"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EmployeeEdit;
