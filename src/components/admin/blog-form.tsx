"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { saveBlogPost } from "@/actions/blog-actions";
import { slugify } from "@/lib/utils";
import { TiptapEditor } from "@/components/editor/tiptap-editor";
import type { BlogPost } from "@/types";
import {
  Loader2,
  Upload,
  X,
  Eye,
  EyeOff,
  Save,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";

interface BlogFormProps {
  post?: BlogPost; // undefined = new post
}

export function BlogForm({ post }: BlogFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fields
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [categories, setCategories] = useState(
    post?.categories.join(", ") ?? ""
  );
  const [published, setPublished] = useState(post?.published ?? false);
  const [content, setContent] = useState(post?.content ?? "");

  // Cover image
  const [coverPreview, setCoverPreview] = useState<string | null>(
    post?.image_url ?? null
  );
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleTitleChange = (v: string) => {
    setTitle(v);
    if (!post) setSlug(slugify(v));
  };

  const handleCoverChange = (file: File) => {
    setCoverFile(file);
    const url = URL.createObjectURL(file);
    setCoverPreview(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) return setError("Title is required.");
    if (!content.trim()) return setError("Content cannot be empty.");

    const fd = new FormData();
    if (post?.id) fd.append("id", post.id);
    fd.append("title", title);
    fd.append("slug", slug);
    fd.append("excerpt", excerpt);
    fd.append("content", content);
    fd.append("categories", categories);
    fd.append("published", String(published));
    if (coverFile) fd.append("coverFile", coverFile);

    startTransition(async () => {
      const result = await saveBlogPost(fd);
      if (result.ok) {
        setSaved(true);
        setTimeout(() => {
          router.push("/admin");
          router.refresh();
        }, 1000);
      } else {
        setError("Failed to save post. Please try again.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {/* Error */}
      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-widest">
          Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="An Unforgettable Week in Bali…"
          className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-white/8 text-white placeholder-neutral-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all text-lg font-semibold"
        />
      </div>

      {/* Slug + Excerpt row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-widest">
            Slug
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(slugify(e.target.value))}
            placeholder="auto-generated-from-title"
            className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/8 text-white placeholder-neutral-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all text-sm font-mono"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-widest">
            Categories (comma-separated)
          </label>
          <input
            type="text"
            value={categories}
            onChange={(e) => setCategories(e.target.value)}
            placeholder="asia, beaches, budget"
            className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/8 text-white placeholder-neutral-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all text-sm"
          />
        </div>
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-widest">
          Excerpt (auto-generated if empty)
        </label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
          placeholder="A short summary shown on blog cards…"
          className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/8 text-white placeholder-neutral-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all text-sm resize-none"
        />
      </div>

      {/* Cover image */}
      <div>
        <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-widest">
          Cover Image
        </label>
        <div
          className="relative border-2 border-dashed border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-orange-500/40 transition-colors group"
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file?.type.startsWith("image/")) handleCoverChange(file);
          }}
        >
          {coverPreview ? (
            <div className="relative aspect-[16/6]">
              <Image
                src={coverPreview}
                alt="Cover preview"
                fill
                className="object-cover opacity-70 group-hover:opacity-90 transition-opacity"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCoverPreview(null);
                  setCoverFile(null);
                }}
                className="absolute top-2 right-2 p-1 rounded-full bg-neutral-900/80 text-neutral-300 hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="px-3 py-1.5 rounded-lg bg-neutral-900/80 text-xs text-neutral-300">
                  Click to replace
                </span>
              </div>
            </div>
          ) : (
            <div className="aspect-[16/6] flex flex-col items-center justify-center gap-3 text-neutral-600">
              <Upload size={28} />
              <p className="text-sm">
                Drop an image here or{" "}
                <span className="text-orange-400">click to upload</span>
              </p>
              <p className="text-xs">JPEG, PNG, WebP — max 10 MB</p>
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleCoverChange(file);
            }}
          />
        </div>
      </div>

      {/* Tiptap editor */}
      <div>
        <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-widest">
          Content *
        </label>
        <TiptapEditor content={content} onChange={setContent} />
      </div>

      {/* Footer actions */}
      <div className="flex items-center justify-between pt-2 border-t border-white/8">
        <button
          type="button"
          onClick={() => setPublished(!published)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            published
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
              : "bg-white/5 text-neutral-400 border border-white/8 hover:bg-white/10"
          }`}
        >
          {published ? <Eye size={14} /> : <EyeOff size={14} />}
          {published ? "Published" : "Draft"}
        </button>

        <button
          type="submit"
          disabled={isPending || saved}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 disabled:opacity-60 text-white text-sm font-semibold transition-all hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] active:scale-95"
        >
          {saved ? (
            <>
              <CheckCircle2 size={14} />
              Saved!
            </>
          ) : isPending ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Saving…
            </>
          ) : (
            <>
              <Save size={14} />
              {post ? "Update Post" : "Publish Post"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
