import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CheckoutSuccessPage() {
  return (
    <div className="section-padding mx-auto max-w-xl pt-32 text-center">
      <h1 className="font-display text-3xl uppercase tracking-[0.15em]">
        Welcome to the Rally
      </h1>
      <p className="mt-6 text-white/60">
        Your payment was successful. Your membership is being activated.
      </p>
      <Button asChild className="mt-10">
        <Link href="/dashboard">GO TO DASHBOARD</Link>
      </Button>
    </div>
  );
}
