#!/usr/bin/env node
// Fetches OG images for a list of URLs, falls back to Playwright screenshot.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OG_DIR = path.join(ROOT, 'public/og');
fs.mkdirSync(OG_DIR, { recursive: true });

const URLS = [
  { key: 'openngo',     url: 'https://open-ngo.vercel.app' },
  { key: 'mymp',        url: 'https://mymp.org.my' },
  { key: 'sedekah',     url: 'https://sedekah.je' },
  { key: 'pasarmalam',  url: 'https://pasarmalam.app' },
  { key: 'datagov',     url: 'https://data.gov.my' },
];

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
};

function extractOgImage(html, baseUrl) {
  const og = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
           || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)
           || html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i)
           || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i);
  if (!og) return null;
  try { return new URL(og[1], baseUrl).href; } catch { return og[1]; }
}

async function downloadImage(imageUrl, destPath) {
  const res = await fetch(imageUrl, { headers: HEADERS });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const ct = res.headers.get('content-type') || '';
  if (!ct.startsWith('image/')) throw new Error(`Not an image: ${ct}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(destPath, buf);
  return destPath;
}

async function screenshotWithPlaywright(url, destPath) {
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 }).catch(() =>
      page.goto(url, { waitUntil: 'load', timeout: 15000 })
    );
    await page.waitForTimeout(2000);
    await page.screenshot({ path: destPath, type: 'png' });
    console.log(`  ✓ Screenshot saved`);
  } finally {
    await browser.close();
  }
}

for (const { key, url } of URLS) {
  console.log(`\nProcessing ${key} (${url})...`);
  try {
    const res = await fetch(url, { headers: HEADERS });
    const html = await res.text();
    const finalUrl = res.url || url;
    const ogUrl = extractOgImage(html, finalUrl);

    if (ogUrl) {
      console.log(`  OG image: ${ogUrl}`);
      const ext = ogUrl.match(/\.(png|jpe?g|webp|gif)/i)?.[1] ?? 'png';
      const dest = path.join(OG_DIR, `${key}.${ext === 'jpeg' ? 'jpg' : ext}`);
      await downloadImage(ogUrl, dest);
      console.log(`  ✓ Saved as public/og/${path.basename(dest)}`);
    } else {
      console.log(`  No OG image found, taking Playwright screenshot...`);
      const dest = path.join(OG_DIR, `${key}.png`);
      await screenshotWithPlaywright(url, dest);
    }
  } catch (err) {
    console.log(`  ✗ Failed: ${err.message}`);
    // Try screenshot as final fallback
    try {
      console.log(`  Trying Playwright screenshot as fallback...`);
      const dest = path.join(OG_DIR, `${key}.png`);
      await screenshotWithPlaywright(url, dest);
    } catch (e2) {
      console.log(`  ✗ Screenshot also failed: ${e2.message}`);
    }
  }
}

console.log('\nDone.');
