import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatCurrency(amount: number) {
  return currencyFormatter.format(amount);
}

export function formatDate(date: Date | string, locale = "es") {
  return new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" }).format(
    new Date(date),
  );
}

// El Salvador no tiene horario de verano: UTC-6 todo el año.
export const STORE_TIME_ZONE = "America/El_Salvador";

export function formatDateTime(date: Date | string, locale = "es") {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: STORE_TIME_ZONE,
  }).format(new Date(date));
}

export function formatDozens(count: number, t: { dozen: string; dozens: string }) {
  return count === 1 ? t.dozen : t.dozens.replace("{count}", String(count));
}

export function orderCode(number: number) {
  return `CE-${String(number).padStart(4, "0")}`;
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: string) {
  return UUID_PATTERN.test(value);
}

// Tamaño de página compartido por los listados paginados del admin — un solo
// lugar si se ajusta más adelante.
export const ADMIN_PAGE_SIZE = 20;
