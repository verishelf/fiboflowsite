"use client";

import { QRCodeSVG } from "qrcode.react";
import { getPlanById, type MembershipPlanId } from "@/lib/pricing/membership-plans";
import type { Member } from "@/types/database";

interface MemberCardProps {
  member?: Member;
  membershipNumber?: string;
  planId?: string;
  memberSince?: string;
  memberId?: string;
}

export function MemberCard(props: MemberCardProps) {
  const member = props.member;
  const membershipNumber =
    props.membershipNumber ?? member?.membership_number ?? "RR-PENDING";
  const planId = props.planId ?? member?.membership_plan_id ?? "plus";
  const memberSince =
    props.memberSince ??
    (member?.joined_at
      ? String(new Date(member.joined_at).getFullYear())
      : String(new Date().getFullYear()));
  const memberId = props.memberId ?? member?.id ?? membershipNumber;

  const plan = getPlanById(planId as MembershipPlanId);

  return (
    <div className="relative aspect-[1.6/1] max-w-md overflow-hidden border border-white/20 bg-gradient-to-br from-charcoal to-black p-8">
      <div className="flex h-full flex-col justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-silver">
            REVVED UP RALLY
          </p>
          <p className="mt-6 font-display text-2xl uppercase tracking-[0.15em]">
            {plan?.name ?? planId.toUpperCase()} MEMBER
          </p>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="font-display text-xl tracking-[0.2em]">{membershipNumber}</p>
            <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-white/40">
              MEMBER SINCE {memberSince}
            </p>
          </div>
          <QRCodeSVG value={memberId} size={64} bgColor="transparent" fgColor="#f5f5f0" />
        </div>
      </div>
    </div>
  );
}
