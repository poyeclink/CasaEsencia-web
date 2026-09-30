"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction, type AuthActionState } from "@/server/actions/auth-actions";
import { TextField } from "@/components/ui/TextField";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormError } from "@/components/ui/FormError";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";

const initialState: AuthActionState = {};

type Props = { locale: Locale; t: Dictionary["auth"]; next?: string };

export function RegisterForm({ locale, t, next }: Props) {
  const [state, formAction] = useActionState(registerAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="locale" value={locale} />
      {next && <input type="hidden" name="next" value={next} />}
      <TextField label={t.name} name="name" type="text" autoComplete="name" required />
      <TextField label={t.email} name="email" type="email" autoComplete="email" required />
      <TextField
        label={t.password}
        name="password"
        type="password"
        autoComplete="new-password"
        minLength={8}
        required
      />
      <FormError message={state.error && t.errors[state.error]} />
      <SubmitButton>{t.registerSubmit}</SubmitButton>
      <p className="text-center text-sm text-muted-foreground">
        {t.hasAccount}{" "}
        <Link
          href={`/${locale}/login${next ? `?next=${encodeURIComponent(next)}` : ""}`}
          className="font-semibold text-foreground underline underline-offset-4"
        >
          {t.loginLink}
        </Link>
      </p>
    </form>
  );
}
