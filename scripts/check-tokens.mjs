// Fails if src/theme/colors.ts drifts from the --color-* tokens in src/global.css.
// Run with: npm run check:tokens
import { readFileSync } from 'node:fs';

const css = readFileSync('src/global.css', 'utf8');
const ts = readFileSync('src/theme/colors.ts', 'utf8');

const cssColors = new Map(
  [...css.matchAll(/--color-([a-z-]+):\s*([^;]+);/g)].map(([, name, value]) => [
    name,
    value.trim().toLowerCase().replace(/\s+/g, ''),
  ])
);
const tsColors = new Map(
  [...ts.matchAll(/^\s+'?([a-z-]+)'?:\s*'([^']+)',/gm)].map(([, name, value]) => [
    name,
    value.toLowerCase().replace(/\s+/g, ''),
  ])
);

const problems = [];
for (const [name, value] of tsColors) {
  if (!cssColors.has(name)) problems.push(`colors.ts has "${name}" but global.css does not`);
  else if (cssColors.get(name) !== value)
    problems.push(`"${name}": colors.ts ${value} != global.css ${cssColors.get(name)}`);
}
for (const name of cssColors.keys()) {
  if (!tsColors.has(name)) problems.push(`global.css has --color-${name} but colors.ts does not`);
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log(`Token check passed: ${tsColors.size} colors match global.css.`);
