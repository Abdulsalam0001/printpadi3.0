/**
 * Capture /service/source-china for visual comparison with the design mock.
 *
 * Usage:
 *   1. Start the app: `npm run dev` (and printpadi-be for China products)
 *   2. `npm run visual:source-china`
 *   3. Compare `visual-regression/output/source-china-capture.png` to
 *      `visual-regression/reference/source-china-design.png`
 *
 * Optional: `SOURCE_CHINA_VISUAL_DIFF=1 npm run visual:source-china` writes
 * `source-china-diff.png` when reference and capture dimensions match (pixelmatch).
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
const refPath = path.join(
	root,
	"visual-regression",
	"reference",
	"source-china-design.png",
);
const outPath = path.join(outDir, "source-china-capture.png");
const diffPath = path.join(outDir, "source-china-diff.png");

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
await page.goto(`${baseUrl}/service/source-china`, {
	waitUntil: "networkidle0",
	timeout: 60_000,
});
await page.waitForSelector('[data-testid="source-china-screen"]', { timeout: 30_000 });
await page.screenshot({ path: outPath, type: "png", fullPage: true });

await browser.close();

console.log(`Wrote ${outPath}`);

if (process.env.SOURCE_CHINA_VISUAL_DIFF === "1" && fs.existsSync(refPath)) {
	const refBuf = fs.readFileSync(refPath);
	const capBuf = fs.readFileSync(outPath);
	const img1 = PNG.sync.read(refBuf);
	const img2 = PNG.sync.read(capBuf);
	const compareHeight = Math.min(img1.height, img2.height);
	if (img1.width === img2.width && compareHeight > 0) {
		const rowBytes = img1.width * 4;
		const compareBytes = rowBytes * compareHeight;
		const refData = img1.data.subarray(0, compareBytes);
		const capData = img2.data.subarray(0, compareBytes);
		const diff = new PNG({ width: img1.width, height: compareHeight });
		const num = pixelmatch(refData, capData, diff.data, img1.width, compareHeight, {
			threshold: 0.2,
		});
		fs.writeFileSync(diffPath, PNG.sync.write(diff));
		console.log(
			`Diff pixels (threshold 0.2, height ${compareHeight}px): ${num} — wrote ${diffPath}`,
		);
		if (img1.height !== img2.height) {
			console.warn(
				`Heights differ: ref ${img1.width}x${img1.height} vs capture ${img2.width}x${img2.height} (compared top ${compareHeight}px)`,
			);
		}
	} else {
		console.warn(
			`Skip diff: width mismatch ref ${img1.width} vs capture ${img2.width}`,
		);
	}
}
