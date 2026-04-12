export default function SectionLabel({ label, number }) {
  return (
    <div className="flex items-center gap-4 mb-8 md:mb-12">
      {number && (
        <span className="font-heading text-xs text-accent tracking-widest">
          {String(number).padStart(2, "0")}
        </span>
      )}
      <div className="h-px flex-1 bg-border" />
      <span className="font-heading text-xs uppercase tracking-[0.3em] text-muted-foreground">
        {label}
      </span>
    </div>
  );
}
