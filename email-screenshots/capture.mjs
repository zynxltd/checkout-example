import { chromium } from 'playwright-core';
import path from 'path';
import fs from 'fs';

const exe = process.env.PLAYWRIGHT_CHROMIUM ||
  '/var/folders/2c/bbcw5vsx2rn2f0nflv_tsnq40000gn/T/cursor-sandbox-cache/edf227733a7d8f16a0f239a086e3c55f/playwright/chromium_headless_shell-1254/chrome-headless-shell-mac-arm64/chrome-headless-shell';

const emails = [
  {
    file: 'gd-browse-abandon-1.html',
    out: '01-GD-browse-abandon-1-Take-Another-Look.png',
    label: 'GD browse abandon 1',
  },
  {
    file: 'thanks-for-visiting.html',
    out: '02-Thanks-for-visiting.png',
    label: 'Thanks for visiting',
  },
  {
    file: 'we-noticed.html',
    out: '03-GD-browse-abandon-2-Dont-worry-still-time.png',
    label: 'abandon browse 2',
  },
  {
    file: 'we-noticed-1.html',
    out: '04-GD-cart-abandon-2-saved-your-basket.png',
    label: 'abandon cart 2',
  },
  {
    file: 'gd-browse-abandon-3.html',
    out: '05-GD-browse-abandon-3-Last-Chance-INT902156.png',
    label: 'abandon browse 3',
  },
  {
    file: 'gd-cart-abandon-3.html',
    out: '06-GD-cart-abandon-3-basket-will-expire.png',
    label: 'GD cart abandon 3',
  },
];

console.log('exe exists', fs.existsSync(exe), exe);

const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({
  viewport: { width: 800, height: 900 },
  deviceScaleFactor: 2,
});

for (const email of emails) {
  const url = `http://127.0.0.1:8765/${email.file}`;
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2000);
  await page.screenshot({
    path: email.out,
    fullPage: true,
  });
  const box = await page.evaluate(() => ({
    w: document.documentElement.scrollWidth,
    h: document.documentElement.scrollHeight,
  }));
  const st = fs.statSync(email.out);
  console.log(`${email.out} (${email.label}) page=${box.w}x${box.h} file=${(st.size/1024).toFixed(0)}KB`);
}

await browser.close();
