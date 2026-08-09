export type ActionResult<T = void> = {
  success: boolean;
  error?: string;
  data?: T;
};

export function devSuccess<T>(
  action: string,
  payload?: unknown,
  data?: T,
): ActionResult<T> {
  console.log(`[dev] ${action}:`, payload);
  return {
    success: true,
    data: (data ?? {
      message: `${action} recorded (dev mode — Supabase not configured)`,
    }) as T,
  };
}

export async function getClientIp(): Promise<string> {
  const { headers } = await import("next/headers");
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("x-real-ip") ??
    "unknown"
  );
}
