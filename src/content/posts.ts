import type { Localized } from "@/i18n/config";

type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "list"; items: string[] }
  | { type: "steps"; items: { title: string; text: string }[] }
  | { type: "quote"; text: string };

type PostContent = {
  title: string;
  excerpt: string;
  category: string;
  body: Block[];
};

export type Post = {
  slug: string;
  date: string;
  image: string;
  readingMinutes: number;
  content: Localized<PostContent>;
};

// Slugs idénticos a los del sitio WordPress original para conservar el SEO.
export const posts: Post[] = [
  {
    slug: "aura-hair-brush-el-inicio-de-un-ritual",
    date: "2026-04-09",
    image: "/images/aura-campaign.webp",
    readingMinutes: 3,
    content: {
      es: {
        title: "Aura Hair Brush: el inicio de un ritual",
        excerpt: "El cuidado del cabello no debería sentirse como una tarea más en el día.",
        category: "Productos",
        body: [
          {
            type: "p",
            text: "El cuidado del cabello no debería sentirse como una tarea más en el día. Debería ser un momento de pausa, de conexión y de intención. Ahí es donde nace Aura Hair Brush.",
          },
          { type: "h2", text: "Más que un cepillo" },
          {
            type: "p",
            text: "Aura Hair Brush no es solo una herramienta, es una extensión de tu rutina de cuidado personal. Diseñado para trabajar con la naturaleza de tu cabello, no en contra de ella.",
          },
          {
            type: "p",
            text: "Sus cerdas naturales ayudan a distribuir los aceites desde la raíz hasta las puntas, aportando un brillo saludable, suavidad y una textura más uniforme. El resultado no es solo visible, también se siente.",
          },
          { type: "h2", text: "Cuidado real, resultados visibles" },
          {
            type: "p",
            text: "El uso constante de herramientas adecuadas puede transformar por completo la salud del cabello. Aura Hair Brush:",
          },
          {
            type: "list",
            items: [
              "Ayuda a mejorar el brillo natural",
              "Aporta volumen suave",
              "Reduce la necesidad de productos adicionales",
              "Cuida cada hebra con delicadeza",
            ],
          },
          { type: "p", text: "Es un cambio sutil, pero poderoso." },
          { type: "h2", text: "Un momento para ti" },
          {
            type: "p",
            text: "En medio de días ocupados, pequeños rituales hacen la diferencia. Cepillar tu cabello puede convertirse en un espacio de calma: un momento donde te desconectas del exterior y vuelves a ti.",
          },
          { type: "quote", text: "Aura no busca rapidez. Busca intención." },
          { type: "h2", text: "Diseñado para todos los tipos de cabello" },
          {
            type: "p",
            text: "Sin importar tu tipo de cabello, Aura Hair Brush se adapta para ofrecer un cuidado gentil y efectivo. Porque cada cabello es distinto, pero todos merecen ser tratados con atención y respeto.",
          },
          { type: "h2", text: "El lujo está en lo simple" },
          {
            type: "p",
            text: "El verdadero lujo no siempre es visible. A veces está en lo que sientes: en cómo tu cabello responde, en la suavidad, en el brillo natural que no necesita esfuerzo. Aura Hair Brush es ese tipo de lujo: silencioso, constante y esencial.",
          },
        ],
      },
      en: {
        title: "Aura Hair Brush: the beginning of a ritual",
        excerpt: "Hair care shouldn't feel like just another task in your day.",
        category: "Products",
        body: [
          {
            type: "p",
            text: "Hair care shouldn't feel like just another task in your day. It should be a moment of pause, connection and intention. That's where Aura Hair Brush was born.",
          },
          { type: "h2", text: "More than a brush" },
          {
            type: "p",
            text: "Aura Hair Brush isn't just a tool, it's an extension of your self-care routine. Designed to work with the nature of your hair, not against it.",
          },
          {
            type: "p",
            text: "Its natural bristles help distribute oils from root to tip, bringing healthy shine, softness and a more even texture. The result isn't only visible — you can feel it.",
          },
          { type: "h2", text: "Real care, visible results" },
          {
            type: "p",
            text: "Consistently using the right tools can completely transform the health of your hair. Aura Hair Brush:",
          },
          {
            type: "list",
            items: [
              "Helps enhance natural shine",
              "Adds soft volume",
              "Reduces the need for extra products",
              "Gently cares for every strand",
            ],
          },
          { type: "p", text: "A subtle change, but a powerful one." },
          { type: "h2", text: "A moment for you" },
          {
            type: "p",
            text: "In the middle of busy days, small rituals make the difference. Brushing your hair can become a space of calm: a moment to disconnect from the outside and come back to yourself.",
          },
          { type: "quote", text: "Aura isn't about speed. It's about intention." },
          { type: "h2", text: "Designed for every hair type" },
          {
            type: "p",
            text: "Whatever your hair type, Aura Hair Brush adapts to offer gentle, effective care. Because every head of hair is different, but all deserve to be treated with attention and respect.",
          },
          { type: "h2", text: "Luxury lies in simplicity" },
          {
            type: "p",
            text: "True luxury isn't always visible. Sometimes it's in what you feel: in how your hair responds, in the softness, in the natural shine that takes no effort. Aura Hair Brush is that kind of luxury: quiet, constant and essential.",
          },
        ],
      },
    },
  },
  {
    slug: "mindful-brushing-a-micro-ritual",
    date: "2026-02-25",
    image: "/images/lifestyle-vanity.webp",
    readingMinutes: 2,
    content: {
      es: {
        title: "Cepillado consciente: un microrritual que reduce el estrés y mejora tu cabello",
        excerpt:
          "Los pequeños rituales crean un gran impacto, no por su duración, sino por su intención.",
        category: "Rituales",
        body: [
          {
            type: "p",
            text: "Los pequeños rituales crean un gran impacto, no por su duración, sino por su intención. El cepillado consciente transforma una acción automática en un momento de regulación, enraizamiento y conexión.",
          },
          { type: "p", text: "Cuando bajas el ritmo y estás plenamente presente:" },
          {
            type: "list",
            items: [
              "Disminuye la tensión física",
              "Mejora la conciencia sensorial",
              "Aumenta la constancia en tu rutina de cuidado",
              "Se fortalece la conexión con tu propia imagen",
            ],
          },
          { type: "h2", text: "Cómo practicar el cepillado consciente" },
          {
            type: "steps",
            items: [
              { title: "Sin prisa", text: "Reduce tu velocidad a la mitad." },
              {
                title: "Sin distracciones",
                text: "Sin teléfono. Sin hacer varias cosas a la vez.",
              },
              { title: "Presión suave", text: "Cepilla de la raíz a las puntas sin forzar." },
              { title: "Respiración lenta", text: "Coordina tu movimiento con tu respiración." },
              { title: "Termina con una pausa", text: "Nota la sensación final." },
            ],
          },
        ],
      },
      en: {
        title: "Mindful brushing: a micro-ritual that reduces stress and improves your hair",
        excerpt:
          "Small rituals create big impact — not because of their length, but because of their intention.",
        category: "Rituals",
        body: [
          {
            type: "p",
            text: "Small rituals create big impact — not because of their length, but because of their intention. Mindful brushing transforms an automatic action into a moment of regulation, grounding and connection.",
          },
          { type: "p", text: "When you slow down and become fully present:" },
          {
            type: "list",
            items: [
              "Physical tension decreases",
              "Sensory awareness improves",
              "Consistency in your care routine increases",
              "Your connection with your self-image strengthens",
            ],
          },
          { type: "h2", text: "How to practice mindful brushing" },
          {
            type: "steps",
            items: [
              { title: "Without rushing", text: "Cut your speed in half." },
              { title: "Without distractions", text: "No phone. No multitasking." },
              { title: "Gentle pressure", text: "Brush from roots to ends without forcing." },
              { title: "Slow breathing", text: "Coordinate your movement with your breath." },
              { title: "End with a pause", text: "Notice the final sensation." },
            ],
          },
        ],
      },
    },
  },
  {
    slug: "how-choosing-the-right-brush-can-change-your-hairs-health",
    date: "2026-02-18",
    image: "/images/aura-hair.webp",
    readingMinutes: 3,
    content: {
      es: {
        title: "¿Cómo elegir el cepillo correcto puede cambiar la salud de tu cabello?",
        excerpt:
          "Muchas rutinas de cuidado fallan por una razón simple: se usan las herramientas equivocadas.",
        category: "Cuidado del cabello",
        body: [
          {
            type: "p",
            text: "Muchas rutinas de cuidado del cabello fallan por una razón simple: se están usando las herramientas equivocadas.",
          },
          {
            type: "p",
            text: "El daño mecánico —jalones, fricción y tensión— es una de las causas más comunes de rotura. Y ocurre durante el cepillado diario. Un buen cepillo o peine debe trabajar con tu cabello, no en su contra.",
          },
          { type: "h2", text: "Señales de que tu herramienta no es la adecuada" },
          {
            type: "list",
            items: [
              "Sientes jalones constantes",
              "Escuchas chasquidos al desenredar",
              "Ves cabellos rotos en el cepillo",
              "Aparece más frizz después de peinar",
              "Pierdes volumen natural",
            ],
          },
          { type: "h2", text: "Lo que debe tener una buena herramienta" },
          {
            type: "list",
            items: [
              "Flexibilidad controlada: se dobla sin colapsar",
              "Material de contacto suave: menos fricción",
              "Diseño de espaciado progresivo: desenredado gradual",
              "Peso equilibrado: mejor control del movimiento",
            ],
          },
          { type: "h2", text: "Beneficios de un cepillado adecuado" },
          {
            type: "list",
            items: [
              "Menos rotura",
              "Más brillo natural",
              "Mejor distribución de los aceites naturales",
              "Textura mejorada",
              "Menos estrés en el cuero cabelludo",
            ],
          },
          { type: "quote", text: "No es solo estética: es salud capilar acumulativa." },
        ],
      },
      en: {
        title: "How choosing the right brush can change your hair's health",
        excerpt:
          "Many hair care routines fail for one simple reason: the wrong tools are being used.",
        category: "Hair care",
        body: [
          {
            type: "p",
            text: "Many hair care routines fail for one simple reason: the wrong tools are being used.",
          },
          {
            type: "p",
            text: "Mechanical damage — pulling, friction and tension — is one of the most common causes of breakage. And it happens during daily brushing. A good brush or comb should work with your hair, not against it.",
          },
          { type: "h2", text: "Signs your tool isn't right for you" },
          {
            type: "list",
            items: [
              "You feel constant pulling",
              "You hear snapping sounds while detangling",
              "You see broken hairs in the brush",
              "More frizz appears after styling",
              "You lose natural volume",
            ],
          },
          { type: "h2", text: "What a good tool should have" },
          {
            type: "list",
            items: [
              "Controlled flexibility — bends without collapsing",
              "Soft-contact material — less friction",
              "Progressive spacing design — gradual detangling",
              "Balanced weight — better movement control",
            ],
          },
          { type: "h2", text: "Benefits of proper brushing" },
          {
            type: "list",
            items: [
              "Less breakage",
              "More natural shine",
              "Better distribution of natural oils",
              "Improved texture",
              "Less stress on the scalp",
            ],
          },
          { type: "quote", text: "It's not just aesthetics — it's cumulative hair health." },
        ],
      },
    },
  },
  {
    slug: "the-art-of-turning-daily-care-into-a-beauty-ritual",
    date: "2026-02-10",
    image: "/images/ease-closeup.webp",
    readingMinutes: 2,
    content: {
      es: {
        title: "El arte de convertir el cuidado diario en un ritual de belleza",
        excerpt:
          "Cuando los pequeños gestos diarios se vuelven momentos de presencia, el autocuidado se transforma en ritual.",
        category: "Detrás de Casa Escencia",
        body: [
          {
            type: "p",
            text: "Cuando los pequeños gestos diarios se convierten en momentos de presencia, el autocuidado deja de ser rutina y se transforma en un ritual que nutre cuerpo y mente.",
          },
          {
            type: "p",
            text: "En un día a día acelerado, los momentos de autocuidado suelen convertirse en tareas rápidas. En Casa Escencia creemos lo contrario: el cuidado debe sentirse, disfrutarse y vivirse como un ritual.",
          },
          {
            type: "p",
            text: "Nuestra filosofía nace de una idea clara: los objetos que usamos cada día deben aportar belleza, suavidad y presencia. Por eso diseñamos herramientas para el cabello que combinan materiales seleccionados, funcionalidad real y una estética atemporal.",
          },
          { type: "quote", text: "No creamos accesorios desechables. Creamos piezas duraderas." },
          { type: "p", text: "Cada cepillo y peine está diseñado para:" },
          {
            type: "list",
            items: [
              "Respetar la fibra capilar",
              "Reducir la fricción",
              "Mejorar la experiencia de uso",
              "Elevar la rutina diaria",
              "Aportar una sensación sensorial y visual",
            ],
          },
          {
            type: "p",
            text: "El ritual comienza en lo simple: tomar el cepillo, respirar, deslizar, cuidar. Ese gesto diario, repetido con intención, transforma la relación con uno mismo.",
          },
          {
            type: "p",
            text: "Casa Escencia no es solo una marca de herramientas para el cabello. Es una invitación a vivir el cuidado como una práctica consciente.",
          },
        ],
      },
      en: {
        title: "The art of turning daily care into a beauty ritual",
        excerpt:
          "When small daily gestures become moments of presence, self-care transforms into a ritual.",
        category: "Behind Casa Escencia",
        body: [
          {
            type: "p",
            text: "When small daily gestures become moments of presence, self-care stops being routine and transforms into a ritual that nourishes body and mind.",
          },
          {
            type: "p",
            text: "In a fast-paced daily routine, self-care moments often turn into quick tasks. At Casa Escencia we believe the opposite: care should be felt, enjoyed and lived as a ritual.",
          },
          {
            type: "p",
            text: "Our philosophy is born from a clear idea — the objects we use every day should bring beauty, softness and presence. That's why we design hair tools that combine selected materials, real functionality and timeless aesthetics.",
          },
          {
            type: "quote",
            text: "We don't create disposable accessories. We create lasting pieces.",
          },
          { type: "p", text: "Each brush and comb is designed to:" },
          {
            type: "list",
            items: [
              "Respect the hair fiber",
              "Reduce friction",
              "Improve the user experience",
              "Elevate the everyday routine",
              "Provide a sensory and visual feeling",
            ],
          },
          {
            type: "p",
            text: "The ritual begins in the simple: take the brush, breathe, glide, care. That daily gesture — repeated with intention — transforms your relationship with yourself.",
          },
          {
            type: "p",
            text: "Casa Escencia is not just a brand of hair tools. It is an invitation to live care as a conscious practice.",
          },
        ],
      },
    },
  },
];

export function getPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}
