// ─────────────────────────────────────────────────────────────
//  Core domain types
// ─────────────────────────────────────────────────────────────

export interface BlogPost {
  /** UUID v4 — primary key */
  id: string;
  /** Human-readable URL slug, e.g. "exploring-bali" */
  slug: string;
  title: string;
  /** Short excerpt shown on cards (auto-generated if absent) */
  excerpt: string;
  /** Tiptap HTML output */
  content: string;
  /** Public R2 URL for the cover image */
  image_url: string;
  /** Comma-separated category tags e.g. ["asia", "beaches"] */
  categories: string[];
  /** ISO 8601 string */
  created_at: string;
  /** ISO 8601 string */
  updated_at: string;
  published: boolean;
}

/** Lightweight card representation — no full content */
export type BlogPostMeta = Omit<BlogPost, "content">;

export interface BlogPostIndex {
  /** All post slugs + metadata, stored in R2 as posts/index.json */
  posts: BlogPostMeta[];
  updated_at: string;
}

// ─────────────────────────────────────────────────────────────
//  Admin form
// ─────────────────────────────────────────────────────────────

export interface BlogFormValues {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  categories: string;
  published: boolean;
  coverFile?: File | null;
}

// ─────────────────────────────────────────────────────────────
//  R2 / storage
// ─────────────────────────────────────────────────────────────

export interface UploadResult {
  url: string;
  key: string;
}

// ─────────────────────────────────────────────────────────────
//  Shared API response shape
// ─────────────────────────────────────────────────────────────

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };
