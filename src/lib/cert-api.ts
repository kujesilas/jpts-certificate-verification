import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { CENTRE_NAME } from "@/lib/programmes";

export type CertificateStatus = "valid" | "revoked";

export type PublicCertificate = {
  certNumber: string;
  verificationCode: string;
  holderName: string;
  programme: string;
  qualification: string;
  grade: string | null;
  issueDate: string;
  expiryDate: string | null;
  status: CertificateStatus;
  issuedByName: string | null;
  revokeReason: string | null;
};

export type RegistryCertificate = PublicCertificate & {
  id: string;
  holderEmail: string | null;
  notes: string | null;
  createdAt: string;
};

export type RegistryStats = {
  total: number;
  valid: number;
  revoked: number;
};

type CertificateRow = {
  id: string;
  year: number;
  serial: number;
  cert_number: string;
  verification_code: string;
  holder_name: string;
  holder_email: string | null;
  programme: string;
  qualification: string;
  grade: string | null;
  issue_date: string;
  expiry_date: string | null;
  status: string;
  revoke_reason: string | null;
  revoked_at: string | null;
  issued_by_user_id: string;
  issued_by_name: string | null;
  notes: string | null;
  created_at: string;
};

function asStatus(value: string): CertificateStatus {
  return value === "revoked" ? "revoked" : "valid";
}

function toPublic(row: CertificateRow): PublicCertificate {
  return {
    certNumber: row.cert_number,
    verificationCode: row.verification_code,
    holderName: row.holder_name,
    programme: row.programme,
    qualification: row.qualification,
    grade: row.grade,
    issueDate: row.issue_date,
    expiryDate: row.expiry_date,
    status: asStatus(row.status),
    issuedByName: row.issued_by_name,
    revokeReason: row.revoke_reason,
  };
}

function toRegistry(row: CertificateRow): RegistryCertificate {
  return {
    ...toPublic(row),
    id: row.id,
    holderEmail: row.holder_email,
    notes: row.notes,
    createdAt: row.created_at,
  };
}

function makeCode(length = 8): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]!).join("");
}

function padSerial(serial: number): string {
  return String(serial).padStart(4, "0");
}

async function seedIfEmpty() {
  const sql = await getSql();
  const [{ n }] = await sql<{ n: number }>`select count(*)::int as n from certificates`;
  if (n > 0) return;

  const demo: Array<{
    year: number;
    serial: number;
    holder: string;
    email: string;
    programme: string;
    qualification: string;
    grade: string;
    issue: string;
    expiry: string | null;
    status: CertificateStatus;
    code: string;
    reason: string | null;
  }> = [
    {
      year: 2026,
      serial: 1,
      holder: "Amina Bello",
      email: "amina.bello@example.com",
      programme: "Occupational Health and Safety",
      qualification: "Professional Certificate Level 4",
      grade: "Distinction",
      issue: "2026-03-14",
      expiry: null,
      status: "valid",
      code: "K7NQ2B4H",
      reason: null,
    },
    {
      year: 2026,
      serial: 2,
      holder: "Chinedu Okafor",
      email: "chinedu.okafor@example.com",
      programme: "Business Administration and Management",
      qualification: "International Diploma",
      grade: "Credit",
      issue: "2026-05-22",
      expiry: null,
      status: "valid",
      code: "P3WM8C6R",
      reason: null,
    },
    {
      year: 2025,
      serial: 148,
      holder: "Fatima Abdullahi",
      email: "fatima.abdullahi@example.com",
      programme: "Oil and Gas Operations",
      qualification: "Professional Certificate Level 5",
      grade: "Credit",
      issue: "2025-11-08",
      expiry: null,
      status: "valid",
      code: "H5TY9L2D",
      reason: null,
    },
    {
      year: 2024,
      serial: 91,
      holder: "Musa Suleiman",
      email: "musa.suleiman@example.com",
      programme: "Project Management",
      qualification: "Professional Certificate Level 4",
      grade: "Pass",
      issue: "2024-07-19",
      expiry: null,
      status: "revoked",
      code: "X2QF4V8N",
      reason: "Record withdrawn after an administrative review by the Centre.",
    },
  ];

  for (const item of demo) {
    const certNumber = `JPTS-AKW-${item.year}-${padSerial(item.serial)}`;
    await sql`
      insert into certificates (
        id, year, serial, cert_number, verification_code,
        holder_name, holder_email, programme, qualification, grade,
        issue_date, expiry_date, status, revoke_reason, revoked_at,
        issued_by_user_id, issued_by_name, notes
      ) values (
        ${crypto.randomUUID()},
        ${item.year},
        ${item.serial},
        ${certNumber},
        ${item.code},
        ${item.holder},
        ${item.email},
        ${item.programme},
        ${item.qualification},
        ${item.grade},
        ${item.issue},
        ${item.expiry},
        ${item.status},
        ${item.reason},
        ${item.status === "revoked" ? item.issue : null},
        ${"system-registry"},
        ${CENTRE_NAME + " Registry"},
        ${null}
      )
    `;
  }
}

export const prepareRegistry = createServerFn({ method: "GET" }).handler(async () => {
  await seedIfEmpty();
  return { ok: true as const };
});

export const lookupCertificate = createServerFn({ method: "GET" })
  .validator((data: { query: string }) => {
    const query = data.query.trim().toUpperCase().replace(/\s+/g, "");
    return { query };
  })
  .handler(async ({ data }) => {
    await seedIfEmpty();
    if (!data.query) return null;
    const sql = await getSql();
    const rows = await sql<CertificateRow>`
      select * from certificates
      where replace(upper(cert_number), ' ', '') = ${data.query}
         or upper(verification_code) = ${data.query}
      limit 1
    `;
    const row = rows[0];
    return row ? toPublic(row) : null;
  });

export const listCertificates = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((data: { query?: string } = {}) => ({
    query: (data.query ?? "").trim(),
  }))
  .handler(async ({ data }) => {
    await seedIfEmpty();
    const sql = await getSql();
    const q = data.query;
    if (!q) {
      const rows = await sql<CertificateRow>`
        select * from certificates
        order by issue_date desc, year desc, serial desc
      `;
      return rows.map(toRegistry);
    }
    const pattern = `%${q}%`;
    const rows = await sql<CertificateRow>`
      select * from certificates
      where holder_name ilike ${pattern}
         or cert_number ilike ${pattern}
         or programme ilike ${pattern}
         or verification_code ilike ${pattern}
      order by issue_date desc, year desc, serial desc
    `;
    return rows.map(toRegistry);
  });

export const getRegistryStats = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    await seedIfEmpty();
    const sql = await getSql();
    const [row] = await sql<RegistryStats>`
      select
        count(*)::int as total,
        count(*) filter (where status = 'valid')::int as valid,
        count(*) filter (where status = 'revoked')::int as revoked
      from certificates
    `;
    return row ?? { total: 0, valid: 0, revoked: 0 };
  });

export const issueCertificate = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: {
    holderName: string;
    holderEmail: string;
    programme: string;
    qualification: string;
    grade: string;
    issueDate: string;
    expiryDate: string;
    notes: string;
    issuedByName: string;
  }) => {
    const holderName = data.holderName.trim();
    const programme = data.programme.trim();
    const qualification = data.qualification.trim();
    const issueDate = data.issueDate.trim();
    if (!holderName) throw new Error("Student name is required.");
    if (!programme) throw new Error("Programme is required.");
    if (!qualification) throw new Error("Qualification is required.");
    if (!issueDate) throw new Error("Issue date is required.");
    return {
      holderName,
      holderEmail: data.holderEmail.trim() || null,
      programme,
      qualification,
      grade: data.grade.trim() || null,
      issueDate,
      expiryDate: data.expiryDate.trim() || null,
      notes: data.notes.trim() || null,
      issuedByName: data.issuedByName.trim() || "Registry Staff",
    };
  })
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const year = Number(data.issueDate.slice(0, 4));
    const [{ max }] = await sql<{ max: number }>`
      select coalesce(max(serial), 0)::int as max
      from certificates
      where year = ${year}
    `;
    const serial = max + 1;
    const certNumber = `JPTS-AKW-${year}-${padSerial(serial)}`;
    let verificationCode = makeCode();
    for (let i = 0; i < 6; i += 1) {
      const clash = await sql<{ n: number }>`
        select count(*)::int as n from certificates where verification_code = ${verificationCode}
      `;
      if (clash[0]!.n === 0) break;
      verificationCode = makeCode();
    }

    const id = crypto.randomUUID();
    const rows = await sql<CertificateRow>`
      insert into certificates (
        id, year, serial, cert_number, verification_code,
        holder_name, holder_email, programme, qualification, grade,
        issue_date, expiry_date, status, issued_by_user_id, issued_by_name, notes
      ) values (
        ${id},
        ${year},
        ${serial},
        ${certNumber},
        ${verificationCode},
        ${data.holderName},
        ${data.holderEmail},
        ${data.programme},
        ${data.qualification},
        ${data.grade},
        ${data.issueDate},
        ${data.expiryDate},
        ${"valid"},
        ${context.userId},
        ${data.issuedByName},
        ${data.notes}
      )
      returning *
    `;
    return toRegistry(rows[0]!);
  });

export const revokeCertificate = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { id: string; reason: string }) => {
    const id = data.id.trim();
    const reason = data.reason.trim();
    if (!id) throw new Error("Certificate is required.");
    if (!reason) throw new Error("A reason is required to revoke a certificate.");
    return { id, reason };
  })
  .handler(async ({ data }) => {
    const sql = await getSql();
    const rows = await sql<CertificateRow>`
      update certificates
      set status = 'revoked',
          revoke_reason = ${data.reason},
          revoked_at = now()
      where id = ${data.id}
      returning *
    `;
    const row = rows[0];
    if (!row) throw new Error("Certificate was not found.");
    return toRegistry(row);
  });
