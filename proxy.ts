import { auth } from "./app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { computeCSSHeader } from "./app/functions/functions";

export async function proxy(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  const headers = computeCSSHeader(request.headers);
  const cspHeader = headers.get("Content-Security-Policy") || "";

  if (pathname.startsWith("/api/auth")) {
    const response = NextResponse.next({
      request: {
        headers,
      },
    });
    response.headers.set("Content-Security-Policy", cspHeader);
    return response;
  }

  const isAuthorized = session?.user?.email === process.env.MAIL_AUTH;

  if (!isAuthorized) {
    if (session) {
      const response = new NextResponse(
        "Accès interdit : email non autorisé.",
        {
          status: 403,
          headers,
        }
      );
      response.headers.set("Content-Security-Policy", cspHeader);
      return response;
    }

    const signInUrl = new URL("/api/auth/signin", request.url);
    const response = NextResponse.redirect(signInUrl, {
      headers,
    });
    response.headers.set("Content-Security-Policy", cspHeader);
    return response;
  }

  const response = NextResponse.next({
    request: {
      headers,
    },
  });
  response.headers.set("Content-Security-Policy", cspHeader);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
