/**
 * r2.ts — Cloudflare R2 helpers via the S3-compatible API
 * Updated for Cloudflare Workers / Edge Compatibility
 */

import {
    S3Client,
    GetObjectCommand,
    PutObjectCommand,
    DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { FetchHttpHandler } from "@smithy/fetch-http-handler";
import type { BlogPost, BlogPostIndex, BlogPostMeta } from "@/types";
import { Sha256 } from "@aws-crypto/sha256-js";

// ─── S3 client (R2 is S3-compatible) ─────────────────────────────────────────

let s3Client: S3Client | null = null;

function getClient(): S3Client {

    console.log("--- R2 CONFIG CHECK ---");
    console.log("Account ID exists:", process.env.R2_ACCOUNT_ID);
    console.log("Access Key exists:", process.env.R2_ACCESS_KEY_ID);
    console.log("Secret Access Key exists:", process.env.R2_SECRET_ACCESS_KEY);

    if (s3Client) return s3Client;

    const accessKeyId = process.env.R2_ACCESS_KEY_ID!;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY!;

    s3Client = new S3Client({
        region: "auto",
        endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: { accessKeyId, secretAccessKey },
        requestHandler: new FetchHttpHandler(),
        // 💡 THE "CLEAN" OVERRIDES
        // These stop the SDK from calling the internal 'Node' provider chain
        credentialDefaultProvider: () => () => Promise.resolve({ accessKeyId, secretAccessKey }),
        regionDefaultProvider: () => () => Promise.resolve("auto"),
    } as any);

    return s3Client;
}

const BUCKET = () => process.env.R2_BUCKET_NAME ?? "travellingbeku-content";
const PUBLIC_URL = () => process.env.R2_PUBLIC_URL ?? "";

// ─── Generic helpers ──────────────────────────────────────────────────────────

async function getJson<T>(key: string): Promise<T | null> {
    try {
        const cmd = new GetObjectCommand({ Bucket: BUCKET(), Key: key });
        const res = await getClient().send(cmd);

        // In Edge environments, Body.transformToString() is the safest way to read stream
        const body = await res.Body?.transformToString("utf-8");
        if (!body) return null;
        return JSON.parse(body) as T;
    } catch (err) {
        console.error(`Error fetching ${key} from R2:`, err);
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

export async function getAllPostsMeta(): Promise<BlogPostMeta[]> {
    const index = await getIndex();
    return index.posts.filter((p) => p.published);
}

export async function getAllPostsAdmin(): Promise<BlogPostMeta[]> {
    const index = await getIndex();
    return index.posts;
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
    return getJson<BlogPost>(`posts/${slug}.json`);
}

export async function getPostById(id: string): Promise<BlogPost | null> {
    const index = await getIndex();
    const meta = index.posts.find((p) => p.id === id);
    if (!meta) return null;
    return getPostBySlug(meta.slug);
}

export async function upsertPost(post: BlogPost): Promise<void> {
    await putJson(`posts/${post.slug}.json`, post);

    const index = await getIndex();
    const { content: _content, ...meta } = post;
    const existing = index.posts.findIndex((p) => p.id === post.id);

    if (existing >= 0) {
        index.posts[existing] = meta;
    } else {
        index.posts.unshift(meta);
    }
    await saveIndex(index);
}

export async function deletePost(id: string): Promise<boolean> {
    const index = await getIndex();
    const meta = index.posts.find((p) => p.id === id);
    if (!meta) return false;

    await deleteObject(`posts/${meta.slug}.json`);
    index.posts = index.posts.filter((p) => p.id !== id);
    await saveIndex(index);
    return true;
}

export async function uploadCoverImage(
    slug: string,
    buffer: Buffer,
    mimeType: string
): Promise<string> {
    const ext = mimeType.split("/")[1] ?? "jpg";
    const key = `images/covers/${slug}.${ext}`;
    return putBinary(key, buffer, mimeType);
}

export async function uploadInlineImage(
    filename: string,
    buffer: Buffer,
    mimeType: string
): Promise<string> {
    const key = `images/inline/${Date.now()}-${filename}`;
    return putBinary(key, buffer, mimeType);
}