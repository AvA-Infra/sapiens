import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "@/lib/supabase/env";

/** Áreas que exigem login. O papel (aluno/professor/admin) é checado no servidor, em lib/auth.ts, e pelo RLS. */
const PROTECTED = ["/aluno", "/professor", "/admin"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const needsLogin = PROTECTED.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (!isSupabaseConfigured) {
    // Sem Supabase não há login: manda para a página que explica o que falta configurar.
    if (needsLogin) return NextResponse.redirect(new URL("/entrar", request.url));
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  // getClaims valida o JWT e renova a sessão quando preciso.
  const { data } = await supabase.auth.getClaims();
  const loggedIn = Boolean(data?.claims);

  if (needsLogin && !loggedIn) {
    const url = new URL("/entrar", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  if (loggedIn && (pathname === "/entrar" || pathname === "/cadastrar")) {
    return NextResponse.redirect(new URL("/aluno", request.url));
  }
  return response;
}

export const config = {
  // Só onde há sessão envolvida; páginas públicas ficam fora e continuam estáticas.
  matcher: ["/aluno/:path*", "/professor/:path*", "/admin/:path*", "/entrar", "/cadastrar"],
};
