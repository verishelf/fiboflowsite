import Link from "next/link";
import Image from "next/image";
import { getRallies } from "@/lib/data/queries";
import { Button } from "@/components/ui/button";
import { RallyCard } from "@/components/rallies/RallyCard";

export default async function HomePage() {
  const rallies = await getRallies();

  return (
    <main>
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80"
          alt="Revved Up Rally"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 cinematic-overlay" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">
            Automotive Rally Experience
          </p>
          <h1 className="editorial-headline mt-6 text-off-white">Revved Up Rally</h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
            Curated routes. Luxury destinations. A community built for enthusiasts who demand more.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/apply">Apply for Membership</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/rallies">Explore Rallies</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="rallies" className="section-padding mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-white/40">Upcoming</p>
          <h2 className="editorial-headline mt-4 text-4xl text-off-white md:text-5xl">Rallies</h2>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          {rallies.slice(0, 4).map((rally) => (
            <RallyCard key={rally.id} rally={rally} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button variant="secondary" asChild>
            <Link href="/rallies">View All Rallies</Link>
          </Button>
        </div>
      </section>

      <section id="membership" className="border-t border-white/10 section-padding">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-white/40">Join Us</p>
          <h2 className="editorial-headline mt-4 text-4xl text-off-white md:text-5xl">
            Membership
          </h2>
          <p className="mt-6 text-base leading-relaxed text-white/60">
            From Basic to Founders, every tier unlocks access to an exclusive community,
            partner benefits, and the world&apos;s most curated rally experiences.
          </p>
          <Button className="mt-8" asChild>
            <Link href="/apply">Apply Now</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
