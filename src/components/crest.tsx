import { cn } from "@/lib/utils";

export function Crest({ className, variant = "gold" }: { className?: string; variant?: "gold" | "cream" }) {
  const stroke = variant === "gold" ? "var(--color-gold)" : "var(--color-gold-soft)";
  const fill = variant === "gold" ? "var(--color-gold)" : "var(--color-gold-soft)";
  return (
    <svg
      viewBox="0 0 80 80"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      <circle cx="40" cy="40" r="36" fill="none" stroke={stroke} strokeWidth="2.2" />
      <circle cx="40" cy="40" r="30" fill="none" stroke={stroke} strokeWidth="0.8" />
      <path
        d="M40 16c8 8 12 16 12 26 0 10-5 18-12 22-7-4-12-12-12-22 0-10 4-18 12-26z"
        fill={fill}
      />
      <path
        d="M18 38c8-2 14-8 22-8s14 6 22 8c-2 14-12 24-22 28-10-4-20-14-22-28z"
        fill="none"
        stroke={stroke}
        strokeWidth="1.4"
      />
      <path d="M28 34h24M32 40h16M36 46h8" stroke="var(--color-forest)" strokeWidth="1.6" />
    </svg>
  );
}
