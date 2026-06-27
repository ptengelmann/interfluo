#!/usr/bin/env tsx
/**
 * Read a bench output file and a scenario name, score the output against:
 *
 *   1. A checklist of "key signals" we expect to see in the enquiries or
 *      report for that scenario (pattern matching, kept for transition).
 *   2. The scenario's expected ConveyancingIssueCode set, asserting the
 *      pipeline routed each seeded issue to the right named code (hit),
 *      and flagging any emitted codes that were not seeded (over-flag).
 *   3. Severity-calibration anti-patterns: routine items appearing in
 *      CRITICAL/HIGH/P1 blocks (over-flagging).
 */
import { readFile } from 'node:fs/promises';
import type { ConveyancingIssueCode } from '@interfluo/core';
import { EXPECTED_ISSUE_CODES } from './scenarios/expected-codes';

interface SignalCheck {
  label: string;
  // The output (joined enquiries + report) must contain at least one of these
  // (case-insensitive substring match) to count as a hit.
  patterns: string[];
}

const SIGNALS: Record<string, SignalCheck[]> = {
  'leasehold-flat-with-issues': [
    {
      label: 'Lease term ≈71 years vs 80-year lender floor',
      patterns: ['80 year', '80-year', 'unexpired term', 'section 42'],
    },
    {
      label: 'Doubling ground rent / onerous review',
      patterns: ['doubling', 'doubles', 'onerous', 'deed of variation'],
    },
    {
      label: 'Freeholder consent required by restriction',
      patterns: ['freeholder', 'restriction on the proprietorship', 'written consent', 'NGL000123'],
    },
    {
      label: 'Unauthorised kitchen extension (planning / building regs)',
      patterns: ['kitchen extension', 'planning contravention', 'no planning permission'],
    },
    {
      label: 'Build-over agreement / private foul sewer',
      patterns: ['build-over', 'private foul sewer', 'private sewer'],
    },
    {
      label: 'TA6 vs drainage discrepancy',
      patterns: ['discrepancy', 'contradict', 'inconsistent', 'TA6'],
    },
    {
      label: 'Section 20 major works',
      patterns: ['section 20', 's.20', 'major roof works', '£8,400', '8,400'],
    },
    {
      label: 'Absence of sinking / reserve fund',
      patterns: ['sinking fund', 'reserve fund', 'no reserve'],
    },
    {
      label: 'Service charge dispute (entry phones)',
      patterns: ['service charge dispute', 'entry phone', 'apportionment'],
    },
    {
      label: 'Past insurance claim (2021 water damage)',
      patterns: ['insurance claim', '2021', 'water damage', '£4,200', '4,200'],
    },
    {
      label: 'Lender indemnity policy required',
      patterns: ['indemnity policy', 'indemnity insurance'],
    },
  ],
  'freehold-house-clean': [
    {
      label: 'No hallucinated material risks',
      patterns: ['no material risks', 'clean', 'no significant', 'no material issues'],
      // we count this as a hit if it appears anywhere (positive finding)
    },
    {
      label: 'Halifax mortgage discharge (informational)',
      patterns: ['halifax', 'redemption', 'DS1', 'discharge'],
    },
    {
      label: "TPO on neighbour's tree, not subject property",
      patterns: ['TPO', 'tree preservation', '49 beechwood', 'neighbour'],
    },
    {
      label: 'FENSA / NICEIC handover',
      patterns: ['FENSA', 'NICEIC', 'electrical'],
    },
    {
      label: 'Summer house permitted development',
      patterns: ['summer house', 'permitted development'],
    },
  ],
  'freehold-house-edge-cases': [
    // Genuine items the model SHOULD raise
    {
      label: "Adult occupier John Wilson — Occupier's Consent",
      patterns: ['john wilson', 'occupier', 'consent'],
    },
    {
      label: '2024 planning permission for rear extension — clarify if built',
      patterns: ['24/0918M', 'rear extension', 'planning permission', 'unexercised'],
    },
    {
      label: 'Kitchen rewire 2022 — no NICEIC / Part P',
      patterns: ['rewire', 'rewired', 'NICEIC', 'Part P', 'electrical certificate'],
    },
  ],
  'freehold-enforcement-and-undisclosed-occupier': [
    {
      label: 'Active planning enforcement notice on garage conversion',
      patterns: ['enforcement', 'EN/2024/0192', 'garage conversion', 'unauthorised'],
    },
    {
      label: 'Undisclosed adult occupier Eleanor Whitfield (partner)',
      patterns: ['eleanor whitfield', 'partner', 'occupier', 'vacant possession'],
    },
    {
      label: 'Drainage discrepancy: TA6 mains vs CON29DW private septic',
      patterns: ['drainage', 'discrepancy', 'septic', 'private', 'mains'],
    },
    {
      label: 'Nationwide mortgage redemption noted but not escalated',
      patterns: ['nationwide', 'redemption', 'discharge', 'DS1'],
    },
  ],
};

// Adversarial scenarios — phrases that, if found IN A HIGH-SEVERITY BLOCK
// (CRITICAL / HIGH risk, or P1 enquiry), indicate over-flagging of items
// that should be informational at most. A hit here = calibration failure.
const ADVERSARIAL_ANTIPATTERNS: Record<string, { label: string; patterns: string[] }[]> = {
  'freehold-house-edge-cases': [
    {
      label: 'Halifax charge mis-flagged as critical (already redeemed)',
      patterns: ['halifax', 'redemption', 'DS1'],
    },
    {
      label: '2019 boundary dispute mis-flagged as current (resolved 2020)',
      patterns: ['boundary dispute', '2019'],
    },
    {
      label: 'Conservation area mis-treated as binding (covers neighbour, not subject)',
      patterns: ['conservation area'],
    },
    {
      label: '1923 covenant mis-flagged as critical (likely unenforceable)',
      patterns: ['1923', 'private dwellinghouse'],
    },
    {
      label: 'Standard £55 surface water charge mis-flagged as material',
      patterns: ['surface water drainage charge', '£55'],
    },
    {
      label: 'Wilmslow Common proximity mis-flagged as a constraint',
      patterns: ['common land', 'wilmslow common'],
    },
  ],
  'freehold-enforcement-and-undisclosed-occupier': [
    {
      label: 'Nationwide mortgage redemption mis-flagged as critical (routine)',
      patterns: ['nationwide', 'redemption'],
    },
    {
      label: 'Permitted-development summer house mis-flagged as material',
      patterns: ['summer house', 'permitted development'],
    },
    {
      label: 'FENSA / NICEIC handover mis-flagged as critical (routine)',
      patterns: ['FENSA', 'NICEIC', 'electrical installation certificate'],
    },
    {
      label:
        'Permission 21/03847/F mis-flagged as a separate critical risk (the issue is the enforcement, not the permission)',
      patterns: ['21/03847/F', 'rear extension'],
    },
  ],
};

// Severity-calibration checks: how many times is "critical" used?
function countOccurrences(text: string, needle: string): number {
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return (text.toLowerCase().match(new RegExp(escaped.toLowerCase(), 'g')) ?? []).length;
}

async function main() {
  const file = process.argv[2];
  const scenario = process.argv[3];
  if (!file || !scenario) {
    console.error('Usage: score <bench-output-file> <scenario-name>');
    process.exit(1);
  }
  const checks = SIGNALS[scenario];
  if (!checks) {
    console.error(`Unknown scenario "${scenario}". Available: ${Object.keys(SIGNALS).join(', ')}`);
    process.exit(1);
  }
  const content = await readFile(file, 'utf8');

  console.log(`\nScoring ${file} against scenario "${scenario}"`);
  console.log('═══════════════════════════════════════════════════════\n');

  let hits = 0;
  for (const check of checks) {
    const lower = content.toLowerCase();
    const found = check.patterns.some((p) => lower.includes(p.toLowerCase()));
    if (found) hits += 1;
    console.log(`  ${found ? '✓' : '✗'}  ${check.label}`);
  }

  console.log('');
  console.log(
    `Hit rate: ${hits} / ${checks.length} (${Math.round((hits / checks.length) * 100)}%)`,
  );

  // Severity calibration
  const critical = countOccurrences(content, '[CRITICAL]');
  const high = countOccurrences(content, '[HIGH]');
  const medium = countOccurrences(content, '[MEDIUM]');
  const low = countOccurrences(content, '[LOW]');
  const info = countOccurrences(content, '[INFORMATIONAL]');
  const p1 = countOccurrences(content, '[P1 ');
  const p2 = countOccurrences(content, '[P2 ');
  const p3 = countOccurrences(content, '[P3 ');
  const p4 = countOccurrences(content, '[P4 ');
  const p5 = countOccurrences(content, '[P5 ');

  console.log('');
  console.log(
    `Risk severity distribution: CRITICAL=${critical} HIGH=${high} MEDIUM=${medium} LOW=${low} INFO=${info}`,
  );
  console.log(`Enquiry priorities: P1=${p1} P2=${p2} P3=${p3} P4=${p4} P5=${p5}`);

  // Surface counts
  const risksMatch = content.match(/→ (\d+) risks/);
  const enquiriesMatch = content.match(/→ (\d+) enquiries/);
  const sectionsMatch = content.match(/Report with (\d+) sections/);
  if (risksMatch || enquiriesMatch || sectionsMatch) {
    console.log('');
    console.log(
      `Counts: risks=${risksMatch?.[1] ?? '?'} enquiries=${enquiriesMatch?.[1] ?? '?'} report-sections=${sectionsMatch?.[1] ?? '?'}`,
    );
  }

  // Issue-code routing check: assert the pipeline tags seeded issues
  // with the right ConveyancingIssueCode and does not invent codes for
  // issues that were not seeded.
  const expectedCodes = EXPECTED_ISSUE_CODES[scenario];
  if (expectedCodes) {
    console.log('');
    console.log('Issue-code routing (taxonomy assertions):');
    const emittedCodes = extractEmittedIssueCodes(content);
    const hit = new Set<ConveyancingIssueCode>();
    for (const code of expectedCodes) {
      if (emittedCodes.has(code)) hit.add(code);
      console.log(`  ${emittedCodes.has(code) ? '✓' : '✗'}  expected ${code}`);
    }
    const unexpected = [...emittedCodes].filter(
      (c) => !expectedCodes.includes(c as ConveyancingIssueCode),
    );
    for (const code of unexpected) {
      console.log(`  ?  unexpected ${code} - investigate (may indicate over-flagging)`);
    }
    console.log('');
    console.log(
      `Code hit rate: ${hit.size} / ${expectedCodes.length} (${Math.round(
        (hit.size / expectedCodes.length) * 100,
      )}%). Unexpected codes: ${unexpected.length}.`,
    );
  }

  // Adversarial over-flagging check — only fires on adversarial scenarios.
  const adversarial = ADVERSARIAL_ANTIPATTERNS[scenario];
  if (adversarial) {
    console.log('');
    console.log('Severity-calibration check (over-flagging routine items as CRITICAL/HIGH/P1):');
    const highSeverityBlocks = extractBlocksAroundSeverityMarkers(content);
    const allHighSeverityText = highSeverityBlocks.join('\n').toLowerCase();
    let overFlagged = 0;
    for (const check of adversarial) {
      const found = check.patterns.some((p) => allHighSeverityText.includes(p.toLowerCase()));
      console.log(`  ${found ? '✗ OVER-FLAGGED' : '✓ correctly low-severity'}  ${check.label}`);
      if (found) overFlagged += 1;
    }
    console.log('');
    console.log(
      `Over-flagging count: ${overFlagged} / ${adversarial.length}  (lower is better; 0 is target)`,
    );
  }
}

/** Collect every issue code emitted in the bench output (lines like "[CODE: XXX]"). */
function extractEmittedIssueCodes(content: string): Set<string> {
  const codes = new Set<string>();
  const re = /\[CODE:\s*([A-Z_]+)\]/g;
  let match: RegExpExecArray | null = re.exec(content);
  while (match !== null) {
    if (match[1]) codes.add(match[1]);
    match = re.exec(content);
  }
  return codes;
}

/** Pull text from CRITICAL/HIGH risk blocks and P1 enquiry blocks. */
function extractBlocksAroundSeverityMarkers(content: string): string[] {
  const blocks: string[] = [];
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? '';
    if (/^\[(CRITICAL|HIGH)\]/.test(line) || /^\[P1 /.test(line)) {
      // Take the marker line and the next 6 lines (title, description, citations).
      blocks.push(lines.slice(i, i + 7).join('\n'));
    }
  }
  return blocks;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
