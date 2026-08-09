import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { SectionHeading } from "@/components/layout/SectionHeading";

export function IntroSection() {
  return (
    <section id="intro" className="section-padding border-t border-white/10">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <SectionHeading
            eyebrow="The Vision"
            title="Beyond the Club"
            description="Revved Up Rally is not a car club — it is a curated experience for enthusiasts who demand more. Cinematic drives, hand-selected routes, luxury accommodations, and a community of like-minded individuals who share a passion for exceptional machines."
          />
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="mt-16 grid gap-12 md:grid-cols-3">
            {[
              {
                label: "Curated Routes",
                text: "Every mile is intentional — scenic highways, hidden gems, and roads chosen for the drive itself.",
              },
              {
                label: "Luxury Experiences",
                text: "Five-star accommodations, private events, and access reserved for members only.",
              },
              {
                label: "Elite Community",
                text: "Connect with collectors, drivers, and enthusiasts who share your standards.",
              },
            ].map((item) => (
              <div key={item.label} className="border-t border-white/10 pt-6">
                <h3 className="mb-4 text-xs uppercase tracking-[0.3em] text-off-white">
                  {item.label}
                </h3>
                <p className="text-sm leading-relaxed text-white/60">{item.text}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
