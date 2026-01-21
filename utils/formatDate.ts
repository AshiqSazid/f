import { format } from "date-fns";

export function formatDate(
  value: string | null | undefined,
  fallback = "Unknown"
): string {
  if (!value) return fallback;
  try {
    return format(new Date(value), "PPP");
  } catch {
    return fallback;
  }
}
