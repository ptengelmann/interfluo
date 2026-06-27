# Security Policy

Interfluo handles confidential legal documents and personal data for UK
residential conveyancing matters. Security issues are taken seriously and
triaged within one working day of receipt.

## Reporting a vulnerability

**Do not open a public issue.** Email **security@interfluo.co** with:

- A description of the issue
- Steps to reproduce
- The affected version or commit SHA, if known
- Any proof-of-concept code or screenshots
- Your contact details

We will acknowledge receipt within one working day and provide a remediation
timeline within five working days. Coordinated disclosure preferred. Reporters
will be credited once the issue is resolved, if requested.

## Scope

In scope:

- The Interfluo web application, API, and ingestion pipeline
- The marketing site
- Build, release, and deployment infrastructure
- Authentication, authorisation, and tenancy boundaries (Clerk Organizations)
- Any path that could exfiltrate matter data, audit-trail entries, or firm
  templates across tenant boundaries

Out of scope:

- Findings against local development environments
- Reports requiring physical access to user devices
- Theoretical issues without demonstrated impact
- Social engineering of Interfluo staff or pilot firms
- Denial of service via volumetric attacks against rate-limited endpoints

## Supported versions

Interfluo is pre-1.0 pilot software. Only the current `main` branch is
supported. Once production releases begin, the latest minor version will
receive security patches for twelve months from its release.

## Defensive posture

- UK-resident infrastructure
- Zero-retention model API under a Data Processing Addendum; no training on
  customer data
- Append-only audit log per matter, retained for SRA file-inspection windows
- Per-firm tenancy enforced at the database query layer; no cross-tenant data
  ever leaves a connection

If a finding undermines any of these, treat it as critical and report by email.
