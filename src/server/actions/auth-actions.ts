"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import {
  AuthError,
  authenticateAdmin,
  authenticateCustomer,
  registerCustomer,
} from "@/server/services/auth-service";
import { setSessionCookie, clearSessionCookie } from "@/lib/session";
import { defaultLocale, hasLocale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";

// Los errores son claves de dict.auth.errors: el cliente los traduce. El panel
// admin es solo en español y los traduce con el diccionario es.
export type AuthErrorKey = keyof Dictionary["auth"]["errors"];
export type AuthActionState = { error?: AuthErrorKey };

const registerSchema = z.object({
  name: z.string().trim().min(2, "nameShort"),
  email: z.email("email"),
  password: z.string().min(8, "passwordShort"),
});

const loginSchema = z.object({
  email: z.email("email"),
  password: z.string().min(1, "passwordRequired"),
});

function localeFrom(formData: FormData) {
  const value = String(formData.get("locale") ?? "");
  return hasLocale(value) ? value : defaultLocale;
}

// Solo rutas internas del mismo idioma: evita redirecciones abiertas (?next=//evil.com).
function nextPath(formData: FormData) {
  const locale = localeFrom(formData);
  const next = String(formData.get("next") ?? "");
  return next.startsWith(`/${locale}/`) && !next.startsWith("//") ? next : `/${locale}/my-account`;
}

function firstError(error: z.ZodError): AuthErrorKey {
  return (error.issues[0]?.message as AuthErrorKey) ?? "invalidCredentials";
}

export async function registerAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: firstError(parsed.error) };

  try {
    const user = await registerCustomer(parsed.data);
    await setSessionCookie({ userId: user.id, role: user.role, name: user.name });
  } catch (error) {
    if (error instanceof AuthError) return { error: error.key };
    throw error;
  }

  redirect(nextPath(formData));
}

export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: firstError(parsed.error) };

  try {
    const user = await authenticateCustomer(parsed.data);
    await setSessionCookie({ userId: user.id, role: user.role, name: user.name });
  } catch (error) {
    if (error instanceof AuthError) return { error: error.key };
    throw error;
  }

  redirect(nextPath(formData));
}

export async function logoutAction(formData: FormData) {
  await clearSessionCookie();
  redirect(`/${localeFrom(formData)}/login`);
}

export async function adminLoginAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: firstError(parsed.error) };

  try {
    const user = await authenticateAdmin(parsed.data);
    await setSessionCookie({ userId: user.id, role: user.role, name: user.name });
  } catch (error) {
    if (error instanceof AuthError) return { error: error.key };
    throw error;
  }

  redirect("/admin");
}

export async function adminLogoutAction() {
  await clearSessionCookie();
  redirect("/acceso-admin");
}
