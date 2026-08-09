export type MembershipPlanId = "basic" | "plus" | "elite" | "founders";

export type ComparisonFeature =
  | "membership"
  | "community"
  | "rallyAccess"
  | "priorityRegistration"
  | "vipEvents"
  | "hospitality"
  | "concierge"
  | "partnerBenefits"
  | "exclusiveMerchandise"
  | "founderStatus";

export interface MembershipPlan {
  id: MembershipPlanId;
  name: string;
  priceAnnual: number;
  stripePriceEnvKey: string;
  badge?: string;
  description: string;
  features: string[];
  comparison: Record<ComparisonFeature, boolean>;
  buttonLabel: string;
}

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: "basic",
    name: "BASIC",
    priceAnnual: 500,
    stripePriceEnvKey: "STRIPE_BASIC_PRICE_ID",
    description: "Entry into the Revved Up Rally community.",
    features: [
      "Revved Up Rally membership",
      "Member profile",
      "Member community",
      "Early rally announcements",
      "Member-only merchandise access",
      "Partner benefits",
      "Exclusive digital content",
    ],
    comparison: {
      membership: true,
      community: true,
      rallyAccess: true,
      priorityRegistration: false,
      vipEvents: false,
      hospitality: false,
      concierge: false,
      partnerBenefits: true,
      exclusiveMerchandise: true,
      founderStatus: false,
    },
    buttonLabel: "JOIN BASIC",
  },
  {
    id: "plus",
    name: "PLUS",
    priceAnnual: 1000,
    stripePriceEnvKey: "STRIPE_PLUS_PRICE_ID",
    badge: "MOST POPULAR",
    description: "Priority access and elevated member experiences.",
    features: [
      "Everything in Basic",
      "Priority rally registration",
      "Member-only events",
      "Premium partner benefits",
      "VIP hospitality opportunities",
      "Exclusive member merchandise",
      "Priority access to limited experiences",
    ],
    comparison: {
      membership: true,
      community: true,
      rallyAccess: true,
      priorityRegistration: true,
      vipEvents: true,
      hospitality: true,
      concierge: false,
      partnerBenefits: true,
      exclusiveMerchandise: true,
      founderStatus: false,
    },
    buttonLabel: "JOIN PLUS",
  },
  {
    id: "elite",
    name: "ELITE",
    priceAnnual: 5000,
    stripePriceEnvKey: "STRIPE_ELITE_PRICE_ID",
    description: "VIP rally access and premium concierge support.",
    features: [
      "Everything in Plus",
      "VIP rally access",
      "Priority placement",
      "Elite member events",
      "Premium hospitality",
      "Exclusive concierge support",
      "VIP partner experiences",
      "Limited-edition Elite merchandise",
      "Private driving experiences",
      "Elite networking",
    ],
    comparison: {
      membership: true,
      community: true,
      rallyAccess: true,
      priorityRegistration: true,
      vipEvents: true,
      hospitality: true,
      concierge: true,
      partnerBenefits: true,
      exclusiveMerchandise: true,
      founderStatus: false,
    },
    buttonLabel: "JOIN ELITE",
  },
  {
    id: "founders",
    name: "FOUNDERS",
    priceAnnual: 10000,
    stripePriceEnvKey: "STRIPE_FOUNDERS_PRICE_ID",
    badge: "LIMITED FOUNDING MEMBERSHIPS",
    description: "Limited founding membership with legacy status.",
    features: [
      "Everything in Elite",
      "Founding Member status",
      "Numbered membership",
      "Founder plaque",
      "Private Founder events",
      "VIP rally accommodations",
      "Private automotive experiences",
      "Personal concierge",
      "Exclusive Founder merchandise",
      "First access to future Revved Up Rally experiences",
    ],
    comparison: {
      membership: true,
      community: true,
      rallyAccess: true,
      priorityRegistration: true,
      vipEvents: true,
      hospitality: true,
      concierge: true,
      partnerBenefits: true,
      exclusiveMerchandise: true,
      founderStatus: true,
    },
    buttonLabel: "BECOME A FOUNDER",
  },
];

export const COMPARISON_LABELS: Record<ComparisonFeature, string> = {
  membership: "Membership",
  community: "Community",
  rallyAccess: "Rally Access",
  priorityRegistration: "Priority Registration",
  vipEvents: "VIP Events",
  hospitality: "Hospitality",
  concierge: "Concierge",
  partnerBenefits: "Partner Benefits",
  exclusiveMerchandise: "Exclusive Merchandise",
  founderStatus: "Founder Status",
};

export function getPlanById(id: MembershipPlanId): MembershipPlan | undefined {
  return MEMBERSHIP_PLANS.find((plan) => plan.id === id);
}

export function getStripePriceId(plan: MembershipPlan): string | undefined {
  const key = plan.stripePriceEnvKey;
  return process.env[key];
}
