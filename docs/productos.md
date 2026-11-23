# Agregar un producto

No hay panel de administración. Cada producto es una entrada en `src/content/products.ts`. Al agregarla, la ficha `/es/wholesale/<slug>/` y `/en/wholesale/<slug>/` se genera sola, y el producto aparece en:

- Inicio (colección) y Mayoreo (tarjetas, y videos si tiene).
- Productos relacionados de las otras fichas (hasta 3).
- Pie de página, selector de productos de los formularios y panel del pedido.
- `sitemap.xml`, con su canonical y hreflang.

## 1. Imágenes (`public/images/`)

Exportar en WebP, unos 1200 px de lado, por debajo de 200 KB cada una.

| Campo | Qué foto | Cómo se muestra |
|---|---|---|
| `image` | Producto o empaque sobre fondo claro y liso | Tarjetas, con margen (`object-contain`) dentro del arco |
| `hoverImage` | Foto de uso o de ambiente | Aparece al pasar el cursor sobre la tarjeta; recortada a 4:5 |
| `gallery` | 3 fotos: la primera igual a `image`, luego 2 de detalle o ambiente | Ficha: la primera grande sin recorte, las otras dos cuadradas y recortadas |

La galería admite más fotos, pero conviene un número impar: la primera ocupa todo el ancho y las demás van de dos en dos.

## 2. Video (opcional)

Para los Shorts del canal de YouTube de Casa Escencia:

1. El ID es la parte final de la URL: `youtube.com/shorts/BzsyTsvrWCc` → `BzsyTsvrWCc`.
2. Portada vertical: descargar `https://i.ytimg.com/vi/<ID>/oardefault.jpg` (1080 × 1920), convertirla a WebP de 720 × 1280 y guardarla en `public/images/videos/<slug>.webp`. Es una copia local para no cargar nada de YouTube hasta que alguien abre el video.
3. En el producto: `video: { youtube: "<ID>", poster: "/images/videos/<slug>.webp" }`.

Con `video`, la ficha suma la sección "Míralo en acción" y el video aparece en la sección de videos de Mayoreo. Sin `video`, esas partes no se muestran.

## 3. La entrada en `products.ts`

```ts
{
  slug: "nombre-del-producto",        // URL; minúsculas y guiones. No cambiarlo después de publicar.
  sku: "AHB03",
  image: "/images/<slug>-box.webp",
  hoverImage: "/images/<slug>-uso.webp",
  gallery: ["/images/<slug>-box.webp", "/images/<slug>-detalle.webp", "/images/<slug>-ambiente.webp"],
  video: { youtube: "<ID>", poster: "/images/videos/<slug>.webp" }, // opcional
  content: {
    es: {
      name: "Nombre del producto",
      tagline: "Beneficio en 2-4 palabras",          // eyebrow de la tarjeta y la ficha
      summary: "Una o dos frases.",                  // ficha y meta description de Google
      description: ["Párrafo 1", "Párrafo 2"],
      details: ["Beneficio corto", "Beneficio corto"], // lista con check; 4-6 queda parejo en dos columnas
      ideal: ["Uso 1", "Uso 2", "Uso 3"],            // "Ideal para" en Mayoreo
      care: ["Indicación de cuidado"],                // opcional
    },
    en: { /* los mismos campos, traducidos */ },
  },
},
```

TypeScript avisa si falta un campo o un idioma.

## 4. Revisar y publicar

```powershell
pnpm exec tsc --noEmit
```

```powershell
pnpm lint
```

```powershell
pnpm build
```

Abrir la ficha nueva en los dos idiomas, probar "Añadir al pedido" y el video, y subir el contenido de `out/` como en `docs/publicacion.md`.

Si el producto existía en el WordPress con otra URL, agregar su `RedirectMatch` en `public/.htaccess`.

## Línea profesional (Siena)

Siena no es una ficha del catálogo: tiene su propia página (`/professional-line/`), con textos en el diccionario (`professional`, `store.siena`). Su Short está en `sienaVideo` (`src/content/site.ts`) y se muestra en esa página y en la sección de videos de Mayoreo.
