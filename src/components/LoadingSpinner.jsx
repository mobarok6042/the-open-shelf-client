export default function LoadingSpinner({ className = "size-4", label = "Loading" }) {
  return (
    <span
      role="status"
      aria-label={label}
      className={`inline-block shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent ${className}`}
    />
  );
}
