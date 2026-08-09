import { z } from "zod";

export const membershipPlanSchema = z.enum(["basic", "plus", "elite", "founders"]);

export const applicationSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone is required"),
  dateOfBirth: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  instagram: z.string().optional(),
  occupation: z.string().min(1, "Occupation is required"),
  company: z.string().optional(),
  hearAboutUs: z.string().min(1, "Please tell us how you heard about us"),
  primaryVehicle: z.string().min(1, "Primary vehicle is required"),
  vehicleYear: z.string().min(4, "Year is required"),
  vehicleMake: z.string().min(1, "Make is required"),
  vehicleModel: z.string().min(1, "Model is required"),
  vehicleTrim: z.string().optional(),
  vehicleColor: z.string().optional(),
  additionalVehicles: z.string().optional(),
  vehiclesOwned: z.string().min(1, "Required"),
  membershipPlan: membershipPlanSchema,
  whyJoin: z.string().min(20, "Please provide at least 20 characters"),
  rallyExperience: z.string().min(10, "Please describe your ideal experience"),
  participatedBefore: z.enum(["yes", "no"]),
  previousRallies: z.string().optional(),
  emergencyName: z.string().min(1, "Emergency contact name is required"),
  emergencyPhone: z.string().min(10, "Emergency contact phone is required"),
  emergencyRelationship: z.string().min(1, "Relationship is required"),
  agreeToTerms: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the terms" }),
  }),
});

export type ApplicationFormData = z.infer<typeof applicationSchema>;

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export const sponsorApplicationSchema = z.object({
  company: z.string().min(1, "Company is required"),
  contactName: z.string().min(1, "Contact name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  website: z.string().url("Valid URL required").or(z.literal("")).optional(),
  industry: z.string().min(1, "Industry is required"),
  sponsorshipInterest: z.enum([
    "official_partner",
    "rally_sponsor",
    "premium_sponsor",
    "presenting_sponsor",
  ]),
  budgetRange: z.string().min(1, "Budget range is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type SponsorApplicationFormData = z.infer<typeof sponsorApplicationSchema>;

export const vehicleSchema = z.object({
  year: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
  make: z.string().min(1),
  model: z.string().min(1),
  trim: z.string().optional(),
  color: z.string().optional(),
  horsepower: z.coerce.number().optional(),
  engine: z.string().optional(),
  photoUrl: z.string().url().optional().or(z.literal("")),
  isPrimary: z.boolean().optional(),
});

export type VehicleFormData = z.infer<typeof vehicleSchema>;

export const newsletterSchema = z.object({
  email: z.string().email("Valid email is required"),
});

export type NewsletterFormData = z.infer<typeof newsletterSchema>;
