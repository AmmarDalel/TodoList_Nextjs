import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req: Request) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const url = new URL(req.url);
  const pathname = url.pathname;

  // Si utilisateur connecté et visite la page racine "/"
  if (pathname === "/" && token) {
    url.pathname = "/TodoList";
    return NextResponse.redirect(url);
  }

  // Protection des routes /TodoList
  if (pathname.startsWith("/TodoList")) {
    if (!token) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/TodoList/:path*"],
};
