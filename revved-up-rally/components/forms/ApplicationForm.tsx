"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  applicationSchema,
  type ApplicationFormData,
} from "@/lib/validations/schemas";
import { MEMBERSHIP_PLANS } from "@/lib/pricing/membership-plans";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function ApplicationForm() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      membershipPlan: "plus",
      participatedBefore: "no",
      agreeToTerms: undefined,
    },
  });

  const membershipPlan = watch("membershipPlan");
  const participatedBefore = watch("participatedBefore");
  const agreeToTerms = watch("agreeToTerms");

  async function onSubmit(data: ApplicationFormData) {
    await new Promise((r) => setTimeout(r, 1000));
    console.info("Application submitted:", data);
    setSubmitted(true);
    reset();
  }

  if (submitted) {
    return (
      <div className="border border-white/10 bg-charcoal p-8 text-center md:p-12">
        <p className="font-display text-2xl uppercase tracking-[0.1em] text-off-white">
          Application Submitted
        </p>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/60">
          Thank you for applying to Revved Up Rally. Our membership committee will
          review your application and respond within 7–10 business days.
        </p>
        <Button className="mt-8" variant="secondary" onClick={() => setSubmitted(false)}>
          Submit Another Application
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
      <section className="space-y-6">
        <h2 className="text-xs uppercase tracking-[0.25em] text-white/40">Personal Information</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="First Name" error={errors.firstName?.message}>
            <Input {...register("firstName")} />
          </Field>
          <Field label="Last Name" error={errors.lastName?.message}>
            <Input {...register("lastName")} />
          </Field>
          <Field label="Email" error={errors.email?.message}>
            <Input type="email" {...register("email")} />
          </Field>
          <Field label="Phone" error={errors.phone?.message}>
            <Input type="tel" {...register("phone")} />
          </Field>
          <Field label="Date of Birth">
            <Input type="date" {...register("dateOfBirth")} />
          </Field>
          <Field label="Instagram">
            <Input placeholder="@username" {...register("instagram")} />
          </Field>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-xs uppercase tracking-[0.25em] text-white/40">Location</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Field label="City" error={errors.city?.message}>
            <Input {...register("city")} />
          </Field>
          <Field label="State" error={errors.state?.message}>
            <Input {...register("state")} />
          </Field>
          <Field label="Country" error={errors.country?.message}>
            <Input {...register("country")} />
          </Field>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-xs uppercase tracking-[0.25em] text-white/40">Professional</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Occupation" error={errors.occupation?.message}>
            <Input {...register("occupation")} />
          </Field>
          <Field label="Company">
            <Input {...register("company")} />
          </Field>
          <Field label="How did you hear about us?" error={errors.hearAboutUs?.message}>
            <Input {...register("hearAboutUs")} />
          </Field>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-xs uppercase tracking-[0.25em] text-white/40">Primary Vehicle</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Vehicle Description" error={errors.primaryVehicle?.message}>
            <Input placeholder="e.g. 2024 Porsche 911 GT3 RS" {...register("primaryVehicle")} />
          </Field>
          <Field label="Year" error={errors.vehicleYear?.message}>
            <Input {...register("vehicleYear")} />
          </Field>
          <Field label="Make" error={errors.vehicleMake?.message}>
            <Input {...register("vehicleMake")} />
          </Field>
          <Field label="Model" error={errors.vehicleModel?.message}>
            <Input {...register("vehicleModel")} />
          </Field>
          <Field label="Trim">
            <Input {...register("vehicleTrim")} />
          </Field>
          <Field label="Color">
            <Input {...register("vehicleColor")} />
          </Field>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Additional Vehicles">
            <Textarea rows={3} {...register("additionalVehicles")} />
          </Field>
          <Field label="Total Vehicles Owned" error={errors.vehiclesOwned?.message}>
            <Input {...register("vehiclesOwned")} />
          </Field>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-xs uppercase tracking-[0.25em] text-white/40">Membership Plan</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {MEMBERSHIP_PLANS.map((plan) => (
            <button
              key={plan.id}
              type="button"
              onClick={() => setValue("membershipPlan", plan.id)}
              className={cn(
                "border p-6 text-left transition-colors",
                membershipPlan === plan.id
                  ? "border-off-white bg-white/5"
                  : "border-white/10 hover:border-white/20",
              )}
            >
              <div className="flex items-start justify-between">
                <p className="font-display text-lg uppercase tracking-[0.08em] text-off-white">
                  {plan.name}
                </p>
                <p className="text-sm text-white/60">{formatCurrency(plan.priceAnnual)}/yr</p>
              </div>
              <p className="mt-2 text-sm text-white/50">{plan.description}</p>
            </button>
          ))}
        </div>
        {errors.membershipPlan && (
          <p className="text-xs text-red-400">{errors.membershipPlan.message}</p>
        )}
      </section>

      <section className="space-y-6">
        <h2 className="text-xs uppercase tracking-[0.25em] text-white/40">Application Questions</h2>
        <Field label="Why do you want to join Revved Up Rally?" error={errors.whyJoin?.message}>
          <Textarea rows={4} {...register("whyJoin")} />
        </Field>
        <Field label="Describe your ideal rally experience" error={errors.rallyExperience?.message}>
          <Textarea rows={4} {...register("rallyExperience")} />
        </Field>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Have you participated in rallies before?</Label>
            <Select
              value={participatedBefore}
              onValueChange={(v) => setValue("participatedBefore", v as "yes" | "no")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {participatedBefore === "yes" && (
            <Field label="Previous Rallies">
              <Input {...register("previousRallies")} />
            </Field>
          )}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-xs uppercase tracking-[0.25em] text-white/40">Emergency Contact</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Field label="Name" error={errors.emergencyName?.message}>
            <Input {...register("emergencyName")} />
          </Field>
          <Field label="Phone" error={errors.emergencyPhone?.message}>
            <Input type="tel" {...register("emergencyPhone")} />
          </Field>
          <Field label="Relationship" error={errors.emergencyRelationship?.message}>
            <Input {...register("emergencyRelationship")} />
          </Field>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-start gap-3">
          <Checkbox
            id="agreeToTerms"
            checked={agreeToTerms === true}
            onCheckedChange={(checked) => setValue("agreeToTerms", checked === true ? true : undefined as unknown as true)}
          />
          <label htmlFor="agreeToTerms" className="text-sm leading-relaxed text-white/60">
            I agree to the{" "}
            <Link href="/terms" className="text-off-white underline underline-offset-4">
              Terms of Service
            </Link>
            ,{" "}
            <Link href="/membership-agreement" className="text-off-white underline underline-offset-4">
              Membership Agreement
            </Link>
            , and{" "}
            <Link href="/code-of-conduct" className="text-off-white underline underline-offset-4">
              Code of Conduct
            </Link>
            .
          </label>
        </div>
        {errors.agreeToTerms && (
          <p className="text-xs text-red-400">{errors.agreeToTerms.message}</p>
        )}
      </section>

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full md:w-auto">
        {isSubmitting ? "Submitting Application..." : "Submit Application"}
      </Button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
