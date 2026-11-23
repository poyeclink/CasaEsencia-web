# Publicación y migración: sitio estático en Hostinger

Estado (22-nov-2026): se descartó WordPress. El sitio se publica como exportación estática de Next.js (`out/`) en el plan Premium de Hostinger. No tiene admin, base de datos ni checkout: las cotizaciones llegan por WhatsApp.

## Decisiones confirmadas con la clienta

- **Solo mayoreo por cotización.** Pedido mínimo 25 unidades por producto, en escalas de 25. Sin precios en el sitio.
- **WhatsApp de cotizaciones:** +503 6960 1693 (`src/content/site.ts`). Es el mismo número que usa hoy el WordPress.
- **Correo opcional.** Si el cliente no lo da, el mensaje lo marca como pendiente, y la clienta lo pide al cotizar para enviar la factura electrónica.
- **Pago coordinado por WhatsApp**, directamente con la clienta.

## Dónde está cada cosa hoy

| Rama local | Contenido | ¿Subida a GitHub? |
|---|---|---|
| `main` | Versión anterior (venta por docena, checkout, admin) | Sí, igual que `origin/main` |
| `full-stack` | Copy de mayoreo + backend completo (Prisma, auth, admin, pedidos). Respaldo para el upsell | No (1 commit local) |
| `static-export` | Sitio estático actual + cambios sin commit | No (4 commits locales + cambios sin commit) |

Remoto actual: `origin` = `github.com/poyeclink/CasaEsencia-web`. **No se hace push ahí**: el trabajo va a un repositorio nuevo.

---

## Paso a paso

### Paso 1. Respaldo local, antes de cualquier otra cosa

No requiere commit ni push. Protege contra borrar la carpeta por accidente o contra un fallo del disco o de OneDrive.

Desde la carpeta del proyecto, en PowerShell:

```powershell
git bundle create ..\casa-escencia-historial.bundle --all
```

```powershell
robocopy . ..\CasaEsencia-web-respaldo /E /XD node_modules .next out
```

- El `.bundle` guarda todas las ramas y commits en un solo archivo. Para restaurarlo: `git clone casa-escencia-historial.bundle`.
- El `robocopy` copia además los cambios sin commit. Incluye `.env`: guarda esa copia en un lugar privado.

### Paso 2. Datos que faltan de la clienta

1. **ID de Google Analytics 4.** En el WordPress no hay ninguna etiqueta de GA4 activa. Solo quedó un `dns-prefetch` a `googletagmanager.com` de algún plugin, y la medición actual es Jetpack Stats, que desaparece con WordPress.
   - Si ya tiene una propiedad: [analytics.google.com](https://analytics.google.com) → **Administrar → Recopilación de datos → Flujos de datos → Web** → **ID de medición** (`G-XXXXXXXXXX`).
   - Si no tiene: crear una propiedad GA4 con un flujo web para `https://casaescencia.com`.
   - Ese ID va en `NEXT_PUBLIC_GA_ID` (ver Paso 4).
2. **Search Console.** El WordPress no tiene meta de verificación en el HTML. Si ya está verificada, probablemente es por DNS y sigue funcionando sin hacer nada. Si no, verificarla como "Dominio" con un registro TXT en el DNS de Hostinger: sobrevive a cualquier cambio del sitio.
3. **Aprobar las páginas legales.** Ya existen versiones provisionales para el modelo de mayoreo en `/terminos-y-condiciones/` y `/privacy-policy/`, en ambos idiomas, con los mismos slugs del WordPress. El texto está en `src/content/legal.ts`. La clienta o su asesor deben revisarlo, sobre todo:
   - Plazos: 48 horas para reportar faltantes o daños al recibir, y 7 días hábiles para defectos de fábrica.
   - Envío gratis a todo El Salvador "salvo que la cotización indique otra cosa".
   - Precios en USD; la cotización indica si incluyen IVA.
   - Mención de Google Analytics. Si al final no se usa GA4, quitar ese punto de la privacidad.

   Las versiones del WordPress quedaron respaldadas en `docs/contenido-wordpress/`. Al cambiar el texto, actualizar la fecha `updated`.

### Paso 3. Cerrar la versión estable (cuando esté aprobada)

En la rama `static-export`:

```powershell
git add -A
```

```powershell
git commit -m "Sitio estático: cotización por WhatsApp, GA4 y redirecciones del WordPress"
```

### Paso 4. Compilar con las variables de producción

Crear `.env.production.local`, que no se sube al repo:

```
NEXT_PUBLIC_SITE_URL="https://casaescencia.com"
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

```powershell
pnpm install
```

```powershell
pnpm build
```

Sin `NEXT_PUBLIC_GA_ID`, el sitio no carga nada de Google. Con el ID, cada formulario enviado y cada cotización del carrito registran el evento `generate_lead`, con el formulario de origen.

### Paso 5. Pruebas en un subdominio de Hostinger (antes de tocar WordPress)

1. Respaldo completo de WordPress en hPanel: **Sitios web → Copias de seguridad**.
2. Crear un subdominio (por ejemplo `nuevo.casaescencia.com`) y subir **el contenido** de `out/` a `domains/nuevo.casaescencia.com/public_html` con SmartFTP. Incluye `.htaccess`, que es un archivo oculto.
3. Recorrer la lista de verificación de abajo.

### Paso 6. Migrar al repositorio nuevo

1. Crear el repositorio **vacío** en GitHub, sin README, licencia ni `.gitignore`, para que no haya conflicto de historial.
2. Agregarlo como un segundo remoto. `origin` no se toca:

```powershell
git remote add nuevo https://github.com/<cuenta>/<repo-nuevo>.git
```

3. Subir el sitio estático como `main` del repo nuevo y, si se quiere conservar el upsell, también la rama con backend:

```powershell
git push nuevo static-export:main
```

```powershell
git push nuevo full-stack
```

4. Comprobar el repo nuevo clonándolo en otra carpeta:

```powershell
git clone https://github.com/<cuenta>/<repo-nuevo>.git ..\casa-escencia-nuevo
```

Dentro de esa carpeta: `pnpm install` y `pnpm build`, y verificar que se genere `out/` igual que en local.

5. Hasta aquí no se perdió nada: el repo viejo sigue igual y la carpeta local conserva todas las ramas. Cuando el repo nuevo esté comprobado, se puede archivar el viejo en GitHub (**Settings → Archive**).

No van al repositorio, porque el `.gitignore` ya los excluye: `.env*` (excepto `.env.example`), `out/`, `.next/`, `node_modules/`. El `.env` local todavía tiene claves viejas de Supabase y Auth que ya no se usan.

### Paso 7. Paso a producción

1. Renovar el plan Premium (vence a principios de diciembre de 2026).
2. Con la clienta aprobando el subdominio, nuevo respaldo de WordPress.
3. Vaciar `public_html` y subir el contenido de `out/`.
4. Repetir las secciones de Seguridad y de SEO de la lista sobre `casaescencia.com`.
5. En Search Console: enviar `https://casaescencia.com/sitemap.xml` y vigilar la cobertura y los 404 durante 2 semanas.
6. Cancelar Elementor Pro y quitar la instalación de WordPress del panel.

---

## Lista de verificación en el subdominio de prueba

### Apariencia (escritorio y móvil)

- [ ] Inicio, Mayoreo, ficha de Aura y de Ease, Línea profesional, Sobre nosotros, Contacto y Blog se ven igual que en local.
- [ ] Tipografías Playfair y Nunito cargan, sin caer a Georgia ni a Arial.
- [ ] Imágenes nítidas: hero, arcos, foto de la fundadora y círculo, exhibidores.
- [ ] El menú móvil abre y cierra; el cambio de idioma ES/EN mantiene la página.
- [ ] Los reels de Instagram abren el embed y las fotos enlazan al post.
- [ ] El FAQ de Mayoreo abre y cierra.
- [ ] La página 404 tiene el diseño del sitio.

### Cotización por WhatsApp

- [ ] En la ficha de producto, "Añadir al pedido" suma de 25 en 25 y abre el panel del pedido.
- [ ] Los productos agregados aparecen en el selector de los formularios (Contacto, Línea profesional, Mayoreo), y al revés.
- [ ] Sin productos, el formulario pide agregar al menos uno.
- [ ] El mensaje que llega al WhatsApp de la clienta trae nombre, negocio, WhatsApp, tipo de negocio, productos con unidades, ciudad y mensaje.
- [ ] Sin correo, el mensaje dice "pendiente, se solicitará para la factura electrónica".
- [ ] En móvil abre la app de WhatsApp; en escritorio, WhatsApp Web.
- [ ] Con GA4 activo: en **Informes → Tiempo real** aparece `generate_lead` al enviar.

### Seguridad

- [ ] `http://` redirige a `https://`, y `www.` a la versión sin `www`.
- [ ] Encabezados presentes (securityheaders.com o `curl -I`): `Strict-Transport-Security`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options` y `Content-Security-Policy: frame-ancestors 'self'`.
- [ ] Una carpeta sin `index.html` (por ejemplo `/images/`) no lista archivos.
- [ ] Ningún `.env` ni secreto en `public_html`.
- [ ] Si el `.htaccess` da error 500, revisar primero `Options -Indexes` y las líneas `Header`: dependen de la configuración del servidor.

### SEO y redirecciones

Las reglas cubren las 85 URLs que publicaban los sitemaps de Yoast. Se simularon contra el build en local: todas llegan a una página existente, incluidas las 4 legales, que ahora tienen página propia.

- [ ] `/` → `/es/`.
- [ ] Inglés en la raíz → `/en/...`: `/about/`, `/contact-us/`, `/wholesale/`, `/professional-line/`, `/blog/`.
- [ ] Productos: `/aura-hair-brush/`, `/store/aura-hair-brush/`, `/producto/aura-hair-brush/` y su versión `/es/` → la ficha en `/wholesale/`.
- [ ] `/cart/`, `/checkout-2/`, `/my-account/`, `/categoria-producto/...` → Mayoreo.
- [ ] Artículos en la raíz (`/mindful-brushing-a-micro-ritual/`, etc.) → `/en/blog/<slug>/`; con `/es/` → `/es/blog/<slug>/`.
- [ ] `/category/...`, `/tag/...`, `/author/...`, `/feed/` → índice del blog.
- [ ] `/sitemap_index.xml` y los sitemaps de Yoast → `/sitemap.xml`.
- [ ] `/sitemap.xml` y `/robots.txt` responden.

## Verificado en local (22-nov-2026)

`tsc`, `eslint`, `prettier` y `build` sin errores. 16 rutas clave responden 200 y `/es/nope/` da 404. 32 páginas sin enlaces ni imágenes rotas. Canonical, hreflang y sitemap con barra final. GA4 se inyecta solo cuando `NEXT_PUBLIC_GA_ID` existe. Los 4 artículos del blog están completos en ambos idiomas.

## Pendiente

- Aprobar el texto de las páginas legales (Paso 2.3).
- Obtener el ID de GA4 (Paso 2.1).
- CSP completa: hoy solo `frame-ancestors`. Una política estricta debe permitir `instagram.com` (reels) y `googletagmanager.com` (GA4), y probarse antes en el subdominio.
