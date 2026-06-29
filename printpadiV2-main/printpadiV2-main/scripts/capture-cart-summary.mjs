/**
 * Capture /cart/summary for visual comparison with design mocks.
 *
 * Usage:
 *   1. Start the app: `npm run dev` (or `npm run build && npm run start`)
 *   2. `npm run visual:cart-summary`
 *   3. Compare outputs under `visual-regression/output/` to local references
 *      `visual-regression/reference/cart-summary-tab1.png` and `cart-summary-tab2.png`
 *      (add those files locally; paths are gitignored).
 *
 * Optional: `CART_SUMMARY_VISUAL_DIFF=1 npm run visual:cart-summary` runs pixelmatch per tab.
 *
 * Env: `BASE_URL` (default `http://127.0.0.1:3000`)
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import puppeteer from "puppeteer-core";

function resolveChromeExecutable() {
	if (process.env.PUPPETEER_EXECUTABLE_PATH) {
		return process.env.PUPPETEER_EXECUTABLE_PATH;
	}
	if (process.platform === "darwin") {
		return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
	}
	if (process.platform === "linux") {
		return "/usr/bin/google-chrome-stable";
	}
	if (process.platform === "win32") {
		return "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
	}
	return null;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "visual-regression", "output");
const refDir = path.join(root, "visual-regression", "reference");
const cap1 = path.join(outDir, "cart-summary-tab1-capture.png");
const cap2 = path.join(outDir, "cart-summary-tab2-capture.png");
const ref1 = path.join(refDir, "cart-summary-tab1.png");
const ref2 = path.join(refDir, "cart-summary-tab2.png");

const baseUrl = (process.env.BASE_URL || "http://127.0.0.1:3000").replace(/\/$/, "");

await fs.promises.mkdir(outDir, { recursive: true });

const executablePath = resolveChromeExecutable();
if (!executablePath || !fs.existsSync(executablePath)) {
	console.error(
		`Chrome not found at ${executablePath ?? "(none)"}. Set PUPPETEER_EXECUTABLE_PATH to your Chrome/Chromium binary.`,
	);
	process.exit(1);
}

const browser = await puppeteer.launch({ headless: true, executablePath });
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
await page.goto(`${baseUrl}/cart/summary`, {
	waitUntil: "domcontentloaded",
	timeout: 60_000,
});
await page.waitForSelector('[data-testid="cart-summary-screen"]', { timeout: 30_000 });
await page.screenshot({ path: cap1, type: "png", fullPage: true });
console.log(`Wrote ${cap1}`);

await page.click('[data-testid="cart-summary-tab-delivery"]');
await new Promise(r => setTimeout(r, 300));
await page.screenshot({ path: cap2, type: "png", fullPage: true });
console.log(`Wrote ${cap2}`);

await browser.close();

function diffIf(refPath: string, capPath: string, diffName: string) {
	if (process.env.CART_SUMMARY_VISUAL_DIFF !== "1" || !fs.existsSync(refPath)) {
		return;
	}
	const refBuf = fs.readFileSync(refPath);
	const capBuf = fs.readFileSync(capPath);
	const img1 = PNG.sync.read(refBuf);
	const img2 = PNG.sync.read(capBuf);
	if (img1.width === img2.width && img1.height === img2.height) {
		const diff = new PNG({ width: img1.width, height: img1.height });
		const num = pixelmatch(img1.data, img2.data, diff.data, img1.width, img1.height, {
			threshold: 0.2,
		});
		const diffPath = path.join(outDir, diffName);
		fs.writeFileSync(diffPath, PNG.sync.write(diff));
		console.log(`Diff pixels (${diffName}): ${num} — wrote ${diffPath}`);
	} else {
		console.warn(
			`Skip diff ${diffName}: size mismatch ref ${img1.width}x${img1.height} vs capture ${img2.width}x${img2.height}`,
		);
	}
}

diffIf(ref1, cap1, "cart-summary-tab1-diff.png");
diffIf(ref2, cap2, "cart-summary-tab2-diff.png");
