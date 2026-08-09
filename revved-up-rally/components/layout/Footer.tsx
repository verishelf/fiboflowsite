"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  subscribeNewsletter,
  type NewsletterActionState,
} from "@/app/actions/newsletter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FOOTER_LINKS } from "@/lib/data/seed-data";
import { cn } from "@/lib/utils";

const initialState: NewsletterActionState = {
  success: false,
  message: "",
};

function SocialIcon({
  children,
  href,
  label,
}: {
  children: React.ReactNode;
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center border border-white/10 text-white/60 transition-colors hover:border-white/30 hover:text-off-white"
    >
      {children}
    </a>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

export function Footer() {
  const [state, formAction, pending] = useActionState(
    subscribeNewsletter,
    initialState,
  );

  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="section-padding mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <Link
              href="/"
              className="font-display text-lg uppercase tracking-[0.3em] text-off-white"
            >
              Revved Up Rally
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/50">
              A curated community for enthusiasts who demand more — cinematic
              drives, exclusive destinations, and a network built for those who
              live for the road.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <SocialIcon href="https://instagram.com" label="Instagram">
                <InstagramIcon className="h-4 w-4" />
              </SocialIcon>
              <SocialIcon href="https://tiktok.com" label="TikTok">
                <TikTokIcon className="h-4 w-4" />
              </SocialIcon>
              <SocialIcon href="https://youtube.com" label="YouTube">
                <YoutubeIcon className="h-4 w-4" />
              </SocialIcon>
              <SocialIcon href="https://facebook.com" label="Facebook">
                <FacebookIcon className="h-4 w-4" />
              </SocialIcon>
            </div>
          </div>

          <div>
            <p className="mb-6 text-xs uppercase tracking-[0.3em] text-white/40">
              Explore
            </p>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-off-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-6 text-xs uppercase tracking-[0.3em] text-white/40">
              Newsletter
            </p>
            <p className="mb-4 text-sm text-white/50">
              Rally announcements, member stories, and exclusive access — delivered
              to your inbox.
            </p>
            <form action={formAction} className="space-y-3">
              <Input
                type="email"
                name="email"
                placeholder="Email address"
                required
                aria-label="Email address"
              />
              <Button type="submit" disabled={pending} className="w-full">
                {pending ? "Subscribing..." : "Subscribe"}
              </Button>
              {state.message && (
                <p
                  className={cn(
                    "text-xs",
                    state.success ? "text-off-white/80" : "text-red-400",
                  )}
                >
                  {state.message}
                </p>
              )}
            </form>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-white/40 md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} Revved Up Rally. All rights reserved.</p>
          <p className="uppercase tracking-[0.2em]">
            Drive. Discover. Belong.
          </p>
        </div>
      </div>
    </footer>
  );
}
