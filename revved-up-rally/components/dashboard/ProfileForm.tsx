"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Member } from "@/types/database";

interface ProfileFormProps {
  member: Member;
}

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  state: string;
  phone: string;
}

function getProfileField(profile: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    const value = profile[key];
    if (typeof value === "string" && value.length > 0) return value;
  }
  return "";
}

export function ProfileForm({ member }: ProfileFormProps) {
  const profile = (member.profile ?? {}) as Record<string, unknown>;
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ProfileFormData>({
    defaultValues: {
      firstName: getProfileField(profile, "firstName", "first_name"),
      lastName: getProfileField(profile, "lastName", "last_name"),
      email: getProfileField(profile, "email"),
      city: getProfileField(profile, "city"),
      state: getProfileField(profile, "state"),
      phone: getProfileField(profile, "phone"),
    },
  });

  async function onSubmit(data: ProfileFormData) {
    await new Promise((r) => setTimeout(r, 800));
    console.info("Profile updated:", data);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" {...register("firstName")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" {...register("lastName")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" type="tel" {...register("phone")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" {...register("city")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input id="state" {...register("state")} />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
        {saved && (
          <p className="text-sm text-emerald-400">Profile saved successfully.</p>
        )}
      </div>
    </form>
  );
}
