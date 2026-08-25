import { createFileRoute, Link } from "@tanstack/react-router";
import { format, parseISO } from "date-fns";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { StatusBadge } from "@/components/site-frame";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import {
  getRegistryStats,
  listCertificates,
  revokeCertificate,
  type RegistryCertificate,
  type RegistryStats,
} from "@/lib/cert-api";

export const Route = createFileRoute("/admin/")({
  component: RegistryHome,
});

function prettyDate(value: string) {
  try {
    return format(parseISO(value), "d MMM yyyy");
  } catch {
    return value;
  }
}

function RegistryHome() {
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState<RegistryCertificate[] | null>(null);
  const [stats, setStats] = useState<RegistryStats | null>(null);
  const [revoking, setRevoking] = useState<RegistryCertificate | null>(null);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  async function refresh(nextQuery: string) {
    const [list, nextStats] = await Promise.all([
      listCertificates({ data: { query: nextQuery } }),
      getRegistryStats(),
    ]);
    setRows(list);
    setStats(nextStats);
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void refresh(query).catch((err: unknown) =>
        toast.error(err instanceof Error ? err.message : "Could not load the register."),
      );
    }, query ? 250 : 0);
    return () => window.clearTimeout(timer);
  }, [query]);

  async function confirmRevoke() {
    if (!revoking) return;
    setBusy(true);
    try {
      await revokeCertificate({ data: { id: revoking.id, reason } });
      toast.success(`${revoking.certNumber} has been revoked.`);
      setRevoking(null);
      setReason("");
      await refresh(query);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Revoke failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Issued", value: stats?.total ?? "—" },
          { label: "Valid", value: stats?.valid ?? "—" },
          { label: "Revoked", value: stats?.revoked ?? "—" },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-xl bg-cream px-4 py-4 shadow-[var(--shadow-border)]"
          >
            <p className="text-xs tracking-[0.16em] text-muted uppercase">{card.label}</p>
            <p className="mt-1 font-display text-3xl font-semibold tabular-nums text-forest">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="relative mt-6">
        <Search className="pointer-events-none absolute top-3.5 left-3 size-4 text-muted" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, number, programme or code"
          className="pl-10"
        />
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl bg-cream shadow-[var(--shadow-border)]">
        <table className="registry-table w-full text-left text-sm">
          <thead className="border-b border-line text-xs tracking-wide text-muted uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Number</th>
              <th className="px-4 py-3 font-medium">Holder</th>
              <th className="px-4 py-3 font-medium">Programme</th>
              <th className="px-4 py-3 font-medium">Issued</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium"> </th>
            </tr>
          </thead>
          <tbody>
            {rows === null ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted">
                  Loading register…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted">
                  No certificates match that search.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-t border-line/80">
                  <td className="px-4 py-3 font-medium tabular-nums">{row.certNumber}</td>
                  <td className="px-4 py-3">{row.holderName}</td>
                  <td className="px-4 py-3 text-muted">{row.programme}</td>
                  <td className="px-4 py-3 tabular-nums">{prettyDate(row.issueDate)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        to="/c/$number"
                        params={{ number: row.certNumber }}
                        className="inline-flex h-11 items-center rounded-md px-3 text-sm text-forest hover:bg-paper"
                      >
                        View
                      </Link>
                      {row.status === "valid" ? (
                        <button
                          type="button"
                          className="inline-flex h-11 items-center rounded-md px-3 text-sm text-danger hover:bg-paper"
                          onClick={() => {
                            setRevoking(row);
                            setReason("");
                          }}
                        >
                          Revoke
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {revoking ? (
        <div className="fixed inset-0 z-50 grid place-items-end bg-ink/40 p-4 sm:place-items-center">
          <div className="w-full max-w-md rounded-xl bg-cream p-5 shadow-[var(--shadow-border)]">
            <h2 className="font-display text-2xl font-semibold text-forest">
              Revoke {revoking.certNumber}
            </h2>
            <p className="mt-2 text-sm text-muted">
              This will mark the award for {revoking.holderName} as withdrawn. The
              public verify page will show a revoked status.
            </p>
            <label className="mt-4 mb-1.5 block text-sm font-medium" htmlFor="revoke-reason">
              Reason
            </label>
            <Textarea
              id="revoke-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Why is this certificate being withdrawn?"
            />
            <div className="mt-4 flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setRevoking(null)}
                disabled={busy}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="danger"
                onClick={() => void confirmRevoke()}
                disabled={busy || !reason.trim()}
              >
                {busy ? "Revoking…" : "Revoke certificate"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
