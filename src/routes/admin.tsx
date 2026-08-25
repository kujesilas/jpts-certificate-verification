import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { FilePlus2, LayoutList } from "lucide-react";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { user, isPending } = useCurrentUserState();

  if (isPending) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="h-40 animate-pulse rounded-xl bg-cream" />
      </main>
    );
  }
  if (!user) return <RedirectToSignIn />;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs tracking-[0.2em] text-gold uppercase">Staff registry</p>
          <h1 className="font-display text-3xl font-semibold text-forest">
            Certificate register
          </h1>
          <p className="mt-1 text-sm text-muted">
            Signed in as {user.displayName ?? user.primaryEmail ?? "registry staff"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/admin"
            activeOptions={{ exact: true }}
            className={cn(
              "inline-flex h-11 items-center gap-2 rounded-md bg-cream px-4 text-sm font-medium text-ink shadow-[var(--shadow-border)]",
            )}
            activeProps={{
              className: "bg-forest text-forest-fg shadow-none",
            }}
          >
            <LayoutList className="size-4" />
            All records
          </Link>
          <Link
            to="/admin/issue"
            className="inline-flex h-11 items-center gap-2 rounded-md bg-gold px-4 text-sm font-medium text-ink"
          >
            <FilePlus2 className="size-4" />
            Issue certificate
          </Link>
        </div>
      </div>
      <Outlet />
    </main>
  );
}
