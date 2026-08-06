import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const OUT = 'C:/Users/invit/Documents/treky/screenshots';
try { mkdirSync(OUT, { recursive: true }); } catch {}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });

await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 15000 });
await page.waitForTimeout(1200);

// Hero
await page.screenshot({ path: `${OUT}/hero.png`, fullPage: false });

// Scroll to circuits section
await page.evaluate(() => {
  const el = document.getElementById('circuits');
  if (el) el.scrollIntoView({ behavior: 'instant' });
});
await page.waitForTimeout(900);
await page.screenshot({ path: `${OUT}/circuits.png`, fullPage: false });

// Scroll down more to see cards fully
await page.evaluate(() => window.scrollBy(0, 200));
await page.waitForTimeout(600);
await page.screenshot({ path: `${OUT}/circuits-cards.png`, fullPage: false });

// About section
await page.evaluate(() => {
  const el = document.getElementById('about');
  if (el) el.scrollIntoView({ behavior: 'instant' });
});
await page.waitForTimeout(800);
await page.screenshot({ path: `${OUT}/about.png`, fullPage: false });

await browser.close();
console.log('Done');
