import { Hero } from "@/components/home/Hero";
import { IntroSection } from "@/components/home/IntroSection";
import { RallyExperience } from "@/components/home/RallyExperience";
import { UpcomingRallies } from "@/components/home/UpcomingRallies";
import { DestinationsShowcase } from "@/components/home/DestinationsShowcase";
import { MembershipTiers } from "@/components/home/MembershipTiers";
import { MembershipComparison } from "@/components/home/MembershipComparison";
import { getRallies, getDestinations } from "@/lib/data/queries";

export default async function HomePage() {
  const [rallies, destinations] = await Promise.all([
    getRallies(),
    getDestinations(),
  ]);

  return (
    <>
      <Hero />
      <IntroSection />
      <RallyExperience />
      <UpcomingRallies rallies={rallies} />
      <DestinationsShowcase destinations={destinations} />
      <MembershipTiers />
      <MembershipComparison />
    </>
  );
}
