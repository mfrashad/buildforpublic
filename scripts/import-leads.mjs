#!/usr/bin/env node
// Transform the openngo leads CSV into Convex bulk-import JSONL for the
// `nonprofitLeads` catalog table.
//
// Usage (run from the buildforpublic repo root):
//   node scripts/import-leads.mjs
//   npx convex import --table nonprofitLeads --replace nonprofitLeads.jsonl
//
// `--replace` refreshes the whole catalog. This is safe because outreach state
// lives in the separate `nonprofitOutreach` table (keyed by leadKey), so a
// re-import never touches outreach progress.
//
// Source CSV header (../openngo/data/leads.csv):
//   name,founded_year,website_status,listed_website,location,instagram,
//   facebook,twitter,youtube,linkedin,tiktok,n_socials,has_instagram,
//   sources,profile_urls

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CSV_PATH = resolve(__dirname, "../../openngo/data/leads.csv");
const OUT_PATH = resolve(__dirname, "../nonprofitLeads.jsonl");

// Minimal RFC-4180 CSV parser (handles quoted fields, embedded commas, quotes).
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.length > 1 || row[0] !== "") rows.push(row);
      row = [];
    } else {
      field += c;
    }
  }
  if (field !== "" || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

const text = readFileSync(CSV_PATH, "utf8");
const rows = parseCsv(text);
const header = rows[0];
const col = (name) => header.indexOf(name);

const idx = {
  name: col("name"),
  websiteStatus: col("website_status"),
  listedWebsite: col("listed_website"),
  location: col("location"),
  instagram: col("instagram"),
  facebook: col("facebook"),
  twitter: col("twitter"),
  youtube: col("youtube"),
  linkedin: col("linkedin"),
  tiktok: col("tiktok"),
  nSocials: col("n_socials"),
  sources: col("sources"),
  profileUrls: col("profile_urls"),
};

const importedAt = Date.now();
const clean = (s) => (s && s.trim() ? s.trim() : undefined);

const seen = new Set();
const out = [];
let skipped = 0;

for (const row of rows.slice(1)) {
  const name = clean(row[idx.name]);
  if (!name) {
    skipped++;
    continue;
  }
  const profileUrls = clean(row[idx.profileUrls]);
  const instagram = clean(row[idx.instagram]);
  // Stable dedupe key: first source profile URL > instagram > name.
  const leadKey = (profileUrls?.split("|")[0] || instagram || name).trim();
  if (seen.has(leadKey)) {
    skipped++;
    continue;
  }
  seen.add(leadKey);

  const nSocialsRaw = clean(row[idx.nSocials]);
  const nSocials = nSocialsRaw ? Number(nSocialsRaw) : undefined;

  // Drop undefined fields so Convex doesn't try to store them.
  const doc = {
    leadKey,
    name,
    websiteStatus: clean(row[idx.websiteStatus]),
    listedWebsite: clean(row[idx.listedWebsite]),
    location: clean(row[idx.location]),
    instagram,
    facebook: clean(row[idx.facebook]),
    twitter: clean(row[idx.twitter]),
    linkedin: clean(row[idx.linkedin]),
    tiktok: clean(row[idx.tiktok]),
    youtube: clean(row[idx.youtube]),
    nSocials: Number.isFinite(nSocials) ? nSocials : undefined,
    sources: clean(row[idx.sources]),
    importedAt,
  };
  for (const k of Object.keys(doc)) if (doc[k] === undefined) delete doc[k];
  out.push(JSON.stringify(doc));
}

writeFileSync(OUT_PATH, out.join("\n") + "\n");
console.log(`Wrote ${out.length} leads to ${OUT_PATH} (${skipped} skipped).`);
console.log(
  "Next: npx convex import --table nonprofitLeads --replace nonprofitLeads.jsonl",
);
