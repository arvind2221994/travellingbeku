import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[85vh] flex items-center">
      {/* Ambient background orbs */}
      <div
        aria-hidden
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full opacity-10"
        style={{
          background:
            "radial-gradient(circle, #f97316 0%, #ea580c 40%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <div
        aria-hidden
        className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-5"
        style={{
          background:
            "radial-gradient(circle, #a855f7 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-medium mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
          Stories from the road
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white mb-6 leading-[1.1]">
          The world is your{" "}
          <span className="gradient-text">playground.</span>
        </h1>

        <p className="text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Unfiltered travel stories, practical guides, and adventures from
          every corner of the globe — written for those who actually go.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/blogs"
            className="px-8 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-semibold text-sm transition-all duration-200 hover:shadow-[0_0_24px_rgba(249,115,22,0.4)] active:scale-95"
          >
            Read the Blog →
          </Link>
          <Link
            href="#tools"
            className="px-8 py-3.5 rounded-xl border border-white/10 text-neutral-300 hover:text-white hover:border-white/20 text-sm font-medium transition-colors"
          >
            Explore Tools
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="mt-20 flex flex-col items-center gap-2 text-neutral-600">
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-orange-500/40" />
          <span className="text-[10px] uppercase tracking-widest">
            Scroll
          </span>
        </div>
      </div>
    </section>
  );
}
