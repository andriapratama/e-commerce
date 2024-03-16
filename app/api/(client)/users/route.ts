import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { transporter } from "@/lib/nodemailer";
import { TemplateEmailVerify } from "@/utils/TemplateEmailVerify";

export const POST = async (req: Request) => {
  let newUserId = "";

  try {
    const body = await req.json();

    const schema = z.object({
      firstName: z.string().min(1).min(3),
      lastName: z.string().min(1).min(3),
      email: z.string().min(1).email(),
      password: z.string().min(1).min(6),
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

    const { firstName, lastName, email, password } = response.data;

    const findEmail = await prismadb.user.findFirst({
      where: {
        email,
        role: "member",
      },
    });

    if (findEmail) {
      return NextResponse.json(
        {
          message: "Email already used",
        },
        { status: 400 }
      );
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    const user = await prismadb.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: passwordHash,
        role: "member",
      },
    });

    newUserId = user.id;

    const token = await prismadb.activateToken.create({
      data: {
        token: `${randomUUID()}`,
        userId: user.id,
      },
    });

    const name = `${firstName} ${lastName}`;
    const link = `${process.env.WEB_URL}/api/activate/${token.token}`;

    const mailOptions = {
      from: process.env.EMAIL,
      to: body.email,
      subject: "Email Verify",
      html: TemplateEmailVerify(name, link),
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "User Created" }, { status: 201 });
  } catch (error) {
    console.log("[USER_POST]", error);

    if (newUserId) {
      await prismadb.activateToken.deleteMany({
        where: {
          userId: newUserId,
        },
      });

      await prismadb.user.delete({
        where: {
          id: newUserId,
        },
      });
    }

    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
