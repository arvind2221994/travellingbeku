import { getPostBySlug, getAllPostsMeta } from "@/lib/r2";
import { formatDate } from "@/lib/utils";
import { CommentsSection } from "@/components/blog/comments-section";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { CalendarDays, Tag } from "lucide-react";

// SSR — fresh from R2 on every request
export const dynamic = "force-dynamic";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.image_url ? [post.image_url] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || !post.published) notFound();

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-8">
        <Link href="/" className="hover:text-orange-400 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/blogs" className="hover:text-orange-400 transition-colors">
          Blog
        </Link>
        <span>/</span>
        <span className="text-neutral-300 truncate max-w-[200px]">
          {post.title}
        </span>
      </nav>

      {/* Categories */}
      {post.categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.categories.map((cat) => (
            <Link
              key={cat}
              href={`/blogs?category=${encodeURIComponent(cat)}`}
              className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20 transition-colors capitalize"
            >
              <Tag size={10} />
              {cat}
            </Link>
          ))}
        </div>
      )}

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
        {post.title}
      </h1>

      {/* Meta */}
      <div className="flex items-center gap-4 text-sm text-neutral-400 mb-8">
        <span className="flex items-center gap-1.5">
          <CalendarDays size={14} />
          {formatDate(post.created_at)}
        </span>
        {post.updated_at !== post.created_at && (
          <span className="text-neutral-600">
            Updated {formatDate(post.updated_at)}
          </span>
        )}
      </div>

      {/* Cover image */}
      {post.image_url && (
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-10 glow">
          <Image
            src={post.image_url}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Content */}
      <div
        className="prose-blog prose prose-invert max-w-none mb-16"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Comments */}
      <CommentsSection postSlug={slug} />
    </article>
  );
}
