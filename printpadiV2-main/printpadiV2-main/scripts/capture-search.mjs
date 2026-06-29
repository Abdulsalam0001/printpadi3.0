/**
 * Capture /search for visual comparison with the design mock.
 *
 * Usage:
 *   1. Start the app: `npm run dev` (and printpadi-be so product search returns data)
 *   2. `npm run visual:search`
 *   3. Compare `visual-regression/output/search-capture.png` to
 *      `visual-regression/reference/search-design.png`
 *
 * Optional: `SEARCH_VISUAL_DIFF=1 npm run visual:search` writes `search-diff.png`
 * when reference and capture dimensions match (uses pixelmatch).
 *
 * Env:
 *   `BASE_URL` (default `http://127.0.0.1:3000`)
 *   `SEARCH_CAPTURE_QUERY` (default `q=Tshirt` — appended to `/search?`)
 *   `PUPPETEER_EXECUTABLE_PATH` — Chrome/Chromium if auto-detect fails
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
const refPath = path.join(root, "visual-regression", "reference", "search-design.png");
const outPath = path.join(outDir, "search-capture.png");
const diffPath = path.join(outDir, "search-diff.png");

const baseUrl = (process.env.BASE_URL || "http://127.0.0.1:3000").replace(/\/$/, "");
const searchQuery = (process.env.SEARCH_CAPTURE_QUERY || "q=Tshirt").replace(/^\?/, "");

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
await page.goto(`${baseUrl}/search?${searchQuery}`, {
	waitUntil: "domcontentloaded",
	timeout: 60_000,
});
await page.waitForSelector('[data-testid="search-results-screen"]', { timeout: 30_000 });
await page.screenshot({ path: outPath, type: "png", fullPage: true });

await browser.close();

console.log(`Wrote ${outPath}`);

if (process.env.SEARCH_VISUAL_DIFF === "1" && fs.existsSync(refPath)) {
	const refBuf = fs.readFileSync(refPath);
	const capBuf = fs.readFileSync(outPath);
	const img1 = PNG.sync.read(refBuf);
	const img2 = PNG.sync.read(capBuf);
	if (img1.width === img2.width && img1.height === img2.height) {
		const diff = new PNG({ width: img1.width, height: img1.height });
		const num = pixelmatch(img1.data, img2.data, diff.data, img1.width, img1.height, {
			threshold: 0.2,
		});
		fs.writeFileSync(diffPath, PNG.sync.write(diff));
		console.log(`Diff pixels (threshold 0.2): ${num} — wrote ${diffPath}`);
	} else {
		console.warn(
			`Skip diff: size mismatch ref ${img1.width}x${img1.height} vs capture ${img2.width}x${img2.height}`,
		);
	}
}
