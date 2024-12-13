import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { userAuth } from "./types/userTypes";

// Verifica se o usuário está autenticado
function isUserAuthenticated(request: NextRequest): userAuth | null {
  const cookie = request.cookies.get("usuario")?.value;
  if (!cookie) return null;

  try {
    return JSON.parse(cookie) as userAuth;
  } catch {
    return null;
  }
}

// Middleware
export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const user = isUserAuthenticated(request);

  // Rotas públicas que sempre permitem acesso
  const publicRoutes = ["/", "/emailcheck"];

  // Rotas de recuperação de senha
  const passwordRecoveryRoutes = ["/codevalidate", "/passwordvalidate"];

  // Rotas protegidas conhecidas
  const protectedRoutes = [
    "/task",
    "/ranking",
    "/dashboard",
    "/usercontrol",
    "/squadcontrol",
  ];

  // Combina todas as rotas conhecidas
  const knownRoutes = [
    ...publicRoutes,
    ...passwordRecoveryRoutes,
    ...protectedRoutes,
  ];

  // Verifica se a rota existe
  const isKnownRoute = knownRoutes.includes(pathname);

  // Regras para rotas públicas
  if (publicRoutes.includes(pathname)) {
    if (user) {
      // Redireciona para /usercontrol se o usuário estiver autenticado
      return NextResponse.redirect(new URL("/usercontrol", request.url));
    }
    return NextResponse.next();
  }

  // Regras para rotas de recuperação de senha
  if (passwordRecoveryRoutes.includes(pathname)) {
    // Permite acesso às rotas de recuperação de senha apenas se o cookie de email de recuperação existir
    const hasPasswordRecoveryCookie = request.cookies.has(
      "emailRecuperarSenha"
    );

    if (!hasPasswordRecoveryCookie) {
      // Redireciona para a página inicial se não houver cookie de recuperação
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Se o cookie existir, permite o acesso à rota
    return NextResponse.next();
  }

  // Regras para rotas protegidas
  if (protectedRoutes.includes(pathname)) {
    // Verifica se o usuário está autenticado
    if (!user) {
      // Redireciona para a página inicial se não estiver autenticado
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Regras específicas para rotas de administrador
    if (pathname === "/task" && user.Role === "Administrador") {
      // Impede administradores de acessar a rota /task
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (
      (pathname === "/usercontrol" || pathname === "/squadcontrol") &&
      user.Role !== "Administrador"
    ) {
      // Redireciona para /dashboard se o usuário não for administrador
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  }

  // Para rotas desconhecidas
  if (!isKnownRoute) {
    // Se o usuário não estiver autenticado, redireciona para a página inicial
    if (!user) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

// Configura as rotas para as quais o middleware será aplicado
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (pasta de imagens do projeto)
     */
    "/((?!_next/static|_next/image|favicon.ico|images).*)",
  ],
};
