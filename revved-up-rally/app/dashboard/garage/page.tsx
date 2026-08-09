import type { Metadata } from "next";
import Link from "next/link";
import { getDashboardMember, getMemberVehicles } from "@/lib/data/admin-queries";
import { createPageMetadata } from "@/lib/metadata";
import { VehicleCard } from "@/components/dashboard/VehicleCard";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = createPageMetadata({
  title: "Garage",
  description: "Manage your vehicles in the Revved Up Rally member garage.",
  path: "/dashboard/garage",
});

export default async function GaragePage() {
  const member = await getDashboardMember();
  const vehicles = await getMemberVehicles(member.id);

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-white/40">Your Collection</p>
          <h1 className="mt-2 font-display text-3xl uppercase tracking-[0.1em] text-off-white">
            Garage
          </h1>
        </div>
        <Button variant="secondary" disabled>
          Add Vehicle
        </Button>
      </div>

      {vehicles.length === 0 ? (
        <div className="border border-white/10 bg-charcoal p-12 text-center">
          <p className="text-sm text-white/50">No vehicles in your garage yet.</p>
          <Button className="mt-6" variant="secondary" asChild>
            <Link href="/dashboard/profile">Update Profile</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  );
}
