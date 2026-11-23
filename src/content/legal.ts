import type { Localized } from "@/i18n/config";
import type { Block } from "./posts";
import { site } from "./site";

type LegalContent = { title: string; description: string; body: Block[] };

export type LegalPage = { slug: string; updated: string; content: Localized<LegalContent> };

const contact = `${site.email} · WhatsApp ${site.phone}`;

// Slugs del WordPress original. Texto provisional: debe aprobarlo la clienta o su asesor legal.
export const legalPages: LegalPage[] = [
  {
    slug: "terminos-y-condiciones",
    updated: "2026-11-23",
    content: {
      es: {
        title: "Términos y condiciones",
        description:
          "Condiciones de venta al por mayor de Casa Escencia: cotizaciones, pedidos mínimos, pagos, facturación y entregas en El Salvador.",
        body: [
          {
            type: "p",
            text: `Estos términos regulan el uso de casaescencia.com y las ventas al por mayor de Casa Escencia, con domicilio en ${site.address}. Al usar el sitio o solicitar una cotización, aceptas estas condiciones.`,
          },
          { type: "h2", text: "1. Qué es este sitio" },
          {
            type: "p",
            text: "casaescencia.com es un catálogo informativo. No es una tienda en línea: en el sitio no se publican precios, no se realizan compras y no se solicitan datos de pago.",
          },
          { type: "h2", text: "2. Venta solo al por mayor" },
          {
            type: "list",
            items: [
              "Vendemos a negocios y profesionales: salones, barberías, tiendas de belleza, distribuidores y estilistas.",
              "El pedido mínimo es de 25 unidades por producto, en escalas de 25.",
              "No realizamos ventas al detalle desde el sitio.",
            ],
          },
          { type: "h2", text: "3. Cotizaciones" },
          {
            type: "p",
            text: "Los formularios y el panel de pedido arman un mensaje con los productos y las unidades que eliges, y lo abren en WhatsApp para que lo envíes. Ese mensaje es una solicitud de cotización, no un pedido confirmado.",
          },
          {
            type: "p",
            text: "Respondemos con una cotización que indica precios, disponibilidad, condiciones de entrega y vigencia. Los precios dependen del volumen y pueden cambiar sin aviso mientras la cotización no esté aceptada.",
          },
          { type: "h2", text: "4. Confirmación del pedido y pago" },
          {
            type: "list",
            items: [
              "El pedido queda confirmado cuando ambas partes aceptan la cotización por escrito (WhatsApp o correo) y se recibe el pago o el anticipo acordado.",
              "Los precios se expresan en dólares de los Estados Unidos (USD). La cotización indica si incluyen IVA.",
              "La forma de pago se coordina directamente con Casa Escencia. Nunca te pediremos datos de tarjeta por el sitio.",
              "Los pedidos sujetos a disponibilidad pueden ajustarse antes de confirmarse; te avisaremos de cualquier cambio.",
            ],
          },
          { type: "h2", text: "5. Facturación" },
          {
            type: "p",
            text: "Emitimos factura electrónica (documento tributario electrónico) conforme a la normativa del Ministerio de Hacienda. Para emitirla te pediremos los datos fiscales de tu negocio y un correo electrónico donde enviarla. Eres responsable de que esos datos sean correctos.",
          },
          { type: "h2", text: "6. Entregas" },
          {
            type: "list",
            items: [
              "Entregamos en todo El Salvador. El envío no tiene costo, salvo que la cotización indique otra cosa.",
              "La fecha y la forma de entrega se acuerdan al confirmar el pedido. Los plazos son estimados y pueden variar por causas ajenas a Casa Escencia.",
              "Revisa el pedido al recibirlo. Cualquier faltante o daño visible debe reportarse en ese momento o dentro de las 48 horas siguientes, con fotos.",
            ],
          },
          { type: "h2", text: "7. Cambios, devoluciones y garantía" },
          {
            type: "list",
            items: [
              "Reponemos los productos con defecto de fábrica reportados dentro de los 7 días hábiles siguientes a la entrega, previa revisión.",
              "La garantía no cubre el desgaste normal, el mal uso, el uso de calor excesivo ni las modificaciones al producto.",
              "No aceptamos devoluciones por cambio de opinión en pedidos al por mayor, salvo acuerdo por escrito.",
            ],
          },
          { type: "h2", text: "8. Productos e imágenes" },
          {
            type: "p",
            text: "Las fotografías y descripciones son referenciales. Pueden existir variaciones menores de color, acabado o empaque entre lotes. Podemos cambiar o descontinuar productos sin previo aviso.",
          },
          { type: "h2", text: "9. Propiedad intelectual" },
          {
            type: "p",
            text: "La marca Casa Escencia, los nombres de producto, el logotipo, las fotografías y los textos del sitio pertenecen a Casa Escencia. Los revendedores pueden usar el material de producto para promocionar productos comprados a Casa Escencia; cualquier otro uso requiere autorización por escrito.",
          },
          { type: "h2", text: "10. Servicios de terceros" },
          {
            type: "p",
            text: "El sitio enlaza a WhatsApp e Instagram, que tienen sus propios términos y políticas. Casa Escencia no controla esos servicios.",
          },
          { type: "h2", text: "11. Responsabilidad" },
          {
            type: "p",
            text: "Procuramos que la información del sitio sea exacta y esté disponible, pero no garantizamos que esté libre de errores o interrupciones. Nuestra responsabilidad por un pedido se limita al valor pagado por ese pedido.",
          },
          { type: "h2", text: "12. Ley aplicable" },
          {
            type: "p",
            text: "Estos términos se rigen por las leyes de la República de El Salvador. Cualquier controversia se intentará resolver primero de forma directa; de no lograrse, se someterá a los tribunales competentes de San Salvador.",
          },
          { type: "h2", text: "13. Cambios y contacto" },
          {
            type: "p",
            text: `Podemos actualizar estos términos; la versión vigente es la publicada en esta página con su fecha. Para cualquier consulta: ${contact}.`,
          },
        ],
      },
      en: {
        title: "Terms and conditions",
        description:
          "Casa Escencia wholesale terms: quotes, minimum orders, payment, invoicing and delivery in El Salvador.",
        body: [
          {
            type: "p",
            text: `These terms govern the use of casaescencia.com and wholesale sales by Casa Escencia, based in ${site.address}. By using the site or requesting a quote, you accept these terms.`,
          },
          { type: "h2", text: "1. What this site is" },
          {
            type: "p",
            text: "casaescencia.com is an informational catalog, not an online store. No prices are published, no purchases are made and no payment details are requested on the site.",
          },
          { type: "h2", text: "2. Wholesale only" },
          {
            type: "list",
            items: [
              "We sell to businesses and professionals: salons, barbershops, beauty stores, distributors and stylists.",
              "The minimum order is 25 units per product, in steps of 25.",
              "We do not sell at retail through the site.",
            ],
          },
          { type: "h2", text: "3. Quotes" },
          {
            type: "p",
            text: "The forms and the order panel build a message with the products and units you choose, and open it in WhatsApp for you to send. That message is a quote request, not a confirmed order.",
          },
          {
            type: "p",
            text: "We reply with a quote stating prices, availability, delivery terms and validity. Prices depend on volume and may change without notice until the quote is accepted.",
          },
          { type: "h2", text: "4. Order confirmation and payment" },
          {
            type: "list",
            items: [
              "An order is confirmed once both parties accept the quote in writing (WhatsApp or email) and the agreed payment or deposit is received.",
              "Prices are in United States dollars (USD). The quote states whether VAT is included.",
              "Payment is arranged directly with Casa Escencia. We will never ask for card details through the site.",
              "Orders subject to availability may be adjusted before confirmation; we will let you know of any change.",
            ],
          },
          { type: "h2", text: "5. Invoicing" },
          {
            type: "p",
            text: "We issue electronic invoices (electronic tax documents) under the regulations of El Salvador's Ministry of Finance. To issue one we will ask for your business tax details and an email address to send it to. You are responsible for that information being correct.",
          },
          { type: "h2", text: "6. Delivery" },
          {
            type: "list",
            items: [
              "We deliver throughout El Salvador. Shipping is free unless the quote states otherwise.",
              "Delivery date and method are agreed when the order is confirmed. Lead times are estimates and may vary for reasons beyond Casa Escencia's control.",
              "Check your order on arrival. Any missing items or visible damage must be reported at delivery or within 48 hours, with photos.",
            ],
          },
          { type: "h2", text: "7. Exchanges, returns and warranty" },
          {
            type: "list",
            items: [
              "We replace products with manufacturing defects reported within 7 business days of delivery, after inspection.",
              "The warranty does not cover normal wear, misuse, excessive heat or modifications to the product.",
              "Wholesale orders cannot be returned for change of mind unless agreed in writing.",
            ],
          },
          { type: "h2", text: "8. Products and images" },
          {
            type: "p",
            text: "Photos and descriptions are for reference. Minor variations in color, finish or packaging may occur between batches. We may change or discontinue products without notice.",
          },
          { type: "h2", text: "9. Intellectual property" },
          {
            type: "p",
            text: "The Casa Escencia brand, product names, logo, photos and site copy belong to Casa Escencia. Resellers may use product material to promote products bought from Casa Escencia; any other use requires written permission.",
          },
          { type: "h2", text: "10. Third-party services" },
          {
            type: "p",
            text: "The site links to WhatsApp and Instagram, which have their own terms and policies. Casa Escencia does not control those services.",
          },
          { type: "h2", text: "11. Liability" },
          {
            type: "p",
            text: "We strive to keep the site accurate and available but do not guarantee it is free of errors or interruptions. Our liability for an order is limited to the amount paid for that order.",
          },
          { type: "h2", text: "12. Governing law" },
          {
            type: "p",
            text: "These terms are governed by the laws of the Republic of El Salvador. Any dispute will first be addressed directly; failing that, it will be submitted to the competent courts of San Salvador.",
          },
          { type: "h2", text: "13. Changes and contact" },
          {
            type: "p",
            text: `We may update these terms; the version in force is the one published on this page with its date. For any question: ${contact}.`,
          },
        ],
      },
    },
  },
  {
    slug: "privacy-policy",
    updated: "2026-11-23",
    content: {
      es: {
        title: "Política de privacidad",
        description:
          "Cómo Casa Escencia trata los datos que compartes al solicitar una cotización por WhatsApp.",
        body: [
          {
            type: "p",
            text: `Casa Escencia, con domicilio en ${site.address}, es responsable de los datos personales que compartes con nosotros. Esta política explica qué datos recibimos, para qué los usamos y cómo ejercer tus derechos.`,
          },
          { type: "h2", text: "1. El sitio no guarda tus datos" },
          {
            type: "p",
            text: "casaescencia.com no tiene cuentas de usuario ni base de datos. Cuando completas un formulario, tu navegador arma un mensaje y lo abre en WhatsApp. Solo recibimos tus datos si tú decides enviar ese mensaje.",
          },
          { type: "h2", text: "2. Datos que recibimos" },
          {
            type: "list",
            items: [
              "Del formulario: nombre, nombre del negocio, número de WhatsApp, tipo de negocio, productos y unidades, y, si los incluyes, correo electrónico, ciudad y mensaje.",
              "Durante la cotización: los datos fiscales de tu negocio y un correo electrónico, necesarios para emitir la factura electrónica, y la dirección de entrega.",
              "Tu número y nombre de perfil de WhatsApp, que esa aplicación comparte al escribirnos.",
            ],
          },
          { type: "h2", text: "3. Para qué los usamos" },
          {
            type: "list",
            items: [
              "Preparar y enviar tu cotización.",
              "Coordinar el pago y la entrega de tu pedido.",
              "Emitir la factura electrónica y cumplir obligaciones tributarias.",
              "Atender consultas, garantías y reclamos.",
              "Informarte sobre productos nuevos, solo si nos lo autorizas.",
            ],
          },
          { type: "p", text: "No vendemos ni alquilamos tus datos." },
          { type: "h2", text: "4. Tu pedido en el navegador" },
          {
            type: "p",
            text: "Los productos que agregas a tu pedido se guardan en el almacenamiento local de tu navegador para que no se pierdan al cambiar de página. Esa información no sale de tu dispositivo hasta que envías el mensaje. Puedes borrarla vaciando tu pedido o los datos del sitio en tu navegador.",
          },
          { type: "h2", text: "5. Analítica y contenido de terceros" },
          {
            type: "list",
            items: [
              "Usamos Google Analytics para medir de forma agregada las visitas y cuántas solicitudes se envían. Google puede usar cookies e identificadores del dispositivo. Puedes bloquearlas en tu navegador o con el complemento de inhabilitación de Google Analytics.",
              "Los videos de Instagram y YouTube se cargan solo cuando los abres; a partir de ese momento Meta o Google pueden recopilar datos según sus propias políticas. Los de YouTube usan su modo de privacidad mejorada.",
              "Las tipografías y las imágenes se sirven desde nuestro propio servidor.",
            ],
          },
          { type: "h2", text: "6. Con quién compartimos datos" },
          {
            type: "list",
            items: [
              "WhatsApp (Meta), por donde nos escribes.",
              "Google, para la analítica del sitio.",
              "Hostinger, que aloja el sitio.",
              "El Ministerio de Hacienda, por la facturación electrónica.",
              "Empresas de transporte, solo los datos necesarios para la entrega.",
              "Autoridades, cuando la ley lo exija.",
            ],
          },
          { type: "h2", text: "7. Cuánto tiempo los conservamos" },
          {
            type: "p",
            text: "Conservamos las conversaciones y los datos de pedidos mientras exista una relación comercial. Los datos de facturación se conservan durante el plazo que exige la legislación tributaria de El Salvador.",
          },
          { type: "h2", text: "8. Tus derechos" },
          {
            type: "p",
            text: `Puedes pedirnos acceder a tus datos, corregirlos, eliminarlos u oponerte a que los usemos para fines promocionales. Escríbenos a ${contact}. Conservaremos solo lo que la ley nos obligue a guardar.`,
          },
          { type: "h2", text: "9. Seguridad" },
          {
            type: "p",
            text: "El sitio funciona solo con conexión cifrada (HTTPS) y no procesa pagos. Limitamos el acceso a tus datos a las personas que atienden tu pedido.",
          },
          { type: "h2", text: "10. Menores de edad" },
          {
            type: "p",
            text: "El sitio está dirigido a negocios y profesionales. No recopilamos a sabiendas datos de menores de 18 años.",
          },
          { type: "h2", text: "11. Cambios" },
          {
            type: "p",
            text: "Podemos actualizar esta política; la versión vigente es la publicada en esta página con su fecha.",
          },
        ],
      },
      en: {
        title: "Privacy policy",
        description:
          "How Casa Escencia handles the information you share when requesting a quote via WhatsApp.",
        body: [
          {
            type: "p",
            text: `Casa Escencia, based in ${site.address}, is responsible for the personal data you share with us. This policy explains what data we receive, what we use it for and how to exercise your rights.`,
          },
          { type: "h2", text: "1. The site does not store your data" },
          {
            type: "p",
            text: "casaescencia.com has no user accounts and no database. When you fill in a form, your browser builds a message and opens it in WhatsApp. We only receive your data if you choose to send that message.",
          },
          { type: "h2", text: "2. Data we receive" },
          {
            type: "list",
            items: [
              "From the form: name, business name, WhatsApp number, business type, products and units, and, if you include them, email, city and message.",
              "During the quote: your business tax details and an email address, needed to issue the electronic invoice, and the delivery address.",
              "Your WhatsApp number and profile name, which the app shares when you message us.",
            ],
          },
          { type: "h2", text: "3. What we use it for" },
          {
            type: "list",
            items: [
              "Preparing and sending your quote.",
              "Arranging payment and delivery of your order.",
              "Issuing the electronic invoice and meeting tax obligations.",
              "Handling questions, warranty claims and complaints.",
              "Telling you about new products, only if you allow us to.",
            ],
          },
          { type: "p", text: "We do not sell or rent your data." },
          { type: "h2", text: "4. Your order in the browser" },
          {
            type: "p",
            text: "The products you add to your order are saved in your browser's local storage so they are kept when you change pages. That information does not leave your device until you send the message. You can delete it by emptying your order or clearing the site data in your browser.",
          },
          { type: "h2", text: "5. Analytics and third-party content" },
          {
            type: "list",
            items: [
              "We use Google Analytics to measure visits and how many requests are sent, in aggregate. Google may use cookies and device identifiers. You can block them in your browser or with the Google Analytics opt-out add-on.",
              "Instagram and YouTube videos load only when you open them; from then on Meta or Google may collect data under their own policies. YouTube videos use its privacy-enhanced mode.",
              "Fonts and images are served from our own server.",
            ],
          },
          { type: "h2", text: "6. Who we share data with" },
          {
            type: "list",
            items: [
              "WhatsApp (Meta), where you message us.",
              "Google, for site analytics.",
              "Hostinger, which hosts the site.",
              "El Salvador's Ministry of Finance, for electronic invoicing.",
              "Delivery companies, only the data needed for delivery.",
              "Authorities, when required by law.",
            ],
          },
          { type: "h2", text: "7. How long we keep it" },
          {
            type: "p",
            text: "We keep conversations and order data for as long as there is a business relationship. Invoicing data is kept for the period required by El Salvador's tax laws.",
          },
          { type: "h2", text: "8. Your rights" },
          {
            type: "p",
            text: `You can ask us to access, correct or delete your data, or object to its use for promotional purposes. Write to ${contact}. We will keep only what the law requires us to retain.`,
          },
          { type: "h2", text: "9. Security" },
          {
            type: "p",
            text: "The site works only over an encrypted connection (HTTPS) and does not process payments. Access to your data is limited to the people handling your order.",
          },
          { type: "h2", text: "10. Minors" },
          {
            type: "p",
            text: "The site is aimed at businesses and professionals. We do not knowingly collect data from anyone under 18.",
          },
          { type: "h2", text: "11. Changes" },
          {
            type: "p",
            text: "We may update this policy; the version in force is the one published on this page with its date.",
          },
        ],
      },
    },
  },
];

export function getLegalPage(slug: string) {
  return legalPages.find((page) => page.slug === slug);
}
