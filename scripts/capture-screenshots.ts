import { chromium } from "playwright";
import * as path from "path";
import * as fs from "fs";

const OUTPUT_DIR = path.resolve(__dirname, "../public/sprites/projects");

const sites = [
  { url: "https://mymp.org.my", filename: "mymp.png" },
  { url: "https://sedekah.je", filename: "sedekah.png" },
  { url: "https://lepakmasjid.app", filename: "lepakmasjid.png" },
  { url: "https://pasarmalam.app", filename: "pasarmalam.png" },
];

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });

  for (const site of sites) {
    const page = await context.newPage();
    const dest = path.join(OUTPUT_DIR, site.filename);

    console.log(`Capturing ${site.url} ...`);

    try {
      // Try networkidle first, fall back to load
      try {
        await page.goto(site.url, { waitUntil: "networkidle", timeout: 30_000 });
      } catch {
        console.log(`  networkidle timed out, retrying with load...`);
        await page.goto(site.url, { waitUntil: "load", timeout: 15_000 });
      }

      // Extra wait for any remaining renders / animations
      await page.waitForTimeout(2000);

      await page.screenshot({ path: dest, type: "png" });
      console.log(`  Saved -> ${dest}`);
    } catch (err: any) {
      console.error(`  Failed: ${err.message?.slice(0, 120)}`);
    } finally {
      await page.close();
    }
  }

  await context.close();
  await browser.close();
  console.log("\nDone.");
}

main();
