"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClientSafe } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/layout/SectionHeading";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const supabase = createClientSafe();
    if (!supabase) {
      setMessage("Supabase is not configured. Set environment variables to enable login.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    router.push(redirect);
    router.refresh();
  };

  const handleMagicLink = async () => {
    setLoading(true);
    const supabase = createClientSafe();
    if (!supabase) {
      setMessage("Supabase is not configured.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
      },
    });

    setMessage(error ? error.message : "Check your email for a magic link.");
    setLoading(false);
  };

  return (
    <div className="section-padding mx-auto flex min-h-[70vh] max-w-md flex-col justify-center pt-32">
      <SectionHeading title="MEMBER LOGIN" align="center" />
      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2"
            required
          />
        </div>
        <div>
          <Label>Password</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2"
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          SIGN IN
        </Button>
        <Button
          type="button"
          variant="secondary"
          disabled={loading || !email}
          onClick={handleMagicLink}
          className="w-full"
        >
          SEND MAGIC LINK
        </Button>
        {message && <p className="text-sm text-white/60">{message}</p>}
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="section-padding pt-32 text-center text-white/50">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
