import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import type { BlogPostMeta } from "@/types";
import { CalendarDays, Tag } from "lucide-react";

interface BlogCardProps {
  post: BlogPostMeta;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link
      href={`/blogs/${post.slug}`}
      className="group block glass rounded-[var(--radius-card)] overflow-hidden hover:border-orange-500/30 hover:shadow-[0_0_20px_rgba(249,115,22,0.08)] transition-all duration-300"
    >
      {/* Cover image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-neutral-800">
        {post.image_url ? (
          <Image
            src={post.image_url}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-20">
            🌍
          </div>
        )}
        {/* Category pill on image */}
        {post.categories[0] && (
          <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-neutral-950/70 text-orange-400 rounded-full backdrop-blur-sm border border-orange-500/20">
            {post.categories[0]}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h2 className="font-semibold text-white text-base leading-snug mb-2 line-clamp-2 group-hover:text-orange-300 transition-colors">
          {post.title}
        </h2>
        <p className="text-neutral-400 text-sm line-clamp-2 mb-4 leading-relaxed">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between text-[11px] text-neutral-500">
          <span className="flex items-center gap-1">
            <CalendarDays size={10} />
            {formatDate(post.created_at)}
          </span>
          {post.categories.length > 1 && (
            <span className="flex items-center gap-1">
              <Tag size={10} />
              {post.categories.length} tags
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
