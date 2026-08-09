import type { Metadata } from "next";
import { getDashboardMember, getMemberMessages } from "@/lib/data/admin-queries";
import { createPageMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";

export const metadata: Metadata = createPageMetadata({
  title: "Messages",
  description: "View messages from the Revved Up Rally team.",
  path: "/dashboard/messages",
});

export default async function MessagesPage() {
  const member = await getDashboardMember();
  const messages = await getMemberMessages(member.id);

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-white/40">Inbox</p>
        <h1 className="mt-2 font-display text-3xl uppercase tracking-[0.1em] text-off-white">
          Messages
        </h1>
      </div>

      {messages.length === 0 ? (
        <div className="border border-white/10 bg-charcoal p-12 text-center">
          <p className="text-sm text-white/50">No messages yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <article
              key={message.id}
              className={cn(
                "border border-white/10 bg-charcoal p-6 transition-colors",
                !message.read_at && "border-l-2 border-l-off-white",
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-off-white">{message.subject}</p>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">{message.body}</p>
                </div>
                {!message.read_at && (
                  <span className="shrink-0 text-[10px] uppercase tracking-[0.15em] text-off-white">
                    New
                  </span>
                )}
              </div>
              <p className="mt-4 text-xs text-white/30">
                {new Date(message.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
