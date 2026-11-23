# casa-escencia-web — Convenciones del proyecto

Sitio de Casa Escencia (cepillos y peines, El Salvador), migrado desde WordPress (casaescencia.com). Venta **solo al por mayor por cotización**.
Stack: Next.js 16 (App Router) + TypeScript + React 19 + Tailwind 4 + pnpm, publicado como **exportación estática** (`output: "export"`) en Hostinger (plan Premium, sin Node.js).

## Estado actual

- **Sitio 100 % estático**: `pnpm build` genera `out/` (HTML, CSS, JS), que se sube a `public_html`. Sin base de datos, sin auth, sin Server Actions, sin proxy/middleware, sin optimizador de imágenes (`images.unoptimized`; las imágenes ya están en AVIF/WebP).
- La versión con backend (Prisma + Supabase, auth, panel admin, pedidos) vive en la rama local `full-stack`. Es el upsell futuro: requiere hosting con Node.js.
- **Catálogo, blog y páginas legales** en `src/content/` (`products.ts`, `posts.ts`, `legal.ts`, `site.ts`), bilingües vía `Localized<T>`. Sin CMS: un artículo nuevo es una entrada más en `posts.ts` (bloques `p`, `h2`, `list`, `steps`, `quote`, renderizados por `RichText`) y su imagen en `public/images/`; la plantilla, el índice, el sitemap y los artículos relacionados lo toman solos.
- Términos y privacidad (`[lang]/[legal]`) usan los slugs del WordPress (`/terminos-y-condiciones`, `/privacy-policy`). Texto provisional pendiente de aprobación de la clienta.
- **Sin precios en el sitio**: el precio sale en la cotización. Pedido mínimo `MIN_ORDER_UNITS = 25` por producto, en escalas de 25 (`products.ts`).
- **Pedido = carrito en `localStorage`** (`CartProvider`, clave `ce-cart-units`, cantidades en unidades). Lo comparten la ficha de producto (`AddToCartButton`), el panel del carrito (`CartDrawer`) y los formularios (`LeadForm`): agregar un producto en un lado se ve en los demás.
- **Formularios sin backend**: `LeadForm` valida con HTML nativo y abre `wa.me/<número>` con la solicitud armada (datos del negocio + productos y unidades). El correo es opcional: si falta, el mensaje indica que la clienta lo pedirá para la factura electrónica. Número de WhatsApp en `site.ts`.
- No se guarda ningún lead ni pedido en el sitio: el registro vive en el WhatsApp de la clienta.
- **GA4 opcional**: solo se carga si `NEXT_PUBLIC_GA_ID` existe en build (`src/lib/analytics.ts` + `next/script` en el layout). `trackLead()` manda `generate_lead` al enviar un formulario o la cotización del carrito.
- **Productos**: plantilla única en `wholesale/[slug]`; para agregar uno, ver `docs/productos.md`. Videos: Shorts de YouTube (`video` en el producto, `sienaVideo` en `site.ts`) con portada local en `public/images/videos/` y la misma fachada `ReelTile`, que monta `youtube-nocookie.com` solo al abrir.
- **Instagram**: fotos copiadas a `public/images/instagram/` (las URLs del CDN caducan). Los reels usan una fachada (`ReelTile`) que monta el embed oficial solo al abrirlo.
- **Header**: logo a la izquierda, navegación a la derecha, un solo CTA "Solicita información". Sin carrito ni cuenta en el header.

## Hosting y seguridad (`public/.htaccess`, se copia a `out/`)

- HTTPS forzado y sin `www`; `/` → `/es/` (302). El WordPress tenía el inglés en la raíz (`/about/`) y el español bajo `/es/`: los 301 con `RedirectMatch` anclados cubren las 85 URLs de sus sitemaps (ver `docs/publicacion.md`). Usar siempre `RedirectMatch ^...$`: `Redirect` compara por prefijo y `/aura-hair-brush` capturaría también `/aura-hair-brush-el-inicio-de-un-ritual`.
- Encabezados: `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `frame-ancestors 'self'` + `X-Frame-Options`, HSTS sin `includeSubDomains`. `Options -Indexes`. `sw.js` sin caché.
- No hay CSP completa a propósito: los reels cargan scripts e iframes de `instagram.com` y GA4 carga `googletagmanager.com`. Si se agrega, probarla primero en el subdominio de prueba.
- Las rutas de metadatos (`manifest.ts`, `robots.ts`, `sitemap.ts`) llevan `export const dynamic = "force-static"`: la exportación lo exige.
- `NEXT_PUBLIC_SITE_URL` y `NEXT_PUBLIC_GA_ID` se fijan en build (ver `.env.example`).

## Internacionalización

- Patrón nativo de la guía de Next (`node_modules/next/dist/docs/01-app/02-guides/internationalization.md`), sin librerías: rutas bajo `src/app/[lang]`, diccionarios TS en `src/i18n/dictionaries/` (`en.ts` tipado como `Dictionary` de `es.ts`, así TS avisa si falta una clave).
- Idiomas: `es` (default) y `en`. Sin proxy: la raíz redirige a `/es/` desde `.htaccess` (no hay negociación por `Accept-Language`).
- Slugs de rutas en inglés (`/wholesale`, `/about`, `/professional-line`, `/contact-us`, `/blog/<slug>`) a propósito: son los del sitio original, para conservar SEO.
- Los Client Components reciben la porción del diccionario por props.
- Cada página define su canonical/hreflang con `pageMetadata()` (`src/lib/seo.ts`); no ponerlo en el layout o todas heredan el de la home.
- `experimental.globalNotFound` + `app/global-not-found.tsx` para el 404 global.

## Branding

- Paleta sacada del sitio y empaque original: azul marino `#153247` (logo), crema, dorado del monograma y verde bosque (Ease Comb / sellos). Tokens en `src/app/globals.css`.
- `accent` es el dorado oscuro (texto pequeño AA sobre crema); `gold` es el dorado claro solo para fondos oscuros.
- Tipografías del original: Playfair Display (titulares, `font-serif`) + Nunito Sans (texto), servidas por `next/font` (sin Google Fonts en runtime).
- Motivo visual: marcos en arco (`rounded-t-full`), ornamento dorado (`Ornament`), eyebrows en mayúsculas espaciadas (`.eyebrow`).

## Cómo trabajar en este repo

- Código mínimo y sin sobreingeniería (enfoque `ponytail`): nada de abstracciones especulativas ni capas sin propósito.
- Antes de cerrar un cambio: `pnpm exec tsc --noEmit`, `pnpm lint` y `pnpm build` (el build es la prueba de que todo sigue siendo exportable).
- Sin comentarios explicativos de qué hace el código; solo comentarios que expliquen un porqué no obvio.
- Server Components por defecto; Client Components solo donde hay interactividad real.
- Nada que necesite servidor en runtime: ni Server Actions, ni `cookies()`/`headers()`, ni rutas API, ni `redirect()` dinámico. Romperían `output: "export"`.

## Design system

- Tokens de color/radio como variables CSS mapeadas a Tailwind (`@theme inline`).
- Nunca usar clases `neutral-*`/`gray-*`/colores literales de Tailwind directamente en componentes — siempre tokens semánticos.
- Variantes de componentes con `class-variance-authority` (`cva`) + `cn()`, mismo patrón que shadcn/ui.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
