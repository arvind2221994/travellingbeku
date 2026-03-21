import { getAllPostsMeta } from "@/lib/r2";
import { BlogCard } from "@/components/blog/blog-card";
import { CategoryNav } from "@/components/blog/category-nav";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Travel stories, guides, and tips from around the world.",
};

// SSR — fresh from R2 on every request
export const dynamic = "force-dynamic";

interface BlogsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function BlogsPage({ searchParams }: BlogsPageProps) {
  const { category } = await searchParams;
  const allPosts = await getAllPostsMeta();

  // Collect unique categories from all posts
  const allCategories = Array.from(
    new Set(allPosts.flatMap((p) => p.categories))
  ).sort();

  const filtered = category
    ? allPosts.filter((p) => p.categories.includes(category))
    : allPosts;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="mb-12">
        <p className="text-sm font-medium text-orange-400 uppercase tracking-widest mb-3">
          The Journal
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          Travel Stories
        </h1>
        <p className="text-neutral-400 text-lg max-w-2xl">
          Adventures, misadventures, and everything in between — penned from
          the road.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sidebar */}
        <aside className="lg:w-56 shrink-0">
          <CategoryNav
            categories={allCategories}
            active={category}
          />
        </aside>

        {/* Feed */}
        <div className="flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-24 text-neutral-500">
              <p className="text-5xl mb-4">🌍</p>
              <p className="text-lg">No posts yet in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
