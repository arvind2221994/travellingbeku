import Link from "next/link";
import { Globe, Zap, Map } from "lucide-react";

const tools = [
  {
    icon: Globe,
    title: "Trip Planner",
    description: "Build your perfect itinerary with smart day-by-day planning.",
    href: "#",
    color: "from-orange-500/20 to-amber-500/10",
    iconColor: "text-orange-400",
  },
  {
    icon: Zap,
    title: "Packing Wizard",
    description: "Auto-generate packing lists based on your destination & weather.",
    href: "#",
    color: "from-violet-500/20 to-purple-500/10",
    iconColor: "text-violet-400",
  },
  {
    icon: Map,
    title: "Route Builder",
    description: "Visualize multi-city routes and find the most scenic paths.",
    href: "#",
    color: "from-cyan-500/20 to-blue-500/10",
    iconColor: "text-cyan-400",
  },
];

export function FeaturedTools() {
  return (
    <section className="py-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-orange-400 uppercase tracking-widest mb-3">
            Tools
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Pack smarter. Travel further.
          </h2>
          <p className="text-neutral-400 max-w-xl mx-auto">
            Handcrafted apps to make your trips effortless — from planning to
            packing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Link
              key={tool.title}
              href={tool.href}
              className={`group relative overflow-hidden rounded-2xl border border-white/8 p-6 bg-gradient-to-br ${tool.color} hover:border-white/15 hover:scale-[1.02] transition-all duration-300`}
            >
              <div className="mb-4">
                <tool.icon
                  size={28}
                  className={`${tool.iconColor} group-hover:scale-110 transition-transform duration-300`}
                />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">
                {tool.title}
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                {tool.description}
              </p>
              <div className="mt-4 text-xs font-medium text-neutral-500 group-hover:text-neutral-300 transition-colors">
                Coming soon →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
