interface LegalNoticeProps {
  title: string;
}

export function LegalNotice({ title }: LegalNoticeProps) {
  return (
    <div className="mb-12 border border-amber-500/30 bg-amber-500/5 p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-amber-400/80">Attorney Review Required</p>
      <p className="mt-3 text-sm leading-relaxed text-white/60">
        This {title} page contains placeholder legal content for development purposes
        only. It must be reviewed and approved by qualified legal counsel before
        publication or use in any official capacity.
      </p>
    </div>
  );
}
