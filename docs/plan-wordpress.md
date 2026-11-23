# Plan: WordPress sin Elementor con el diseño de Next

Decisión (nov-2026): el sitio sigue en WordPress, en el plan Premium de Hostinger. El diseño de este repo (estructura, copy e imágenes) se replica en HTML, CSS y JS. La clienta no edita el sitio: todo cambio lo hacemos nosotros. El repo de Next queda como fuente del diseño y como upsell futuro.

## Estado actual del WordPress (revisado en casaescencia.com)

- Tema: Hello Elementor.
- Constructores: Elementor, Elementor Pro, Royal Elementor Addons y Header Footer Elementor.
- Widgets Pro en uso: formulario, portfolio y productos de WooCommerce.
- Otros plugins: TranslatePress (en/es), Contact Form 7, Instagram Feed, Jetpack, WooCommerce con WooPayments y PayPal, Hostinger Reach.

## Arquitectura

- **Tema propio mínimo** (`casa-escencia`):
  - `header.php` y `footer.php` con el header y el footer de Next.
  - `page.php` y `single.php`, que imprimen `the_content()`.
  - `functions.php`, que encola `site.css` (el CSS compilado de Tailwind), un `site.js` (menú móvil, fachada de reels y formularios a WhatsApp) y las fuentes locales.
  - El CSS va como archivo encolado, no en "CSS adicional", porque ese se imprime inline en cada página y el navegador no lo cachea.
- **Contenido:** un bloque "HTML personalizado" de Gutenberg por sección. No usamos Elementor.
  - Para SEO da igual una sección por bloque o la página en un solo bloque: Google ve el mismo HTML.
  - Por mantenimiento conviene una sección por bloque: se edita o reordena una sola sin arriesgar la página entera.
- **Formularios:** HTML con validación nativa (`required`, `pattern`). Al enviar, el JS arma el mensaje y abre `wa.me/<número>?text=...` con el chat de la clienta. Sin backend ni plugin.
- **Idiomas:** TranslatePress gratuito, que ya está instalado. Traduce el texto renderizado, incluidos los bloques HTML.

## Fases

0. **Respaldo y copia de pruebas:** respaldo completo en hPanel; trabajar en un subdominio o en LocalWP.
1. **Tema:** archivos del tema; `site.css` sacado del build de Next; fuentes; `site.js`.
2. **Secciones:** HTML de cada sección, tomado del render de Next con rutas de imágenes a la Media Library.
3. **Páginas:** Inicio, Mayoreo, Línea profesional, Sobre nosotros, Contacto y Blog (entradas nativas).
4. **Limpieza:**
   - Borrar Elementor, Elementor Pro, Royal Elementor Addons, Header Footer Elementor, Instagram Feed, Contact Form 7 y Hello Elementor.
   - Cancelar la renovación de Elementor Pro.
   - Redirecciones 301 en `.htaccess`.
5. **QA y lanzamiento:**
   - Comparar contra Next en escritorio y móvil.
   - PageSpeed, formularios hacia WhatsApp y redirecciones.
   - Sitemap en Search Console.

## Pendiente de decidir
- WooCommerce: quitarlo (recomendado si solo hay mayoreo por cotización) o mantenerlo para venta al detalle con CSS propio.
- Medición de leads: un evento de GA4 al enviar el formulario, porque WhatsApp no deja registro en el sitio.
