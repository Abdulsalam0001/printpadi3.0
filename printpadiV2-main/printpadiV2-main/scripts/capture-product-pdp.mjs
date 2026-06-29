/**
 * Capture /product/:id for visual comparison with the design mock.
 *
 * Usage:
 *   1. Start the app: `npm run dev` and printpadi-be at BASE_API_URL
 *   2. Place mock at `visual-regression/reference/product-pdp-design.png` (local only, gitignored)
 *   3. `npm run visual:product-pdp`
 *   4. Compare `visual-regression/output/product-pdp-capture.png` to the reference
 *
 * Optional: `PRODUCT_PDP_VISUAL_DIFF=1 npm run visual:product-pdp`
 *
 * Env:
 *   `BASE_URL` (default `http://127.0.0.1:3000`)
 *   `BASE_API_URL` (default `http://127.0.0.1:8000`) — used to resolve PRODUCT_ID when unset
 *   `PRODUCT_ID` — product UUID for /product/:id
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

async function resolveProductId(apiBase) {
	if (process.env.PRODUCT_ID?.trim()) {
		return process.env.PRODUCT_ID.trim();
	}
	const origin = apiBase.replace(/\/$/, "");
	const res = await fetch(`${origin}/api/products`, {
		headers: { Accept: "application/json" },
	});
	if (!res.ok) {
		throw new Error(`Could not list products: HTTP ${res.status}`);
	}
	const json = await res.json();
	const id = json?.data?.products?.[0]?.id;
	if (!id) {
		throw new Error("No products returned from API; set PRODUCT_ID explicitly.");
	}
	return String(id);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "visual-regression", "output");
const refPath = path.join(root, "visual-regression", "reference", "product-pdp-design.png");
const outPath = path.join(outDir, "product-pdp-capture.png");
const diffPath = path.join(outDir, "product-pdp-diff.png");

const baseUrl = (process.env.BASE_URL || "http://127.0.0.1:3000").replace(/\/$/, "");
const apiBase = (process.env.BASE_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

await fs.promises.mkdir(outDir, { recursive: true });

const executablePath = resolveChromeExecutable();
if (!executablePath || !fs.existsSync(executablePath)) {
	console.error(
		`Chrome not found at ${executablePath ?? "(none)"}. Set PUPPETEER_EXECUTABLE_PATH to your Chrome/Chromium binary.`,
	);
	process.exit(1);
}

const productId = await resolveProductId(apiBase);
const targetUrl = `${baseUrl}/product/${encodeURIComponent(productId)}`;

const browser = await puppeteer.launch({ headless: true, executablePath });
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
await page.goto(targetUrl, {
	waitUntil: "domcontentloaded",
	timeout: 60_000,
});
await page.waitForSelector('[data-testid="product-detail-screen"]', { timeout: 30_000 });
// Viewport capture (390×844) — resize reference mock to same size for pixel diff
await page.screenshot({ path: outPath, type: "png", fullPage: false });

await browser.close();

console.log(`Captured ${targetUrl}`);
console.log(`Wrote ${outPath}`);

if (process.env.PRODUCT_PDP_VISUAL_DIFF === "1" && fs.existsSync(refPath)) {
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
} else if (process.env.PRODUCT_PDP_VISUAL_DIFF === "1") {
	console.warn(`Reference mock not found at ${refPath} (add locally; never commit).`);
}
