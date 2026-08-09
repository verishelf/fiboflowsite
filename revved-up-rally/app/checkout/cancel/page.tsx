import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CheckoutCancelPage() {
  return (
    <div className="section-padding mx-auto max-w-xl pt-32 text-center">
      <h1 className="font-display text-3xl uppercase tracking-[0.15em]">
        Checkout Cancelled
      </h1>
      <p className="mt-6 text-white/60">
        Your payment was not completed. You can try again from your approval email.
      </p>
      <Button asChild variant="secondary" className="mt-10">
        <Link href="/">RETURN HOME</Link>
      </Button>
    </div>
  );
}
