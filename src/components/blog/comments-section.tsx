import { MessageSquare } from "lucide-react";

interface CommentsSectionProps {
  postSlug: string;
}

/**
 * Comments placeholder.
 * Replace the inner content with your preferred comments solution:
 * - Giscus (GitHub Discussions)
 * - Utterances
 * - Disqus
 * - A custom D1-backed comments API
 */
export function CommentsSection({ postSlug: _postSlug }: CommentsSectionProps) {
  return (
    <section
      id="comments"
      className="border-t border-white/8 pt-12"
      aria-label="Comments section"
    >
      <h2 className="flex items-center gap-2 text-xl font-bold text-white mb-8">
        <MessageSquare size={20} className="text-orange-400" />
        Comments
      </h2>

      <div className="glass rounded-2xl p-10 text-center">
        <MessageSquare
          size={36}
          className="text-neutral-700 mx-auto mb-4"
        />
        <p className="text-neutral-400 text-sm mb-2">
          Comments are coming soon.
        </p>
        <p className="text-neutral-600 text-xs">
          This section is ready for Giscus, Utterances, or any other comment
          system — just drop the embed here.
        </p>
      </div>
    </section>
  );
}
