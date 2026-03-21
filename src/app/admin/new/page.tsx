import { BlogForm } from "@/components/admin/blog-form";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — New Post" };

export default function NewPostPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">New Post</h1>
        <p className="text-sm text-neutral-400 mt-1">
          Fill in the details and start writing. Images dropped into the editor
          upload automatically to R2.
        </p>
      </div>
      <BlogForm />
    </div>
  );
}
