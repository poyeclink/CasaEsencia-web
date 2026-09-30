import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";

async function upsertUser(
  role: "administrador" | "cliente",
  { name, email, password }: { name?: string; email?: string; password?: string },
  fallbackName: string,
) {
  if (!email || !password) {
    console.log(`Credenciales de ${role} no configuradas — se omite.`);
    return;
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash, role },
    create: { name: name || fallbackName, email, passwordHash, role },
  });

  console.log(`${role} listo: ${user.email}`);
}

async function main() {
  const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME, DEMO_CUSTOMER_EMAIL, DEMO_CUSTOMER_PASSWORD } =
    process.env;

  await upsertUser(
    "administrador",
    { name: ADMIN_NAME, email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
    "Administrador",
  );
  // Cuenta de cliente de prueba para ver la tienda como la ve un comprador.
  await upsertUser(
    "cliente",
    { name: "Cliente de prueba", email: DEMO_CUSTOMER_EMAIL, password: DEMO_CUSTOMER_PASSWORD },
    "Cliente de prueba",
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
