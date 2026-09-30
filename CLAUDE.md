# casa-escencia-web — Convenciones del proyecto

Sitio de Casa Escencia (cepillos y peines, El Salvador), migrado desde WordPress (casaescencia.com). Nace de `ecommerce-template`: misma estructura de capas, auth y design system.
Stack: Next.js 16 (App Router) + TypeScript + React 19 + Tailwind 4 + Prisma 7 + Supabase PostgreSQL + Vercel + pnpm.

## Estado actual

- **Base de datos**: `User` (del template), `Lead` (formularios de contacto y línea profesional, con `status` gestionado desde el panel) y `Order`/`OrderItem` (pedidos de la tienda).
- **Catálogo y blog estáticos** en `src/content/` (`products.ts`, `posts.ts`, `site.ts`), bilingües vía `Localized<T>`. Se migrarán a DB cuando haga falta editarlos sin deploy.
- **Venta solo por docena** (decisión del cliente, sep-2026): `products.ts` guarda `dozenPrice` (precio de la docena completa, hoy = unitario anterior × 12) y el unitario solo se deriva para mostrarlo. En carrito y pedidos `quantity`/`dozens` siempre son docenas. Envío gratis en todos los pedidos (con la regla anterior de gratis desde $30 cualquier docena ya calificaba), por eso no hay costo de envío en el modelo.
- **Flujo de compra** (misma metodología de capas que `ecommerce-template`): carrito en `localStorage` (`CartProvider`, clave `ce-cart-dozens`) → `/[lang]/checkout` exige sesión de cliente (si no, `/login?next=...`; `nextPath()` en `auth-actions.ts` solo acepta rutas del mismo idioma) → `placeOrderAction` valida y `order-service.createOrder` recalcula precios desde el catálogo (nunca confía en el navegador) y congela nombre/precio/contacto en el pedido → `/[lang]/my-account/orders/[id]?placed=1` limpia el carrito y ofrece WhatsApp con el número `CE-0001`. Sin cobro en línea: el pago se coordina al confirmar.
- **Estados de pedido**: `pendiente → confirmado → enviado → entregado` o `cancelado`, cambiados a mano por el admin. Los cancelados no cuentan en ventas ni en "total comprado".
- **Instagram**: las fotos de los posts se copiaron a `public/images/instagram/` (las URLs del CDN de Instagram caducan). La galería (`InstagramFeed`) enlaza cada foto al post; los reels usan una fachada (`ReelTile`) que monta el embed oficial solo al abrirlo. Para cambiar posts: guardar la imagen y editar `instagramPosts` en `src/content/site.ts`.
- **Header**: logo a la izquierda y navegación a la derecha (estilo tradicional, a pedido del cliente; el sitio original lo tenía centrado).

## Panel admin (`/admin`)

- Solo español; etiquetas de estado reutilizan `es.orders.statuses` (`src/components/admin/labels.ts`) para que cliente y admin nombren igual cada estado.
- Secciones: Resumen (KPIs del mes, ventas 6 meses, docenas por producto, recientes), Pedidos (filtro por estado, búsqueda por n.º/cliente/teléfono, detalle con cambio de estado + nota interna), Clientes (compras agregadas, ficha con historial) y Leads (filtro por estado/origen, estado editable en línea).
- Meses y fechas del panel en hora de El Salvador (`STORE_TIME_ZONE`, UTC-6 fijo); piezas de UI compartidas en `src/components/admin/ui.tsx`.
- Cada Server Action del panel llama `requireAdmin()` aunque el proxy ya proteja `/admin`: las actions son endpoints públicos.

## Internacionalización

- Patrón nativo de la guía de Next (`node_modules/next/dist/docs/01-app/02-guides/internationalization.md`), sin librerías: rutas bajo `src/app/[lang]`, diccionarios TS en `src/i18n/dictionaries/` (`en.ts` tipado como `Dictionary` de `es.ts`, así TS avisa si falta una clave).
- Idiomas: `es` (default) y `en`. `src/proxy.ts` redirige las URLs sin prefijo según `Accept-Language` y hace 308 de URLs antiguas del WordPress (`/producto/*`, artículos en la raíz).
- Slugs de rutas en inglés (`/store`, `/about`, `/professional-line`, `/contact-us`, `/blog/<slug>`) a propósito: son los mismos del sitio original, para conservar SEO.
- Los Client Components reciben la porción del diccionario por props. Server Actions devuelven **claves** de error (no textos) y el formulario las traduce.
- Cada página define su canonical/hreflang con `pageMetadata()` (`src/lib/seo.ts`); no ponerlo en el layout o todas heredan el de la home.
- Dos root layouts: `app/[lang]/layout.tsx` (sitio) y `app/(admin)/layout.tsx` (panel, solo español). Por eso `experimental.globalNotFound` + `app/global-not-found.tsx`.

## Rendimiento

- El `Header` no lee la sesión para que todas las páginas públicas sean SSG; el estado de la cuenta vive en `/[lang]/my-account` (dinámica).
- Imágenes locales en `public/images/` servidas con `next/image` (AVIF/WebP). Solo el hero de cada página usa `preload`.

## Branding

- Paleta sacada del sitio y empaque original: azul marino `#153247` (logo), crema, dorado del monograma y verde bosque (Ease Comb / sellos). Tokens en `src/app/globals.css`.
- `accent` es el dorado oscuro (texto pequeño AA sobre crema); `gold` es el dorado claro solo para fondos oscuros.
- Tipografías del original: Playfair Display (titulares, `font-serif`) + Nunito Sans (texto).
- Motivo visual: marcos en arco (`rounded-t-full`), ornamento dorado (`Ornament`), eyebrows en mayúsculas espaciadas (`.eyebrow`).

## Cómo trabajar en este repo

- Código mínimo y sin sobreingeniería (enfoque `ponytail`): nada de abstracciones especulativas, capas sin propósito, ni flags de compatibilidad hacia atrás en un proyecto sin usuarios todavía.
- Exploración amplia del código → delegar a un subagente en vez de hacerlo inline.
- Antes de cerrar un ticket de código: correr `code-review` (o `simplify` si es solo limpieza) sobre el diff.
- Sin comentarios explicativos de qué hace el código; solo comentarios que expliquen un porqué no obvio.
- Server Components por defecto; Client Components solo donde hay interactividad real.
- Lógica de negocio pura y testeable vive en `src/server/services/`, no en Server Actions ni componentes.

## Base de datos (Prisma 7 + Supabase)

- Prisma pinneado a `7.10.0` a propósito, igual que el template.
- Config del CLI en `prisma7.config.ts` (nombre que esta versión de Prisma detecta automáticamente). Ahí vive `DIRECT_URL` porque el CLI (migrate/db push/studio) la necesita; la app en runtime (`src/lib/prisma.ts`) usa `DATABASE_URL` (pooled) directamente en el adapter, sin pasar por este config.
- `DIRECT_URL` debe usar el Session pooler de Supabase (`aws-0-<region>.pooler.supabase.com:5432`), no el host de conexión directa real (`db.<project-ref>.supabase.co:5432` — solo resuelve por IPv6, da `ETIMEDOUT` en redes sin salida IPv6).
- Cliente generado en `src/generated/prisma` (gitignored), se importa como `@/generated/prisma/client`. Correr `pnpm db:generate` después de cualquier cambio en `prisma/schema.prisma`.
- Requiere driver adapters (`@prisma/adapter-pg` + `pg`), no hay motor de query engine binario.

## Autenticación

- Sesión propia vía JWT (`jose`, edge-safe) en cookie httpOnly (`src/lib/session.ts`), sin tabla de sesiones en DB. Contraseñas con `bcryptjs` (`src/lib/password.ts`).
- Cliente y administrador comparten el modelo `User` (`role`) pero flujos y rutas separados por defecto (`/[lang]/login`+`/[lang]/registro` vs. `/acceso-admin`).

## Design system

- Tokens de color/radio como variables CSS mapeadas a Tailwind (`@theme inline`).
- Nunca usar clases `neutral-*`/`gray-*`/colores literales de Tailwind directamente en componentes — siempre tokens semánticos.
- Variantes de componentes con `class-variance-authority` (`cva`) + `cn()`, mismo patrón que shadcn/ui.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
