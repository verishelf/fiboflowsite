import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRallyBySlug, getRallies } from "@/lib/data/queries";
import { createPageMetadata } from "@/lib/metadata";
import { RouteMap } from "@/components/rallies/RouteMap";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface RallyDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const rallies = await getRallies();
  return rallies.map((rally) => ({ slug: rally.slug }));
}

export async function generateMetadata({
  params,
}: RallyDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const rally = await getRallyBySlug(slug);
  if (!rally) return {};

  return createPageMetadata({
    title: rally.name,
    description: rally.description ?? rally.tagline ?? `${rally.route} — Revved Up Rally`,
    path: `/rallies/${slug}`,
  });
}

export default async function RallyDetailPage({ params }: RallyDetailPageProps) {
  const { slug } = await params;
  const rally = await getRallyBySlug(slug);
  if (!rally) notFound();

  const schedule = (rally.schedule ?? []) as {
    day: number;
    title: string;
    description: string;
  }[];

  return (
    <main>
      <section className="relative flex min-h-[70vh] items-end">
        {rally.hero_image && (
          <Image
            src={rally.hero_image}
            alt={rally.name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 cinematic-overlay" />
        <div className="relative z-10 w-full section-padding">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs uppercase tracking-[0.35em] text-white/50">
              {rally.year} · {rally.duration}
            </p>
            <h1 className="editorial-headline mt-4 text-off-white">{rally.name}</h1>
            {rally.tagline && (
              <p className="mt-4 max-w-xl text-lg italic text-white/70">{rally.tagline}</p>
            )}
            <p className="mt-6 text-sm uppercase tracking-[0.2em] text-white/50">
              {rally.route}
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-12">
            {rally.description && (
              <div>
                <h2 className="text-xs uppercase tracking-[0.25em] text-white/40">Overview</h2>
                <p className="mt-4 text-base leading-relaxed text-white/70">{rally.description}</p>
              </div>
            )}

            <div>
              <h2 className="text-xs uppercase tracking-[0.25em] text-white/40">Route Map</h2>
              <div className="mt-6">
                <RouteMap rally={rally} />
              </div>
            </div>

            {schedule.length > 0 && (
              <div>
                <h2 className="text-xs uppercase tracking-[0.25em] text-white/40">Schedule</h2>
                <Accordion type="single" collapsible className="mt-6">
                  {schedule.map((item) => (
                    <AccordionItem key={item.day} value={`day-${item.day}`}>
                      <AccordionTrigger>
                        Day {item.day} — {item.title}
                      </AccordionTrigger>
                      <AccordionContent>{item.description}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}
          </div>

          <aside className="space-y-8">
            <div className="border border-white/10 bg-charcoal p-6">
              <h3 className="text-xs uppercase tracking-[0.25em] text-white/40">Details</h3>
              <dl className="mt-6 space-y-4 text-sm">
                {rally.distance && (
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.15em] text-white/30">Distance</dt>
                    <dd className="mt-1 text-off-white">{rally.distance}</dd>
                  </div>
                )}
                {rally.experience_level && (
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.15em] text-white/30">Level</dt>
                    <dd className="mt-1 text-off-white">{rally.experience_level}</dd>
                  </div>
                )}
                {rally.start_date && (
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.15em] text-white/30">Dates</dt>
                    <dd className="mt-1 text-off-white">
                      {new Date(rally.start_date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                      })}
                      {rally.end_date &&
                        ` — ${new Date(rally.end_date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}`}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {rally.whats_included.length > 0 && (
              <div className="border border-white/10 bg-charcoal p-6">
                <h3 className="text-xs uppercase tracking-[0.25em] text-white/40">Included</h3>
                <ul className="mt-6 space-y-3">
                  {rally.whats_included.map((item) => (
                    <li key={item} className="text-sm text-white/60">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="border border-off-white/20 bg-white/5 p-6">
              <h3 className="font-display text-lg uppercase tracking-[0.08em] text-off-white">
                Register
              </h3>
              <p className="mt-3 text-sm text-white/60">
                Members receive priority registration. Apply for membership or log in to register
                for this rally.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <Button asChild>
                  <Link href="/apply">Apply for Membership</Link>
                </Button>
                <Button variant="secondary" asChild>
                  <Link href="/dashboard">Member Dashboard</Link>
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
