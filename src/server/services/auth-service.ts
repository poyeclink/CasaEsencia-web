import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/password";

export class AuthError extends Error {
  constructor(public key: "invalidCredentials" | "emailTaken") {
    super(key);
  }
}

type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

type LoginInput = {
  email: string;
  password: string;
};

export async function registerCustomer(input: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw new AuthError("emailTaken");

  const passwordHash = await hashPassword(input.password);
  return prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      role: "cliente",
    },
  });
}

async function authenticateByRole(input: LoginInput, role: "cliente" | "administrador") {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) throw new AuthError("invalidCredentials");

  const validPassword = await verifyPassword(input.password, user.passwordHash);
  if (!validPassword) throw new AuthError("invalidCredentials");

  if (user.role !== role) throw new AuthError("invalidCredentials");

  return user;
}

export function authenticateCustomer(input: LoginInput) {
  return authenticateByRole(input, "cliente");
}

export function authenticateAdmin(input: LoginInput) {
  return authenticateByRole(input, "administrador");
}
