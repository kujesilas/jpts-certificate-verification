import { createFileRoute, Link } from "@tanstack/react-router";
import { Printer, ShieldAlert, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { CertificateDocument } from "@/components/certificate-document";
import { StatusBadge } from "@/components/site-frame";
import { Button } from "@/components/ui/button";
import { lookupCertificate } from "@/lib/cert-api";

export const Route = createFileRoute("/c/$number")({
  loader: ({ params }) => lookupCertificate({ data: { query: params.number } }),
  component: CertificatePage,
});

function CertificatePage() {
  const { number } = Route.useParams();
  const cert = Route.useLoaderData();
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  if (!cert) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16 text-center">
        <ShieldAlert className="mx-auto size-10 text-danger" />
        <h1 className="mt-4 font-display text-3xl font-semibold text-forest">
          No matching record
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          <span className="font-medium text-ink">{number}</span> is not in the
          Akwanga Centre register. Check the number on the printed certificate
          and try again.
        </p>
        <Button asChild className="mt-6">
          <Link to="/">Verify another certificate</Link>
        </Button>
      </main>
    );
  }

  const verifyUrl = origin ? `${origin}/c/${cert.certNumber}` : `/c/${cert.certNumber}`;
  const valid = cert.status === "valid";

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
      <div className="no-print mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          {valid ? (
            <ShieldCheck className="mt-0.5 size-7 text-ok" />
          ) : (
            <ShieldAlert className="mt-0.5 size-7 text-danger" />
          )}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-2xl font-semibold text-forest sm:text-3xl">
                {valid ? "Certificate is valid" : "Certificate has been revoked"}
              </h1>
              <StatusBadge status={cert.status} />
            </div>
            <p className="mt-1 text-sm text-muted">
              {valid
                ? "This award matches a current record in the JPTS Akwanga Centre register."
                : cert.revokeReason ||
                  "The Centre has withdrawn this record. It must not be presented as a current award."}
            </p>
          </div>
        </div>
        <Button type="button" variant="cream" onClick={() => window.print()}>
          <Printer className="size-4" />
          Print
        </Button>
      </div>

      <CertificateDocument cert={cert} verifyUrl={verifyUrl} />
    </main>
  );
}
