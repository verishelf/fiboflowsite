"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  sponsorApplicationSchema,
  type SponsorApplicationFormData,
} from "@/lib/validations/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SponsorApplicationForm() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SponsorApplicationFormData>({
    resolver: zodResolver(sponsorApplicationSchema),
    defaultValues: {
      sponsorshipInterest: "rally_sponsor",
    },
  });

  const sponsorshipInterest = watch("sponsorshipInterest");

  async function onSubmit(data: SponsorApplicationFormData) {
    await new Promise((r) => setTimeout(r, 800));
    console.info("Sponsor application submitted:", data);
    setSubmitted(true);
    reset();
  }

  if (submitted) {
    return (
      <div className="border border-white/10 bg-charcoal p-8 text-center">
        <p className="font-display text-xl uppercase tracking-[0.1em] text-off-white">
          Application Received
        </p>
        <p className="mt-4 text-sm text-white/60">
          Our partnerships team will review your application and be in touch within
          5 business days.
        </p>
        <Button className="mt-6" variant="secondary" onClick={() => setSubmitted(false)}>
          Submit Another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input id="company" {...register("company")} />
          {errors.company && (
            <p className="text-xs text-red-400">{errors.company.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactName">Contact Name</Label>
          <Input id="contactName" {...register("contactName")} />
          {errors.contactName && (
            <p className="text-xs text-red-400">{errors.contactName.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && (
            <p className="text-xs text-red-400">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input id="phone" type="tel" {...register("phone")} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input id="website" type="url" placeholder="https://" {...register("website")} />
          {errors.website && (
            <p className="text-xs text-red-400">{errors.website.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>
          <Input id="industry" {...register("industry")} />
          {errors.industry && (
            <p className="text-xs text-red-400">{errors.industry.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Sponsorship Interest</Label>
          <Select
            value={sponsorshipInterest}
            onValueChange={(v) =>
              setValue("sponsorshipInterest", v as SponsorApplicationFormData["sponsorshipInterest"])
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select tier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="presenting_sponsor">Presenting Sponsor</SelectItem>
              <SelectItem value="official_partner">Official Partner</SelectItem>
              <SelectItem value="premium_sponsor">Premium Sponsor</SelectItem>
              <SelectItem value="rally_sponsor">Rally Sponsor</SelectItem>
            </SelectContent>
          </Select>
          {errors.sponsorshipInterest && (
            <p className="text-xs text-red-400">{errors.sponsorshipInterest.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="budgetRange">Budget Range</Label>
          <Input id="budgetRange" placeholder="e.g. $25,000 - $50,000" {...register("budgetRange")} />
          {errors.budgetRange && (
            <p className="text-xs text-red-400">{errors.budgetRange.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" rows={5} {...register("message")} />
        {errors.message && (
          <p className="text-xs text-red-400">{errors.message.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
        {isSubmitting ? "Submitting..." : "Submit Application"}
      </Button>
    </form>
  );
}
