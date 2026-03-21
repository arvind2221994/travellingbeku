import { BlogTile } from "./blog-tile";
import type { BlogPostMeta } from "@/types";

interface DashboardGridProps {
  posts: BlogPostMeta[];
}

export function DashboardGrid({ posts }: DashboardGridProps) {
  const live = posts.filter((p) => p.published);
  const drafts = posts.filter((p) => !p.published);

  return (
    <div className="space-y-10">
      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Posts", value: posts.length },
          { label: "Published", value: live.length, color: "text-emerald-400" },
          { label: "Drafts", value: drafts.length, color: "text-amber-400" },
          {
            label: "Categories",
            value: new Set(posts.flatMap((p) => p.categories)).size,
            color: "text-violet-400",
          },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-xl p-4">
            <p className="text-[11px] text-neutral-500 uppercase tracking-widest mb-1">
              {stat.label}
            </p>
            <p className={`text-2xl font-bold ${stat.color ?? "text-white"}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Published posts */}
      {live.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-4">
            Published ({live.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {live.map((post) => (
              <BlogTile key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Drafts */}
      {drafts.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-4">
            Drafts ({drafts.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {drafts.map((post) => (
              <BlogTile key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
