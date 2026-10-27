// Builds docs/site-copy.md: every piece of text on the portfolio, grouped by page, each tagged with its source.
import { createRequire } from 'node:module';
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd(); // run from the project root: node scripts/site-copy.mts
const require = createRequire(join(ROOT, 'package.json'));
const ts = require('typescript');
const C = (f: string) => import(join(ROOT, 'src/content', f + '.ts'));
const about = await C('about'), archive = await C('archive'), cases = await C('case-studies'), play = await C('playground'), proj = await C('projects');

const out: string[] = [];
const h = (n: number, t: string) => out.push('', '#'.repeat(n) + ' ' + t, '');
const src = (s: string) => out.push(`<sub>source: \`${s}\`</sub>`, '');
const para = (t: string) => out.push(t, '');
const code = (t: string) => out.push('```', t, '```', '');
const isCode = (s: string) => s.includes('\n') && /[;{}=()]|^\s*(--|#|\/\/|\/\*|\*)/m.test(s);
const SKIP = new Set(['slug', 'brand', 'logo', 'visual', 'live', 'width', 'height', 'focus', 'phone', 'src', 'href', 'draft', 'kind']);
const label = (k: string) => k.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase());

function render(v: any, depth = 0): void {
  if (v == null || typeof v === 'boolean' || typeof v === 'number' || typeof v === 'function') return;
  if (typeof v === 'string') { isCode(v) ? code(v) : para(v); return; }
  if (Array.isArray(v)) {
    if (v.every(x => typeof x === 'string')) { v.some(x => x.length > 60) ? v.forEach(x => para(x)) : para(v.join(' · ')); return; }
    v.forEach((x, i) => { out.push(`**${i + 1}.**`, ''); render(x, depth + 1); });
    return;
  }
  for (const [k, x] of Object.entries(v)) {
    if (SKIP.has(k)) continue;
    if (x == null || typeof x === 'boolean' || typeof x === 'number') continue;
    if (typeof x === 'string' && !isCode(x)) { out.push(`**${label(k)}:** ${x}`, ''); continue; }
    out.push(`**${label(k)}**`, ''); render(x, depth + 1);
  }
}

/* ---------- text written directly in pages and components ---------- */
const TEXT_ATTRS = new Set(['aria-label', 'placeholder', 'title', 'alt', 'data-cursor']);
const KEYS = new Set(['Escape', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'Shift']);
const isNoise = (s: string) => { const t = s.trim();
  return KEYS.has(t) || /^[.\/]/.test(t) || /\.(woff2?|png|jpe?g|svg|webp|tsx?|css)$/.test(t) || /(^\(|polygon\(|inset\(|var\(|calc\(|rgba?\(|url\()/.test(t)
    || /[\[\]*]|\s>\s|^>/.test(t) || /^[a-z]+\.[a-z]+[A-Za-z]*$/i.test(t) && /(in|out|inOut|none)$/i.test(t) || /[+-]=/.test(t) || /^#[0-9a-f]{3,8}$/i.test(t)
    || /^(top|bottom|left|right|center)( |$)/.test(t) || /^\d/.test(t) && /(px|%|deg|s|vh|vw)\b/.test(t) || /^(mouse|touch|pen|ok|none|auto)$/.test(t) || /^[a-z]+-[a-z-]+$/.test(t) || /^https?:/.test(t) || /^(min|max|clamp)\(/.test(t) || /\.(out|in|inOut)\(/.test(t) || /^three(\/|$)/.test(t) || /^(use client)$/.test(t); };
const looksLikeCopy = (s: string) => /[A-Za-z]/.test(s) && (/\s/.test(s.trim()) || /^[A-Z]/.test(s.trim()) || /[.?!↗→]/.test(s)) && !/(^|\s)(md|lg|sm|max-md|hover|group|aria|data)[:-\[]|\b(px|py|pt|pb|gap|grid|flex|text|bg|border|rounded|font|leading|tracking|size|w|h|mt|mb|ml|mr)-/.test(s) && !/^[a-z0-9_./-]+$/.test(s.trim()) && !/^(use client|use server)$/.test(s.trim());
function jsxText(file: string) {
  const text = readFileSync(file, 'utf8');
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const found: [number, string][] = [];
  const line = (n: any) => sf.getLineAndCharacterOfPosition(n.getStart()).line + 1;
  const visit = (n: any) => {
    if (n.kind === ts.SyntaxKind.JsxText) { const t = n.getText().replace(/\s+/g, ' ').trim(); if (t && /[A-Za-z]/.test(t)) found.push([line(n), t]); }
    else if (n.kind === ts.SyntaxKind.JsxAttribute) {
      const name = n.name.getText();
      if (TEXT_ATTRS.has(name) && n.initializer && n.initializer.kind === ts.SyntaxKind.StringLiteral) found.push([line(n), `${name}: ${n.initializer.text}`]);
      if (name === 'className' || name === 'style' || name === 'd' || name === 'viewBox') return;
    } else if ((n.kind === ts.SyntaxKind.StringLiteral || n.kind === ts.SyntaxKind.NoSubstitutionTemplateLiteral) && !ts.isImportDeclaration(n.parent) && !(n.parent && n.parent.kind === ts.SyntaxKind.JsxAttribute)) {
      const t = n.text; const p = n.parent;
      const inCall = p && ts.isCallExpression(p) && /querySelector|getElementById|getItem|setItem|addEventListener|removeEventListener|matchMedia|use|getPropertyValue|toArray|classList|setAttribute|getAttribute|closest/.test(p.expression.getText());
      const isKey = p && ts.isPropertyAssignment(p) && p.name === n;
      let v = n.parent, inConstList = false;
      while (v) { if (ts.isVariableDeclaration(v)) { inConstList = /^[A-Z][A-Z0-9_]+$/.test(v.name.getText()); break; } v = v.parent; }
      const copyish = looksLikeCopy(t) || (inConstList && /^[a-z][a-z0-9 /.:-]*$/i.test(t.trim()) && t.trim().length > 1);
      if (!inCall && !isKey && copyish && !isNoise(t) && t.length < 400) found.push([line(n), t.replace(/\s+/g, ' ')]);
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
  return found;
}
const walk = (d: string): string[] => readdirSync(d).flatMap(f => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : p.endsWith('.tsx') ? [p] : []; });
const files = [...walk(join(ROOT, 'src/app')), ...walk(join(ROOT, 'src/components'))];
const jsx = new Map(files.map(f => [relative(ROOT, f), jsxText(f)]).filter(([, t]) => (t as any[]).length) as [string, [number, string][]][]);
const listFile = (f: string) => { const t = jsx.get(f); if (!t) return; out.push(`**\`${f}\`**`, ''); t.forEach(([l, s]) => out.push(`- L${l}: ${s}`)); out.push(''); jsx.delete(f); };

/* ---------- the document ---------- */
out.push('# Portfolio copy: every piece of text on the site', '',
  `Generated from the code on ${new Date().toISOString().slice(0, 10)}. Edit any text in place, keep the \`source\` tags and the \`Lnn:\` line numbers as they are, and send the file back (or point me at it); I apply each change to the file it came from.`, '',
  'It is set out by page: 1 every page (header, menu, footer, 404), 2 home, 3 projects, 4 case studies, 5 about, 6 archive, 7 playground, 8 small UI text left over. Text from the content files (\`src/content/*.ts\`) appears as labelled fields under a `source` tag; text written straight into a page or component appears as `- Lnn:` lines under its file name. Lines starting `aria-label:` are read out by screen readers, and `data-cursor:` is the word on the red cursor disc. Code excerpts in the case studies are real code comments from the projects; change them only if you want the excerpt itself different.');

h(2, 'Part 1 · Every page');
listFile('src/app/layout.tsx'); listFile('src/components/site-header.tsx'); listFile('src/components/site-menu.tsx');
listFile('src/components/site-footer.tsx'); listFile('src/components/footer/copy-email.tsx'); listFile('src/components/footer/ascii-talk.tsx');
listFile('src/app/not-found.tsx'); listFile('src/components/missing-path.tsx');

h(2, 'Part 2 · Home');
h(3, 'Boot preloader, hero, stack marquee'); listFile('src/components/home/boot-preloader.tsx'); listFile('src/components/home/hero.tsx'); listFile('src/components/home/stack-marquee.tsx');
h(3, 'Featured Projects (text comes from the projects, Part 3)'); listFile('src/components/home/featured-projects.tsx');
h(3, 'About section'); src('src/content/about.ts → TEASER_HEADING, SUMMARY');
out.push(`**Heading:** ${about.TEASER_HEADING.join(' / ')}`, '', `**Text:** ${about.SUMMARY}`, '', '*Results and method below come from the About page (Part 5).*', '');
listFile('src/components/home/about-teaser.tsx'); listFile('src/app/page.tsx');

h(2, 'Part 3 · Projects (home rows, /work, case-study headers)');
src('src/content/projects.ts → FEATURED_PROJECTS, PAUSED_PROJECTS');
for (const p of [...proj.FEATURED_PROJECTS, ...proj.PAUSED_PROJECTS.map((x: any) => ({ ...x, name: x.name + ' (paused, not on the site)' }))]) {
  h(3, p.name);
  for (const k of ['summary', 'tagline', 'status', 'sector', 'role', 'year', 'wordmark']) if (p[k]) out.push(`**${label(k)}:** ${p[k]}`, '');
  out.push(`**Stack:** ${p.stack.join(' · ')}`, '');
  if (p.screens.length) { out.push('**Screens** (alt text · caption)', ''); p.screens.forEach((s: any, i: number) => out.push(`${i + 1}. ${s.alt} · *${s.caption}*`)); out.push(''); }
}
listFile('src/app/work/page.tsx'); listFile('src/components/work/work-index.tsx');

h(2, 'Part 4 · Case studies');
src('src/content/case-studies.ts → CASE_STUDIES');
for (const [slug, cs] of Object.entries(cases.CASE_STUDIES as Record<string, any>)) { h(3, (proj.FEATURED_PROJECTS.find((p: any) => p.slug === slug)?.name ?? slug) + (cs.draft ? ' (marked draft)' : '')); render(cs); }
for (const f of [...jsx.keys()].filter(f => f.includes('/case/') || f.includes('work/[slug]'))) listFile(f);

h(2, 'Part 5 · About page');
src('src/content/about.ts → INTRO, TRACK_RECORD, HOW_I_WORK, CV');
out.push(`**Intro:** ${about.INTRO}`, '');
h(3, 'Track record'); about.TRACK_RECORD.forEach((m: any, i: number) => { out.push(`**${i + 1}. ${m.mark} · ${m.label}${m.current ? ' (current)' : ''}**`, '', `**Title:** ${m.title}`, '', `**Text:** ${m.body}`, ''); });
h(3, 'How I work'); about.HOW_I_WORK.forEach((s: any, i: number) => out.push(`${i + 1}. **${s.step}:** ${s.body}`)); out.push('');
out.push(`**CV download:** ${about.CV ? about.CV.label : 'hidden until a copy without the phone number is ready'}`, '');
for (const f of [...jsx.keys()].filter(f => f.includes('/about'))) listFile(f);

h(2, 'Part 6 · Archive');
src('src/content/archive.ts → ARCHIVE, ARCHIVE_KINDS');
out.push(`**Filters:** ${archive.ARCHIVE_KINDS.join(' · ')}`, '');
archive.ARCHIVE.forEach((a: any, i: number) => out.push(`${i + 1}. **${a.name}** (${a.kind}, ${a.year}, ${a.stack.join(' · ')}): ${a.line}`)); out.push('');
for (const f of [...jsx.keys()].filter(f => f.includes('/archive'))) listFile(f);

h(2, 'Part 7 · Playground');
src('src/content/playground.ts → README, SCHEMA');
out.push('**README.md window**', ''); code(play.README); out.push('**schema.sql window**', ''); code(play.SCHEMA);
for (const f of [...jsx.keys()].filter(f => f.includes('/playground'))) listFile(f);

h(2, 'Part 8 · Other text in components');
para('Labels, accessibility text and small UI words not covered above.');
for (const f of [...jsx.keys()].sort()) listFile(f);

writeFileSync(join(ROOT, 'docs/site-copy.md'), out.join('\n').replace(/\n{3,}/g, '\n\n') + '\n');
console.log('lines', out.length);
