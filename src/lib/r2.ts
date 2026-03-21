/**
 * r2.ts — Cloudflare R2 helpers via the S3-compatible API
 *
 * R2 bucket layout:
 *   posts/index.json          ← master post-list manifest
 *   posts/<slug>.json         ← individual post data (BlogPost)
 *   images/covers/<slug>.*    ← cover images
 *   images/inline/<uuid>.*    ← images dropped into the editor
 */

import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import type { BlogPost, BlogPostIndex, BlogPostMeta } from "@/types";

// ─── S3 client (R2 is S3-compatible) ─────────────────────────────────────────

function getClient(): S3Client {
  const accountId = process.env.R2_ACCOUNT_ID!;
  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

const BUCKET = () => process.env.R2_BUCKET_NAME ?? "travellingbeku-content";
const PUBLIC_URL = () => process.env.R2_PUBLIC_URL ?? "";

// ─── Generic helpers ──────────────────────────────────────────────────────────

async function getJson<T>(key: string): Promise<T | null> {
  try {
    const cmd = new GetObjectCommand({ Bucket: BUCKET(), Key: key });
    const res = await getClient().send(cmd);
    const body = await res.Body?.transformToString("utf-8");
    if (!body) return null;
    return JSON.parse(body) as T;
  } catch {
    return null;
  }
}

async function putJson<T>(key: string, value: T): Promise<void> {
  const cmd = new PutObjectCommand({
    Bucket: BUCKET(),
    Key: key,
    Body: JSON.stringify(value, null, 2),
    ContentType: "application/json",
  });
  await getClient().send(cmd);
}

async function putBinary(
  key: string,
  body: Uint8Array | Buffer,
  contentType: string
): Promise<string> {
  const cmd = new PutObjectCommand({
    Bucket: BUCKET(),
    Key: key,
    Body: body,
    ContentType: contentType,
  });
  await getClient().send(cmd);
  return `${PUBLIC_URL()}/${key}`;
}

async function deleteObject(key: string): Promise<void> {
  const cmd = new DeleteObjectCommand({ Bucket: BUCKET(), Key: key });
  await getClient().send(cmd);
}

// ─── Index management ─────────────────────────────────────────────────────────

const INDEX_KEY = "posts/index.json";

async function getIndex(): Promise<BlogPostIndex> {
  const idx = await getJson<BlogPostIndex>(INDEX_KEY);
  return idx ?? { posts: [], updated_at: new Date().toISOString() };
}

async function saveIndex(index: BlogPostIndex): Promise<void> {
  await putJson(INDEX_KEY, { ...index, updated_at: new Date().toISOString() });
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** Fetch the lightweight manifest of all published posts. */
export async function getAllPostsMeta(): Promise<BlogPostMeta[]> {
  const index = await getIndex();
  return index.posts.filter((p) => p.published);
}

/** Fetch ALL posts (published + drafts) — admin use only. */
export async function getAllPostsAdmin(): Promise<BlogPostMeta[]> {
  const index = await getIndex();
  return index.posts;
}

/** Fetch a full post by slug. */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  return getJson<BlogPost>(`posts/${slug}.json`);
}

/** Fetch a full post by id (scans index then fetches by slug). */
export async function getPostById(id: string): Promise<BlogPost | null> {
  const index = await getIndex();
  const meta = index.posts.find((p) => p.id === id);
  if (!meta) return null;
  return getPostBySlug(meta.slug);
}

/** Create or fully overwrite a post. */
export async function upsertPost(post: BlogPost): Promise<void> {
  // 1. Save full post JSON
  await putJson(`posts/${post.slug}.json`, post);

  // 2. Update index
  const index = await getIndex();
  const { content: _content, ...meta } = post; // strip content for index
  const existing = index.posts.findIndex((p) => p.id === post.id);
  if (existing >= 0) {
    index.posts[existing] = meta;
  } else {
    index.posts.unshift(meta);
  }
  await saveIndex(index);
}

/** Delete a post by id. */
export async function deletePost(id: string): Promise<boolean> {
  const index = await getIndex();
  const meta = index.posts.find((p) => p.id === id);
  if (!meta) return false;

  await deleteObject(`posts/${meta.slug}.json`);
  index.posts = index.posts.filter((p) => p.id !== id);
  await saveIndex(index);
  return true;
}

/** Upload a cover image. Returns its public URL. */
export async function uploadCoverImage(
  slug: string,
  buffer: Buffer,
  mimeType: string
): Promise<string> {
  const ext = mimeType.split("/")[1] ?? "jpg";
  const key = `images/covers/${slug}.${ext}`;
  return putBinary(key, buffer, mimeType);
}

/** Upload an inline editor image. Returns its public URL. */
export async function uploadInlineImage(
  filename: string,
  buffer: Buffer,
  mimeType: string
): Promise<string> {
  const key = `images/inline/${Date.now()}-${filename}`;
  return putBinary(key, buffer, mimeType);
}
