import { getPostById } from "@/lib/r2";
import { BlogForm } from "@/components/admin/blog-form";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Edit Post" };
export const dynamic = "force-dynamic";

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) notFound();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Edit Post</h1>
        <p className="text-sm text-neutral-400 mt-1 truncate max-w-xl">
          {post.title}
        </p>
      </div>
      <BlogForm post={post} />
    </div>
  );
}
