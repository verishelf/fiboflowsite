"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactFormData } from "@/lib/validations/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(data: ContactFormData) {
    await new Promise((r) => setTimeout(r, 800));
    console.info("Contact form submitted:", data);
    setSubmitted(true);
    reset();
  }

  if (submitted) {
    return (
      <div className="border border-white/10 bg-charcoal p-8 text-center">
        <p className="font-display text-xl uppercase tracking-[0.1em] text-off-white">
          Message Sent
        </p>
        <p className="mt-4 text-sm text-white/60">
          Thank you for reaching out. A member of our team will respond shortly.
        </p>
        <Button className="mt-6" variant="secondary" onClick={() => setSubmitted(false)}>
          Send Another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("name")} />
          {errors.name && (
            <p className="text-xs text-red-400">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && (
            <p className="text-xs text-red-400">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input id="phone" type="tel" {...register("phone")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input id="subject" {...register("subject")} />
          {errors.subject && (
            <p className="text-xs text-red-400">{errors.subject.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" rows={6} {...register("message")} />
        {errors.message && (
          <p className="text-xs text-red-400">{errors.message.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
