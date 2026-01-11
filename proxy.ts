// proxy.ts
import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

// On définit la logique de protection
const authMiddleware = withAuth({
  pages: {
    signIn: "/api/auth/signin",
  },
});

// 2. On l'exporte via la nouvelle fonction "proxy" de Next.js 16
export default async function proxy(req: NextRequest) {
  // Cette ligne appelle le vérificateur de session de NextAuth
  const response = await (authMiddleware as any)(req);

  console.log("Middleware d'authentification exécuté pour :", response);
  
  // Si NextAuth renvoie une redirection vers la page de login, on la retourne
  if (response) return response;

  // Sinon, on laisse l'utilisateur voir l'application
  return NextResponse.next();
}

// 3. On définit ce qui doit être protégé
export const config = {
  // On protège TOUT sauf les fichiers système de Next.js et les images
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};