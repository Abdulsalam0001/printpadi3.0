/**
 * Capture /service/curate-event?visualStep=recommendations for visual comparison.
 *
 * Usage:
 *   1. Start the app: `npm run dev`
 *   2. `npm run visual:curate-event-recommendations`
 *   3. Compare `visual-regression/output/curate-event-recommendations-capture.png` to
 *      `visual-regression/reference/curate-event-recommendations-design.png`
 *
 * Optional: `CURATE_EVENT_RECOMMENDATIONS_VISUAL_DIFF=1 npm run visual:curate-event-recommendations`
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
const refPath = path.join(refDir, "curate-event-recommendations-design.png");
const outPath = path.join(outDir, "curate-event-recommendations-capture.png");
const diffPath = path.join(outDir, "curate-event-recommendations-diff.png");

const baseUrl = (process.env.BASE_URL || "http://localhost:3000").replace(/\/$/, "");

await fs.promises.mkdir(outDir, { recursive: true });
await fs.promises.mkdir(refDir, { recursive: true });

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
await page.goto(`${baseUrl}/service/curate-event?visualStep=recommendations`, {
	waitUntil: "load",
	timeout: 60_000,
});
await page.waitForSelector('[data-testid="curate-event-recommendations-step"]', {
	timeout: 30_000,
});
await page.waitForSelector('[data-testid="recommendation-product-card"]', {
	timeout: 30_000,
});
await page.evaluate(() => {
	for (const el of document.querySelectorAll("[data-visual-exclude]")) {
		el.style.display = "none";
	}
});
await page.screenshot({ path: outPath, type: "png", fullPage: true });

await browser.close();

console.log(`Wrote ${outPath}`);

if (process.env.CURATE_EVENT_RECOMMENDATIONS_VISUAL_DIFF === "1" && fs.existsSync(refPath)) {
	const refBuf = fs.readFileSync(refPath);
	const capBuf = fs.readFileSync(outPath);
	let img1 = PNG.sync.read(refBuf);
	const img2 = PNG.sync.read(capBuf);
	const originalRefWidth = img1.width;
	if (img1.width !== img2.width) {
		const scale = img2.width / img1.width;
		const scaled = new PNG({
			width: img2.width,
			height: Math.round(img1.height * scale),
		});
		for (let y = 0; y < scaled.height; y++) {
			const srcY = Math.min(img1.height - 1, Math.round(y / scale));
			for (let x = 0; x < scaled.width; x++) {
				const srcX = Math.min(img1.width - 1, Math.round(x / scale));
				const srcIdx = (img1.width * srcY + srcX) << 2;
				const dstIdx = (scaled.width * y + x) << 2;
				scaled.data[dstIdx] = img1.data[srcIdx];
				scaled.data[dstIdx + 1] = img1.data[srcIdx + 1];
				scaled.data[dstIdx + 2] = img1.data[srcIdx + 2];
				scaled.data[dstIdx + 3] = img1.data[srcIdx + 3];
			}
		}
		img1 = scaled;
		console.warn(`Scaled reference from ${originalRefWidth}px to ${img2.width}px for diff`);
	}
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
