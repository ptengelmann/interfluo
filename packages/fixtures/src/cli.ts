#!/usr/bin/env tsx
import { resolve } from 'node:path';
import { writeScenario } from './scenarios';
import { scenarios } from './scenarios/registry';

function printUsage(): void {
  console.log('Usage: pnpm --filter @interfluo/fixtures generate <scenario> [output-dir]');
  console.log('');
  console.log('Scenarios:');
  for (const name of Object.keys(scenarios)) {
    console.log(`  - ${name}`);
  }
  console.log('');
  console.log('Default output-dir is ./.data/fixtures/<scenario>');
}

async function main(): Promise<void> {
  const [, , name, dir] = process.argv;

  if (!name || name === '--help' || name === '-h') {
    printUsage();
    process.exit(name ? 0 : 1);
  }

  if (!scenarios[name]) {
    console.error(`Unknown scenario: ${name}\n`);
    printUsage();
    process.exit(1);
  }

  const outputDir = resolve(dir ?? `./.data/fixtures/${name}`);

  console.log(`Generating "${name}" scenario into ${outputDir}…`);
  const bundle = await writeScenario(name, outputDir);

  console.log(`✓ Wrote ${bundle.files.length} PDFs:`);
  for (const f of bundle.files) {
    console.log(`    ${f.filename}  (${(f.buffer.length / 1024).toFixed(1)} KB)`);
  }
  console.log(`✓ Wrote EXPECTED-FINDINGS.md — the yard-stick for evaluating output.`);
  console.log('');
  console.log('Next: drop these PDFs into a new matter in Interfluo and compare the');
  console.log('generated enquiries / risks against the expected findings.');
}

main().catch((err) => {
  console.error('Generation failed:', err);
  process.exit(1);
});
