import { auth } from "./app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const isAuthorized = session?.user?.email === process.env.MAIL_AUTH;

  if (!isAuthorized) {
    if (session) {
      return new NextResponse("Accès interdit : email non autorisé.", {
        status: 403,
      });
    }

    const signInUrl = new URL("/api/auth/signin", request.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
