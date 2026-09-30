import { adminLogoutAction } from "@/server/actions/auth-actions";
import { Button } from "@/components/ui/Button";

export function AdminLogoutButton({
  className,
  variant = "outline",
}: {
  className?: string;
  variant?: "outline" | "outlineLight";
}) {
  return (
    <form action={adminLogoutAction}>
      <Button type="submit" variant={variant} size="sm" className={className}>
        Cerrar sesión
      </Button>
    </form>
  );
}
