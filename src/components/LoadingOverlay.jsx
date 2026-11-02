import LoadingSpinner from "@/components/LoadingSpinner";

export default function LoadingOverlay({ label = "Loading" }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-background/75 text-primary backdrop-blur-md"
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <LoadingSpinner className="size-16 border-4" />
      <span className="text-sm font-semibold text-foreground">{label}</span>
    </div>
  );
}
