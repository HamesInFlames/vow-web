// Greps the built HTML for banned copy and legacy liabilities (plan §6 checks). Exit 1 on any hit.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const BANNED = [
  // AI-slop copy (vault design report §1c; AGENTS.md)
  /\bunlock\w*/i, /\belevat\w*/i, /\bseamless\w*/i, /\bempower\w*/i, /\beffortless\w*/i, /\bleverag\w*/i,
  /\bstreamlin\w*/i, /\bjourney\b/i, /\brobust\b/i, /\bcutting-edge\b/i, /\bnext-level\b/i, /\bgame-changer\b/i,
  /\bdelve\b/i, /\bunleash\w*/i, /look no further/i, /it'?s not just/i, /in today'?s fast-paced/i,
  // Client rules (vault 20-decisions.md)
  /\bOMVIC\b/i, /dealer(s)? act/i, /new owner/i, /owner changed/i,
  // Legacy liabilities from the old site (audit)
  /Islington/i, /Woodbridge/i, /free delivery/i, /free warranty/i, /\$0 USD/i, /sale ends/i,
  /Toronto'?s largest/i, /voted best/i, /Grand River/i, /\bSIN\b/, /social insurance/i, /date of birth/i,
  // The current VOW site's dealer-template leftovers and unsourced claims (docs/site-capture, plan V14)
  /hold with deposit/i, /\bbuy now\b/i, /4\.3\s*\/\s*5/, /thousands of happy/i, /100 years/i, /\bdealership\b/i,
  // Prices (AGENTS.md): "From $X + HST" or "Quote after inspection", never these
  /call for price/i, /contact for price/i,
  // VOW Phase 4: the consignment flyer's claims, and dealer wording before VOW's OMVIC status is known (vault 95)
  /AI-powered/i, /AI-optimi[sz]ed/i, /smart-insured/i, /\bpredictive\b/i, /zero upfront/i, /curbsid/i,
  /licensed dealer/i, /registered dealer/i, /\bbrokerage\b/i,
];

// "No upfront cost" is only honest beside what does come out of the sale (vault 95 §3): any page that says it must
// also render the cost sentence from src/data/consign.json.
const COST_SENTENCE = JSON.parse(readFileSync('src/data/consign.json', 'utf8')).costSentence;
const NO_UPFRONT = /no up-?front cost/i;

// Exact phrases where a banned word is used correctly: promises NOT to collect sensitive data.
// Removed before scanning; anything else still fails.
const ALLOWED = [
  /never ask for your SIN, date of birth or banking details/g,
  /never ask for your social insurance number, date of birth, driver(’|')s licence or banking details/g,
];

const files = [];
const walk = (dir) => {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.html')) files.push(p);
  }
};
walk('dist');

let hits = 0;
for (const file of files) {
  // Visible text and attribute values only; drop scripts/styles so library code can't trip the list.
  const html = readFileSync(file, 'utf8')
    // Keep JSON-LD (structured data is public copy too); drop other scripts so library code can't trip the list.
    .replace(/<script(?![^>]*application\/ld\+json)[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(new RegExp(ALLOWED.map((r) => r.source).join('|'), 'g'), '');
  if (NO_UPFRONT.test(html) && !html.replaceAll('&#39;', "'").includes(COST_SENTENCE.replace(/^No upfront cost\. /, ''))) {
    hits++;
    console.log(`${file}: says "no upfront cost" without the cost sentence beside it`);
  }
  for (const re of BANNED) {
    const m = html.match(re);
    if (m) {
      hits++;
      const i = m.index ?? 0;
      console.log(`${file}: "${m[0]}" … ${html.slice(Math.max(0, i - 60), i + 60).replace(/\s+/g, ' ')}`);
    }
  }
}
console.log(`${files.length} page(s) checked, ${hits} hit(s).`);
process.exit(hits ? 1 : 0);
