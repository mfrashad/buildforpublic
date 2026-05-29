import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

const errors = [];
const warnings = [];

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
console.log("Page title:", await page.title());

const h1 = await page.textContent("h1").catch(() => null);
console.log("H1 text:", h1?.trim());

const badSvg = await page.locator('svg[height="auto"]').count();
console.log("SVGs with bad height=auto attr:", badSvg, badSvg > 0 ? "❌" : "✅");

const sections = await page.locator("section").count();
console.log("Section count:", sections, sections >= 1 ? "✅" : "❌");

const navbar = await page.locator("nav").count();
console.log("Navbar present:", navbar > 0 ? "✅" : "❌");

const bodyLen = await page.evaluate(() => document.body.innerText.trim().length);
console.log("Body text length:", bodyLen, bodyLen > 100 ? "✅ (not blank)" : "❌ (likely blank)");

const relevantErrors = errors.filter(e => !e.includes("PostHog"));
if (relevantErrors.length) {
  console.log("\n❌ ERRORS (non-PostHog):");
  relevantErrors.forEach((e) => console.log("  -", e));
} else {
  console.log("\n✅ No blocking errors.");
}

await browser.close();
process.exit(relevantErrors.length > 0 ? 1 : 0);
