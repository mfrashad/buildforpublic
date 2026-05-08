import { STATS } from "@/lib/constants";

export default function StatsBar() {
  return (
    <section className="py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="card-flat p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className={`text-center ${i < STATS.length - 1 ? "md:border-r md:border-border" : ""}`}
              >
                <div
                  className="text-3xl sm:text-4xl text-text-primary mb-1"
                  style={{ fontFamily: "var(--font-serif)", fontWeight: 700 }}
                >
                  {stat.value}
                </div>
                <div className="text-sm text-text-secondary">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
