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
      <circle cx="40" cy="44" r="22" fill="none" stroke={stroke} strokeWidth="3.2" />
      <ellipse cx="40" cy="44" rx="10" ry="22" fill="none" stroke={stroke} strokeWidth="1.6" />
      <path d="M18 44h44" stroke={stroke} strokeWidth="1.6" />
      <path
        d="M22 18h36l-6 10H28z"
        fill={fill}
      />
      <path d="M40 18v-6" stroke={stroke} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M40 12l10 3" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      <rect x="34" y="66" width="12" height="4" rx="1" fill={fill} />
    </svg>
  );
}

export function BrandLogo({ className }: { className?: string }) {
  return (
    <img
      src="/jpts-logo.png"
      alt="Joint Professionals Training and Support International"
      className={cn("h-12 w-auto max-w-[220px] object-contain object-left", className)}
    />
  );
}
