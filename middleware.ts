import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(function middleware(request: NextRequestWithAuth) {
  if (
    request.nextUrl.pathname.startsWith("/admin") &&
    request.nextauth.token?.role !== "superAdmin" &&
    request.nextauth.token?.role !== "admin"
  ) {
    return NextResponse.rewrite(new URL("/denied", request.url));
  }

  if (
    request.nextUrl.pathname.startsWith("/admin/orders") &&
    request.nextauth.token?.role !== "superAdmin" &&
    request.nextauth.token?.role !== "admin"
  ) {
    return NextResponse.rewrite(new URL("/denied", request.url));
  }

  if (
    request.nextUrl.pathname.startsWith("/admin/categories") &&
    request.nextauth.token?.role !== "superAdmin"
  ) {
    return NextResponse.rewrite(new URL("/denied", request.url));
  }

  if (
    request.nextUrl.pathname.startsWith("/admin/products") &&
    request.nextauth.token?.role !== "superAdmin"
  ) {
    return NextResponse.rewrite(new URL("/denied", request.url));
  }

  if (
    request.nextUrl.pathname.startsWith("/admin/employees") &&
    request.nextauth.token?.role !== "superAdmin"
  ) {
    return NextResponse.rewrite(new URL("/denied", request.url));
  }
});

export const config = {
  matcher: [
    "/admin",
    "/admin/categories",
    "/admin/employees",
    "/admin/orders",
    "/admin/orders/(.*)",
    "/admin/products",
    "/admin/products/add",
    "/admin/products/(.*)",
  ],
};
