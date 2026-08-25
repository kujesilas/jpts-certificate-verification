import { format, parseISO } from "date-fns";
import { Crest } from "@/components/crest";
import { QrMark } from "@/components/qr-mark";
import type { PublicCertificate } from "@/lib/cert-api";
import { CENTRE_NAME, CENTRE_STATE, INSTITUTION_NAME } from "@/lib/programmes";
import { cn } from "@/lib/utils";

function prettyDate(value: string) {
  try {
    return format(parseISO(value), "d MMMM yyyy");
  } catch {
    return value;
  }
}

export function CertificateDocument({
  cert,
  verifyUrl,
  className,
}: {
  cert: PublicCertificate;
  verifyUrl: string;
  className?: string;
}) {
  const revoked = cert.status === "revoked";

  return (
    <article
      className={cn(
        "certificate-sheet relative overflow-hidden px-6 py-10 sm:px-12 sm:py-12",
        className,
      )}
    >
      {revoked ? <div className="certificate-watermark">Revoked</div> : null}

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="flex items-center gap-3">
          <Crest className="size-14 sm:size-16" />
          <div className="text-left">
            <p className="font-display text-lg font-semibold tracking-wide text-forest sm:text-xl">
              {INSTITUTION_NAME}
            </p>
            <p className="text-xs tracking-[0.18em] text-gold uppercase">
              {CENTRE_NAME} · {CENTRE_STATE}
            </p>
          </div>
        </div>

        <div className="mt-6 h-px w-48 bg-gold/70" />

        <p className="mt-6 font-display text-sm tracking-[0.28em] text-gold uppercase">
          Certificate of Award
        </p>
        <h2 className="mt-2 max-w-xl font-display text-3xl font-semibold text-forest sm:text-4xl">
          {cert.qualification}
        </h2>

        <p className="mt-6 text-sm text-muted">This is to certify that</p>
        <p className="mt-1 font-display text-3xl italic font-semibold text-ink sm:text-5xl">
          {cert.holderName}
        </p>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
          has successfully completed the prescribed course of study in
          <span className="font-semibold text-ink"> {cert.programme}</span> at{" "}
          {CENTRE_NAME}, {CENTRE_STATE}, and is hereby awarded this qualification
          {cert.grade ? (
            <>
              {" "}
              with a grade of <span className="font-semibold text-ink">{cert.grade}</span>
            </>
          ) : null}
          .
        </p>

        <dl className="mt-8 grid w-full max-w-2xl grid-cols-1 gap-4 text-left sm:grid-cols-3">
          <div className="rounded-md bg-paper/80 px-3 py-2">
            <dt className="text-xs tracking-[0.16em] text-muted uppercase">
              Certificate no.
            </dt>
            <dd className="mt-0.5 font-medium tabular-nums">{cert.certNumber}</dd>
          </div>
          <div className="rounded-md bg-paper/80 px-3 py-2">
            <dt className="text-xs tracking-[0.16em] text-muted uppercase">
              Date of issue
            </dt>
            <dd className="mt-0.5 font-medium">{prettyDate(cert.issueDate)}</dd>
          </div>
          <div className="rounded-md bg-paper/80 px-3 py-2">
            <dt className="text-xs tracking-[0.16em] text-muted uppercase">
              {cert.expiryDate ? "Valid until" : "Validity"}
            </dt>
            <dd className="mt-0.5 font-medium">
              {cert.expiryDate ? prettyDate(cert.expiryDate) : "Does not expire"}
            </dd>
          </div>
        </dl>

        <div className="mt-10 flex w-full max-w-2xl flex-col items-center justify-between gap-8 sm:flex-row sm:items-end">
          <div className="text-center">
            <div className="mx-auto h-px w-40 bg-ink/40" />
            <p className="mt-2 font-display text-sm italic text-ink">Registrar</p>
            <p className="text-xs text-muted">{cert.issuedByName ?? CENTRE_NAME}</p>
          </div>

          <div className="flex flex-col items-center">
            <QrMark value={verifyUrl} className="size-24 shadow-[var(--shadow-border)]" />
            <p className="mt-2 text-xs tracking-[0.14em] text-muted uppercase">
              Scan to verify · {cert.verificationCode}
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto h-px w-40 bg-ink/40" />
            <p className="mt-2 font-display text-sm italic text-ink">Centre Director</p>
            <p className="text-xs text-muted">{CENTRE_NAME}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
