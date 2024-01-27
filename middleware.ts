import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(function middleware(request: NextRequestWithAuth) {
  const superAdmin = request.nextauth.token?.role !== "superAdmin";
  const admin = request.nextauth.token?.role !== "admin";

  if (request.nextUrl.pathname.startsWith("/admin") && superAdmin && admin) {
    return NextResponse.rewrite(new URL("/denied", request.url));
  }

  if (
    request.nextUrl.pathname.startsWith("/admin/orders") &&
    superAdmin &&
    admin
  ) {
    return NextResponse.rewrite(new URL("/denied", request.url));
  }

  if (request.nextUrl.pathname.startsWith("/admin/categories") && superAdmin) {
    return NextResponse.rewrite(new URL("/denied", request.url));
  }

  if (
    request.nextUrl.pathname.startsWith("/admin/sub-categories") &&
    superAdmin
  ) {
    return NextResponse.rewrite(new URL("/denied", request.url));
  }

  if (request.nextUrl.pathname.startsWith("/admin/products") && superAdmin) {
    return NextResponse.rewrite(new URL("/denied", request.url));
  }

  if (request.nextUrl.pathname.startsWith("/admin/employees") && superAdmin) {
    return NextResponse.rewrite(new URL("/denied", request.url));
  }

  if (request.nextUrl.pathname.startsWith("/admin/heros") && superAdmin) {
    return NextResponse.rewrite(new URL("/denied", request.url));
  }

  if (request.nextUrl.pathname.startsWith("/admin/promos") && superAdmin) {
    return NextResponse.rewrite(new URL("/denied", request.url));
  }

  if (request.nextUrl.pathname.startsWith("/admin/settings") && superAdmin) {
    return NextResponse.rewrite(new URL("/denied", request.url));
  }

  if (request.nextUrl.pathname.startsWith("/admin/invoice") && superAdmin) {
    return NextResponse.rewrite(new URL("/denied", request.url));
  }
});

export const config = {
  matcher: [
    "/admin",
    "/admin/categories",
    "/admin/sub-categories",
    "/admin/employees",
    "/admin/orders",
    "/admin/orders/(.*)",
    "/admin/products",
    "/admin/products/add",
    "/admin/products/(.*)",
    "/admin/heros",
    "/admin/promos",
    "/admin/promos/add",
    "/admin/settings",
    "/admin/invoice/(.*)",
  ],
};
