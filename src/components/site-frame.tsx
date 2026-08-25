import { Link } from "@tanstack/react-router";
import { Menu, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { Crest } from "@/components/crest";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { CENTRE_NAME, INSTITUTION_SHORT } from "@/lib/programmes";
import { cn } from "@/lib/utils";

function AuthSlot() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return <div className="h-9 w-28 animate-pulse rounded-md bg-white/10" />;
  }
  if (!user) {
    return (
      <Button asChild variant="gold" size="sm">
        <Link to="/login">Staff sign in</Link>
      </Button>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <Button asChild variant="outline" size="sm">
        <Link to="/admin">Registry</Link>
      </Button>
      <button
        type="button"
        onClick={() => void signOut("/")}
        className="h-9 rounded-md px-3 text-sm text-forest-fg/80 transition-colors hover:text-forest-fg"
      >
        Sign out
      </button>
    </div>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user } = useCurrentUserState();

  return (
    <header className="no-print sticky top-0 z-40 bg-forest text-forest-fg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center gap-2.5">
          <Crest className="size-9" variant="cream" />
          <span className="leading-tight">
            <span className="block font-display text-lg font-semibold tracking-wide">
              {INSTITUTION_SHORT} Verify
            </span>
            <span className="hidden text-xs tracking-[0.16em] text-gold-soft uppercase sm:block">
              {CENTRE_NAME}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link to="/" className="text-forest-fg/80 transition-colors hover:text-forest-fg">
            Verify
          </Link>
          <a href="/#how" className="text-forest-fg/80 transition-colors hover:text-forest-fg">
            How it works
          </a>
          {user ? (
            <Link
              to="/admin"
              className="text-forest-fg/80 transition-colors hover:text-forest-fg"
            >
              Registry
            </Link>
          ) : null}
          <AuthSlot />
        </nav>

        <button
          type="button"
          className="grid size-11 place-items-center rounded-md md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <div
        className={cn(
          "border-t border-white/10 px-4 py-3 md:hidden",
          open ? "block" : "hidden",
        )}
      >
        <div className="flex flex-col gap-3 text-sm">
          <Link to="/" onClick={() => setOpen(false)}>
            Verify a certificate
          </Link>
          <a href="/#how" onClick={() => setOpen(false)}>
            How it works
          </a>
          {user ? (
            <Link to="/admin" onClick={() => setOpen(false)}>
              Staff registry
            </Link>
          ) : null}
          <AuthSlot />
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="no-print border-t border-line bg-cream">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 size-5 text-gold" />
          <div>
            <p className="font-display text-lg font-semibold text-forest">
              {INSTITUTION_SHORT} Akwanga Centre
            </p>
            <p className="text-sm text-muted">
              Official web-based certification verification register · Nasarawa State
            </p>
          </div>
        </div>
        <p className="text-sm text-muted">
          Designed and implemented by <span className="text-ink">Kuje Silas</span>
        </p>
      </div>
    </footer>
  );
}

export function StatusBadge({ status }: { status: "valid" | "revoked" }) {
  const valid = status === "valid";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide uppercase",
        valid ? "bg-ok/12 text-ok" : "bg-danger/12 text-danger",
      )}
    >
      {valid ? "Valid" : "Revoked"}
    </span>
  );
}
