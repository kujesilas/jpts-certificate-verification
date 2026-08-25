# JPTS Verify

Web-based certification verification for **Joint Professional Training and Support (JPTS), Akwanga Centre, Nasarawa State**.

**Student:** Kuje Silas  
**Project:** Design and Implementation of a Web-Based Certification Verification System

- **Live demo:** https://orchid-drift-quartz-opal.grok.me
- **Source:** https://github.com/kujesilas/jpts-certificate-verification

## What it does

Employers, other schools and graduates can confirm that a professional certificate was issued by JPTS Akwanga Centre and has not been withdrawn.

- Public visitors type a certificate number (or 8-character code) and see **Valid**, **Revoked**, or **No matching record**. No account is required.
- Registry staff sign in to issue new certificates, search the register, and revoke an award with a reason.
- Each issued award gets a number in the form `JPTS-AKW-YEAR-serial` (example: `JPTS-AKW-2026-0001`) and a printable certificate with a QR mark.

This system only checks the Akwanga Centre register. It does not verify certificates from other institutions.

## Try the live demo

Open https://orchid-drift-quartz-opal.grok.me and verify:

| Certificate number | Holder | Expected result |
|---|---|---|
| `JPTS-AKW-2026-0001` | Amina Bello | Valid |
| `JPTS-AKW-2026-0002` | Chinedu Okafor | Valid |
| `JPTS-AKW-2025-0148` | Fatima Abdullahi | Valid |
| `JPTS-AKW-2024-0091` | Musa Suleiman | Revoked |

Staff: **Staff sign in** → create an account → **Issue certificate**.

## Main pages

- `/` — public verification
- `/c/{number}` — certificate result
- `/login` — staff sign in
- `/admin` — register (signed-in staff)
- `/admin/issue` — issue a new certificate

## Stack

Web application with a server-side register (database), staff authentication, and a public lookup page.
