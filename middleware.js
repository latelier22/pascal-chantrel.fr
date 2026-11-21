import { NextResponse } from "next/server";
import { isSlideshowAdmin, slideshowAuthRequired } from "./app/diaporama/auth";

export async function middleware(request) {
  const pathname = request.nextUrl.pathname;
  if (pathname === "/stock" || pathname.startsWith("/stock/")) return new NextResponse(null, { status: 404 });
  return (await isSlideshowAdmin(request)) ? NextResponse.next() : slideshowAuthRequired();
}

export const config = {
  matcher: ["/stock/:path*", "/diaporama/admin"],
};
