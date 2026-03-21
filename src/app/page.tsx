import { HeroSection } from "@/components/home/hero-section";
import { FeaturedTools } from "@/components/home/featured-tools";
import { getAllPostsMeta } from "@/lib/r2";
import { BlogCard } from "@/components/blog/blog-card";
import Link from "next/link";

// SSR — always fresh from R2
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const posts = await getAllPostsMeta();
  const recent = posts.slice(0, 3);

  return (
    <>
      <HeroSection />

      {/* ── Recent Posts ── */}
      {recent.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sm font-medium text-orange-400 uppercase tracking-widest mb-2">
                Latest
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Fresh from the trail
              </h2>
            </div>
            <Link
              href="/blogs"
              className="text-sm text-orange-400 hover:text-orange-300 transition-colors font-medium"
            >
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recent.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      <FeaturedTools />
    </>
  );
}
