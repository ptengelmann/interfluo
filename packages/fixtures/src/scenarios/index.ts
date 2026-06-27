import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { scenarios } from './registry';

export interface GeneratedFile {
  filename: string;
  buffer: Buffer;
}

export interface ScenarioBundle {
  name: string;
  description: string;
  expectedFindings: string[];
  files: GeneratedFile[];
}

export type Scenario = () => Promise<ScenarioBundle>;

export async function writeScenario(name: string, outputDir: string): Promise<ScenarioBundle> {
  const builder = scenarios[name];
  if (!builder) {
    throw new Error(`Unknown scenario "${name}". Available: ${Object.keys(scenarios).join(', ')}`);
  }
  const bundle = await builder();
  const resolved = resolve(outputDir);
  await mkdir(resolved, { recursive: true });

  for (const file of bundle.files) {
    await writeFile(join(resolved, file.filename), file.buffer);
  }

  const expectedMd = buildExpectedFindingsMd(bundle);
  await writeFile(join(resolved, 'EXPECTED-FINDINGS.md'), expectedMd, 'utf8');

  return bundle;
}

function buildExpectedFindingsMd(bundle: ScenarioBundle): string {
  return `# ${bundle.name}

${bundle.description}

## Files in this pack

${bundle.files.map((f) => `- \`${f.filename}\``).join('\n')}

## What a competent conveyancer should raise

These are the issues deliberately planted in this pack. Use this list as the
yard-stick for evaluating Interfluo's output: enquiries that map to these
findings = signal, enquiries about boilerplate = noise.

${bundle.expectedFindings.map((f, i) => `${i + 1}. ${f}`).join('\n')}

---

Run this pack through Interfluo, then compare the generated enquiries and
Report on Title against the list above. Score:

- **Hit** — Interfluo raises an enquiry or risk that addresses this finding.
- **Miss** — the finding does not appear anywhere in the output.
- **Hallucination** — Interfluo flags an issue not supported by the documents.

A hit-rate of 80%+ on this scenario with zero hallucinations is a reasonable
v1 bar.
`;
}
