/* ************************************************************************** */
/*                                Dépendances                                */
/* ************************************************************************** */
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

/* ************************************************************************** */
/*                                Middleware                                 */
/* ************************************************************************** */
export async function middleware(req: Request) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const url = new URL(req.url);
  const pathname = url.pathname;

  if (pathname === "/" && token) {
    url.pathname = "/TodoList";
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/TodoList")) {
    if (!token) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

/* ************************************************************************** */
/*                                Configuration                              */
/* ************************************************************************** */
export const config = {
  matcher: ["/", "/TodoList/:path*"],
};
