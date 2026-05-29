import { chromium } from "playwright";

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const errors: string[] = [];
  const warnings: string[] = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
    if (msg.type() === "warning") warnings.push(msg.text());
  });

  page.on("pageerror", (err) => {
    errors.push(`PAGE ERROR: ${err.message}`);
  });

  console.log("Loading http://localhost:3005/ ...");
  const response = await page.goto("http://localhost:3005/", { waitUntil: "networkidle" });
  console.log("HTTP status:", response?.status());

  const title = await page.title();
  console.log("Page title:", title);

  const h1 = await page.textContent("h1").catch(() => null);
  console.log("H1 text:", h1);

  const svgCount = await page.locator("svg").count();
  console.log("SVG elements:", svgCount);

  // Check for SVG height=auto attribute (the bad one)
  const badSvg = await page.locator('svg[height="auto"]').count();
  console.log("SVGs with bad height=auto attr:", badSvg);

  // Check body is not blank
  const bodyText = await page.evaluate(() => (document as Document & { body: HTMLBodyElement }).body.innerText.trim().length);
  console.log("Body text length:", bodyText);

  // Check main sections exist
  const sections = await page.locator("section").count();
  console.log("Section elements:", sections);

  if (errors.length) {
    console.log("\nCONSOLE ERRORS:");
    errors.forEach((e) => console.log(" -", e));
  } else {
    console.log("\nNo console errors.");
  }

  if (warnings.length) {
    console.log("\nCONSOLE WARNINGS:");
    warnings.forEach((w) => console.log(" -", w));
  }

  await browser.close();
  process.exit(errors.filter(e => !e.includes("PostHog")).length > 0 ? 1 : 0);
})();
