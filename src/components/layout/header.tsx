import Link from "next/link";
import { Compass } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-neutral-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Compass size={16} className="text-white" />
          </div>
          <span className="text-base font-bold tracking-tight text-white">
            Travelling<span className="text-orange-400">Beku</span>
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm text-neutral-400 hover:text-white transition-colors"
          >
            Home
          </Link>
          <Link
            href="/blogs"
            className="text-sm text-neutral-400 hover:text-white transition-colors"
          >
            Blog
          </Link>
          <Link
            href="/login"
            className="text-sm text-neutral-400 hover:text-white transition-colors"
          >
            Login
          </Link>
          <Link
            href="/blogs"
            className="text-sm px-4 py-2 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20 transition-colors font-medium"
          >
            Explore →
          </Link>
        </nav>
      </div>
    </header>
  );
}
