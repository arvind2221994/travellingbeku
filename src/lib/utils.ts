import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Convert a title to a URL-safe slug */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Format ISO date to readable string */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(iso));
}

/** Strip HTML tags to generate a plain-text excerpt */
export function stripHtml(html: string, maxLength = 160): string {
  const plain = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return plain.length <= maxLength ? plain : plain.slice(0, maxLength) + "…";
}

/** Safe async wrapper — returns [data, null] or [null, Error] */
export async function tryCatch<T>(
  promise: Promise<T>
): Promise<[T, null] | [null, Error]> {
  try {
    return [await promise, null];
  } catch (e) {
    return [null, e instanceof Error ? e : new Error(String(e))];
  }
}
