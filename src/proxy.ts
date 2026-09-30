import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/session";
import { defaultLocale, hasLocale, type Locale } from "@/i18n/config";
import { posts } from "@/content/posts";

// Negociación mínima de Accept-Language: con solo dos idiomas no hace falta
// una librería de matching.
function preferredLocale(request: NextRequest): Locale {
  const header = request.headers.get("accept-language") ?? "";
  for (const part of header.split(",")) {
    const code = part.split(";")[0].trim().slice(0, 2).toLowerCase();
    if (hasLocale(code)) return code;
  }
  return defaultLocale;
}

// URLs del WordPress anterior que cambiaron de forma, para no perder SEO
// (los artículos vivían en la raíz, ahora bajo /blog).
const legacyPaths: Record<string, string> = {
  "/producto/aura-hair-brush": "/store/aura-hair-brush",
  "/producto/ease-hair-comb": "/store/ease-hair-comb",
  "/cart": "/store",
  ...Object.fromEntries(posts.map((post) => [`/${post.slug}`, `/blog/${post.slug}`])),
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = token ? await verifySessionToken(token) : null;
    if (session?.role !== "administrador") {
      return NextResponse.redirect(new URL("/acceso-admin", request.url));
    }
    return NextResponse.next();
  }

  const [, first = "", ...rest] = pathname.replace(/\/+$/, "").split("/");
  const hasPrefix = hasLocale(first);
  const locale = hasPrefix ? first : preferredLocale(request);
  const path = "/" + (hasPrefix ? rest : [first, ...rest]).filter(Boolean).join("/");
  const legacy = legacyPaths[path];

  if (hasPrefix && !legacy) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${legacy ?? (path === "/" ? "" : path)}`;
  return NextResponse.redirect(url, legacy ? 308 : 307);
}

export const config = {
  matcher: ["/((?!api|_next|acceso-admin|images|.*\\..*).*)"],
};
