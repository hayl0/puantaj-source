import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // If user is authenticated, allow access
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/personel/:path*",
    "/puantaj/:path*",
    "/mesai/:path*",
    "/vardiya/:path*",
    "/izin/:path*",
    "/maas/:path*",
    "/finans/:path*",
    "/raporlar/:path*",
    "/ayarlar/:path*",
    "/yardim/:path*",
  ],
};
