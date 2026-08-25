import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { CertificateDocument } from "@/components/certificate-document";
import { Button } from "@/components/ui/button";
import { Field, Input, SelectField, Textarea } from "@/components/ui/input";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { issueCertificate, type PublicCertificate } from "@/lib/cert-api";
import { GRADES, PROGRAMMES, QUALIFICATIONS } from "@/lib/programmes";

export const Route = createFileRoute("/admin/issue")({
  component: IssuePage,
});

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function IssuePage() {
  const navigate = useNavigate();
  const user = useCurrentUser();
  const [holderName, setHolderName] = useState("");
  const [holderEmail, setHolderEmail] = useState("");
  const [programme, setProgramme] = useState<string>(PROGRAMMES[0]);
  const [qualification, setQualification] = useState<string>(QUALIFICATIONS[0]);
  const [grade, setGrade] = useState("");
  const [issueDate, setIssueDate] = useState(todayIso());
  const [expiryDate, setExpiryDate] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  const preview: PublicCertificate = useMemo(
    () => ({
      certNumber: "JPTS-AKW-DRAFT-0000",
      verificationCode: "PREVIEW",
      holderName: holderName.trim() || "Student name",
      programme,
      qualification,
      grade: grade || null,
      issueDate,
      expiryDate: expiryDate || null,
      status: "valid",
      issuedByName: user?.displayName ?? user?.primaryEmail ?? "Registry Staff",
      revokeReason: null,
    }),
    [holderName, programme, qualification, grade, issueDate, expiryDate, user],
  );

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      const created = await issueCertificate({
        data: {
          holderName,
          holderEmail,
          programme,
          qualification,
          grade,
          issueDate,
          expiryDate,
          notes,
          issuedByName: user?.displayName ?? user?.primaryEmail ?? "Registry Staff",
        },
      });
      toast.success(`Issued ${created.certNumber}`);
      await navigate({ to: "/c/$number", params: { number: created.certNumber } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not issue the certificate.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
      <form
        onSubmit={onSubmit}
        className="rounded-xl bg-cream p-5 shadow-[var(--shadow-border)] sm:p-6"
      >
        <h2 className="font-display text-2xl font-semibold text-forest">
          New certificate
        </h2>
        <p className="mt-1 text-sm text-muted">
          The number is assigned automatically when you issue the award.
        </p>
        <div className="mt-5 space-y-4">
          <Field label="Student full name" htmlFor="holder">
            <Input
              id="holder"
              value={holderName}
              onChange={(e) => setHolderName(e.target.value)}
              required
              autoComplete="name"
            />
          </Field>
          <Field label="Email (optional)" htmlFor="email">
            <Input
              id="email"
              type="email"
              value={holderEmail}
              onChange={(e) => setHolderEmail(e.target.value)}
              autoComplete="email"
            />
          </Field>
          <Field label="Programme" htmlFor="programme">
            <SelectField
              id="programme"
              value={programme}
              onChange={(e) => setProgramme(e.target.value)}
            >
              {PROGRAMMES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </SelectField>
          </Field>
          <Field label="Qualification" htmlFor="qualification">
            <SelectField
              id="qualification"
              value={qualification}
              onChange={(e) => setQualification(e.target.value)}
            >
              {QUALIFICATIONS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </SelectField>
          </Field>
          <Field label="Grade (optional)" htmlFor="grade">
            <SelectField
              id="grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
            >
              <option value="">Not stated</option>
              {GRADES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </SelectField>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date of issue" htmlFor="issued">
              <Input
                id="issued"
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                required
              />
            </Field>
            <Field label="Expiry (optional)" htmlFor="expiry">
              <Input
                id="expiry"
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </Field>
          </div>
          <Field label="Internal note (optional)" htmlFor="notes">
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Field>
          <Button type="submit" className="w-full" disabled={busy || !holderName.trim()}>
            {busy ? "Issuing…" : "Issue certificate"}
          </Button>
        </div>
      </form>

      <div className="min-w-0">
        <p className="mb-3 text-xs tracking-[0.18em] text-muted uppercase">Live preview</p>
        <CertificateDocument cert={preview} verifyUrl="https://verify.jpts.local/c/preview" />
      </div>
    </div>
  );
}
