#!/usr/bin/env tsx
import { randomUUID } from 'node:crypto';
import { existsSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config as loadDotenv } from 'dotenv';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '../../../');
for (const filename of ['.env.local', '.env']) {
  const path = resolve(repoRoot, filename);
  if (existsSync(path)) loadDotenv({ path, override: false });
}

import {
  analyseRisks,
  classifyDocument,
  createAiClient,
  extractFacts,
  generateEnquiries,
  generateReportOnTitle,
} from '@interfluo/ai';
import type { Document, Matter, PageContent } from '@interfluo/core';
import { extractPdfContent } from '@interfluo/pdf';

interface ScenarioMeta {
  reference: string;
  propertyAddress: string;
  sellerName: string;
  buyerName: string;
  tenure: 'freehold' | 'leasehold' | 'unknown';
}

const SCENARIO_META: Record<string, ScenarioMeta> = {
  'leasehold-flat-with-issues': {
    reference: 'BENCH-LEASEHOLD-001',
    propertyAddress: 'Flat 3, 24 Wynyard Terrace, London SE17 3JL',
    sellerName: 'Margaret Wells',
    buyerName: 'Anita Patel',
    tenure: 'leasehold',
  },
  'freehold-house-clean': {
    reference: 'BENCH-FREEHOLD-001',
    propertyAddress: '47 Beechwood Avenue, Sheffield S11 9EE',
    sellerName: 'Robert and Susan Clark',
    buyerName: 'David Okafor',
    tenure: 'freehold',
  },
  'freehold-house-edge-cases': {
    reference: 'BENCH-EDGE-001',
    propertyAddress: '49 Beechwood Avenue, Wilmslow, SK9 5RG',
    sellerName: 'Christopher and Sarah Mitchell',
    buyerName: 'Daniel Foster',
    tenure: 'freehold',
  },
  'freehold-enforcement-and-undisclosed-occupier': {
    reference: 'BENCH-ADV-002',
    propertyAddress: '18 Highfield Road, Bristol BS6 7TG',
    sellerName: 'Marcus Greene',
    buyerName: 'Aisha Rahman',
    tenure: 'freehold',
  },
};

async function main() {
  const scenarioName = process.argv[2] ?? 'leasehold-flat-with-issues';
  const dir = resolve(process.argv[3] ?? `./.data/fixtures/${scenarioName}`);
  const meta = SCENARIO_META[scenarioName];
  if (!meta) {
    throw new Error(`No scenario meta for ${scenarioName}`);
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY required (set in .env.local at repo root)');

  const ai = createAiClient({
    apiKey,
    defaultModel: process.env.ANTHROPIC_DEFAULT_MODEL ?? 'claude-sonnet-4-6',
  });

  const matter: Matter = {
    id: 'mat_bench',
    firmId: 'firm_bench',
    reference: meta.reference,
    propertyAddress: meta.propertyAddress,
    buyerName: meta.buyerName,
    sellerName: meta.sellerName,
    tenure: meta.tenure,
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const files = (await readdir(dir)).filter((f) => f.endsWith('.pdf')).sort();
  log(`Scenario: ${scenarioName}`);
  log(`PDFs found: ${files.length}`);

  log('\nClassifying + extracting in parallel…');
  const startIngest = Date.now();
  const results = await Promise.all(
    files.map(async (filename) => {
      const buffer = await readFile(join(dir, filename));
      const extraction = await extractPdfContent(buffer);
      const pages: PageContent[] = extraction.pages.map((p) => ({
        pageNumber: p.pageNumber,
        text: p.text,
        width: p.width,
        height: p.height,
      }));
      const classification = await classifyDocument(ai, pages);
      const doc: Document = {
        id: `doc_${randomUUID()}`,
        matterId: matter.id,
        filename,
        documentType: classification.documentType,
        classificationConfidence: classification.confidence,
        pageCount: extraction.pageCount,
        sizeBytes: buffer.length,
        uploadedAt: new Date().toISOString(),
        storageKey: filename,
        extractionMethod: 'text',
      };
      const facts = await extractFacts(ai, doc, pages);
      return { document: doc, pages, facts };
    }),
  );
  log(`  ingest+extract done in ${((Date.now() - startIngest) / 1000).toFixed(1)}s\n`);

  const allFacts: Awaited<ReturnType<typeof extractFacts>> = [];
  for (const r of results) {
    log(
      `  ${r.document.filename.padEnd(40)} ${r.document.documentType.padEnd(28)} (${(r.document.classificationConfidence * 100).toFixed(0)}%) → ${r.facts.length} facts`,
    );
    allFacts.push(...r.facts);
  }

  log(`\nTotal facts: ${allFacts.length}`);

  log('\nAnalysing risks…');
  const tRisk = Date.now();
  const risks = await analyseRisks(ai, matter.id, matter.propertyAddress, allFacts);
  log(`  → ${risks.length} risks (${((Date.now() - tRisk) / 1000).toFixed(1)}s)`);

  log('\nDrafting enquiries…');
  const tEnq = Date.now();
  const enquiries = await generateEnquiries(ai, matter.id, matter.propertyAddress, allFacts, risks);
  log(`  → ${enquiries.length} enquiries (${((Date.now() - tEnq) / 1000).toFixed(1)}s)`);

  log('\nWriting Report on Title…');
  const tRep = Date.now();
  const report = await generateReportOnTitle(
    ai,
    matter.id,
    matter.propertyAddress,
    matter.buyerName,
    allFacts,
    risks,
    enquiries,
  );
  log(
    `  → Report with ${report.sections.length} sections (${((Date.now() - tRep) / 1000).toFixed(1)}s)`,
  );

  log('\n\n========== RISKS ==========\n');
  for (const r of risks) {
    log(`[${r.severity.toUpperCase()}] ${r.title}`);
    log(`  ${r.description}`);
    if (r.issueCode) log(`  [CODE: ${r.issueCode}]`);
    log(
      `  Cites: ${r.citations.map((c) => `${shorten(c.documentName)} ${c.pageNumbers.map((p) => `p${p}`).join(',')}`).join(' · ') || '(none)'}\n`,
    );
  }

  log('\n========== ENQUIRIES ==========\n');
  for (const e of enquiries) {
    log(`[P${e.priority} · ${e.category}] ${e.question}`);
    log(`  Why: ${e.rationale}`);
    if (e.issueCode) log(`  [CODE: ${e.issueCode}]`);
    log(
      `  Cites: ${e.citations.map((c) => `${shorten(c.documentName)} ${c.pageNumbers.map((p) => `p${p}`).join(',')}`).join(' · ') || '(none)'}\n`,
    );
  }

  log('\n========== REPORT ON TITLE ==========\n');
  log(`SUMMARY: ${report.summary}\n`);
  for (const s of report.sections) {
    log(`\n## ${s.heading}\n`);
    log(s.body);
    log(
      `\nCites: ${s.citations.map((c) => `${shorten(c.documentName)} ${c.pageNumbers.map((p) => `p${p}`).join(',')}`).join(' · ') || '(none)'}`,
    );
  }
}

function shorten(name: string): string {
  return name.replace(/\.pdf$/i, '').replace(/^\d+-/, '');
}

function log(msg: string) {
  console.log(msg);
}

main().catch((err) => {
  console.error('Bench failed:', err);
  process.exit(1);
});
