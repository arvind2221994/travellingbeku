import { getAllPostsAdmin } from "@/lib/r2";
import { DashboardGrid } from "@/components/admin/dashboard-grid";
import Link from "next/link";
import { FilePlus } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Dashboard" };
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const posts = await getAllPostsAdmin();

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-neutral-400 mt-1">
            {posts.length} post{posts.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <Link
          href="/admin/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold transition-colors"
        >
          <FilePlus size={15} />
          New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-32 glass rounded-2xl">
          <p className="text-5xl mb-4">📝</p>
          <p className="text-neutral-400 mb-6">
            No posts yet. Create your first one!
          </p>
          <Link
            href="/admin/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold transition-colors"
          >
            <FilePlus size={14} />
            Write First Post
          </Link>
        </div>
      ) : (
        <DashboardGrid posts={posts} />
      )}
    </div>
  );
}
