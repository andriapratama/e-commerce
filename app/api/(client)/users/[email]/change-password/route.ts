import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";

export const PATCH = async (
  req: Request,
  { params }: { params: { email: string } }
) => {
  try {
    if (!params.email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const findUser = await prismadb.user.findFirst({
      where: {
        email: params.email,
        role: "member",
      },
    });

    if (!findUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const body = await req.json();

    const schema = z.object({
      oldPassword: z.string().min(1).min(6),
      newPassword: z.string().min(1).min(6),
    });

    const response = schema.safeParse(body);

    if (!response.success) {
      const { errors } = response.error;

      return NextResponse.json(
        {
          message: "Invalid request",
          errors: errors,
        },
        { status: 400 }
      );
    }

    const { oldPassword, newPassword } = response.data;

    const checkOldPassword = await bcrypt.compare(
      oldPassword,
      findUser.password as string
    );

    if (!checkOldPassword) {
      return NextResponse.json(
        { message: "Old password is wrong" },
        { status: 400 }
      );
    }

    const passwordHash = bcrypt.hashSync(newPassword, 10);

    await prismadb.user.update({
      where: {
        id: findUser.id,
      },
      data: {
        password: passwordHash,
      },
    });

    return NextResponse.json(
      { message: "Password is changed" },
      { status: 200 }
    );
  } catch (error) {
    console.log("[USER_CHANGE_PASSWORD] " + error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
