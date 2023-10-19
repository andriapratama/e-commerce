import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prismadb from "./prismadb";
import bcrypt from "bcryptjs";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prismadb),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        role: {
          label: "Role",
          type: "text",
        },
        email: {
          label: "Email",
          type: "text",
        },
        username: {
          label: "Username",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.role) {
          throw new Error("Role harus diisi.");
        }

        if (credentials.role !== "admin" && credentials.role !== "user") {
          throw new Error("Role salah.");
        }

        let user = null;

        if (credentials.role === "admin") {
          if (!credentials?.username || !credentials?.password) {
            throw new Error("Username dan password harus diisi.");
          }

          user = await prismadb.employee.findUnique({
            where: {
              username: credentials.username,
            },
          });

          if (!user) {
            throw new Error("Username atau password salah.");
          }
        } else if (credentials.role === "user") {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email dan password harus diisi.");
          }

          user = await prismadb.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          if (!user) {
            throw new Error("Email atau password salah.");
          }
        }

        let isPasswordValid = null;

        if (user) {
          isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
        }

        if (!isPasswordValid) {
          if (credentials.role === "admin") {
            throw new Error("Username atau password salah.");
          } else {
            throw new Error("Email atau password salah.");
          }
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return { ...token, username: user.username, role: user.role };
      }

      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          username: token.username,
          role: token.role,
        },
      };
    },
  },
};
