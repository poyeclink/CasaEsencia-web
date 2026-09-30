import { logoutAction } from "@/server/actions/auth-actions";
import { Button } from "@/components/ui/Button";
import type { Locale } from "@/i18n/config";

export function LogoutButton({ locale, label }: { locale: Locale; label: string }) {
  return (
    <form action={logoutAction}>
      <input type="hidden" name="locale" value={locale} />
      <Button type="submit" variant="outline">
        {label}
      </Button>
    </form>
  );
}
