# PrintPadi (customer web)

Next.js storefront for PrintPadi. Product data can be loaded from the PrintPadi API via server actions.

## Setup

```bash
npm install
cp .env.example .env.local
```

Fill in `.env.local` — see [Environment variables](#environment-variables).

```bash
npm run dev
```

## Environment variables

| Variable | Where | Purpose |
|----------|--------|---------|
| `BASE_API_URL` | Server only | API **origin** only: `http://localhost:3000` (no trailing `/api`). Server code appends `/api/...` for Express routes. |
| `NEXT_PUBLIC_BASE_API_URL` | Browser + server | Same origin as `BASE_API_URL`. If you use `http://host:port/api`, requests become `/api/api/...` and break. |

The two must point at the **same API origin** so session cookies issued by the API are sent on credentialed `fetch` from the browser.

## Browsing without an account

Product listing, product detail, and the cart are available **without** signing in. **`/auth/login`** is only for optional Google sign-in when you want a saved session.

## Google sign-in (with printpadi-be)

Flow: user opens **`/auth/login`** → **Continue with Google** → browser hits **`GET {API}/api/auth/google`** → Google → **`GET {API}/api/auth/google/callback`** → API sets an httpOnly session cookie → browser is redirected to **`/auth/google/complete`** on this app → page calls **`GET {API}/api/auth/me`** with `credentials: "include"` → on success, user is sent to `/`.

### Ports

Run the **API** and **Next** on **different ports**. Recommended local setup:

- This app (storefront): `http://localhost:3000` — `npm run dev -- -p 3000`
- API (`printpadi-be`): `http://localhost:3001` — `PORT=3001` in the API `.env`
- Set `NEXT_PUBLIC_BASE_API_URL=http://localhost:3001` in `.env.local` (origin only, no `/api` suffix)

### API `.env` (printpadi-be)

Align with the origin where this app is served:

- **`FRONTEND_URL`** — exact origin of printpadi-v2 (e.g. `http://localhost:3000`). Used for redirects to `/auth/google/complete` and `/auth/error`.
- **`ALLOWED_ORIGINS`** — comma-separated list that **includes** that same origin so the browser may call the API with cookies (e.g. `http://localhost:3000,http://localhost:3001`).

Google Cloud Console **Authorized redirect URI** must be:

`{APP_BASE_URL}/api/auth/google/callback`  
(e.g. `http://localhost:3000/api/auth/google/callback` when `APP_BASE_URL` is the API.)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Next dev server |
| `npm run build` | Production build |
| `npm run start` | Production server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript |
| `npm run test` | Vitest |
| `npm run visual:profile` | Puppeteer screenshot of `/profile` (requires dev server; see below) |
| `npm run visual:explore` | Puppeteer screenshot of `/explore` (requires dev server + API; see below) |
| `npm run visual:search` | Puppeteer screenshot of `/search` (requires dev server + API; see below) |
| `npm run visual:cart-summary` | Puppeteer screenshots of `/cart/summary` (both tabs; see below) |
| `npm run visual:product-pdp` | Puppeteer screenshot of `/product/:id` (see below) |
| `npm run visual:source-china` | Puppeteer screenshot of `/service/source-china` (see below) |
| `npm run visual:request-quote` | Puppeteer screenshot of `/service/request-quote` (see below) |

## Visual regression (product detail)

Add **`visual-regression/reference/product-pdp-design.png`** locally (gitignored; **do not commit** the mock).

1. Start Next (`npm run dev`) and **printpadi-be** at `BASE_API_URL`.
2. Optional: `PRODUCT_ID=<uuid> npm run visual:product-pdp` (defaults to first product from the API).
3. Compare `visual-regression/output/product-pdp-capture.png` to your reference; adjust [`features/product/`](features/product/) until they match.

Optional pixel diff:

```bash
PRODUCT_PDP_VISUAL_DIFF=1 npm run visual:product-pdp
```

## Visual regression (cart summary)

Add **`visual-regression/reference/cart-summary-tab1.png`** and **`cart-summary-tab2.png`** locally (paths gitignored) at **390×844** to match the capture viewport.

1. Start Next (`npm run dev`). Optional: `BASE_URL=http://localhost:3001`.
2. Run `npm run visual:cart-summary`.
3. Compare `visual-regression/output/cart-summary-tab1-capture.png` and `...-tab2-capture.png` to your references; adjust [`features/cart/cart-summary-screen.tsx`](features/cart/cart-summary-screen.tsx) until they match.

Optional pixel diff when reference dimensions match captures:

```bash
CART_SUMMARY_VISUAL_DIFF=1 npm run visual:cart-summary
```

Empty cart still validates layout; add items in the browser before capture if you need line items in the screenshot.

Uses `puppeteer-core` with your installed Chrome/Chromium. Set `PUPPETEER_EXECUTABLE_PATH` if auto-detection fails.

## Visual regression (profile screen)

Design reference: [`visual-regression/reference/profile-design.png`](visual-regression/reference/profile-design.png).

1. Start Next (same origin `BASE_URL` will load, default `http://127.0.0.1:3000`). Example: `npm run dev`.
2. Run `npm run visual:profile` (optional: `BASE_URL=http://localhost:3001 npm run visual:profile` if you use another port).
3. Open `visual-regression/output/profile-capture.png` and compare to the reference; adjust Tailwind in [`features/profile/profile-screen.tsx`](features/profile/profile-screen.tsx) until they match.

Optional pixel diff (only when reference and capture have identical dimensions):

```bash
PROFILE_VISUAL_DIFF=1 npm run visual:profile
```

Writes `visual-regression/output/profile-diff.png` when sizes match. Generated captures live under `visual-regression/output/` (gitignored).

**Note:** Uses `puppeteer-core` with your installed Chrome/Chromium. Set `PUPPETEER_EXECUTABLE_PATH` if auto-detection fails (macOS default tries `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`).

## Visual regression (explore screen)

Design mocks for explore/search are **not** committed for those flows. Add **`visual-regression/reference/explore-design.png`** locally when you want pixel diffs (path is gitignored).

1. Start Next (default `http://127.0.0.1:3000`). Example: `npm run dev`.
2. Ensure **printpadi-be** is running so `GET /api/products/tag-options` returns categories (otherwise tiles show the empty state).
3. Run `npm run visual:explore` (optional: `BASE_URL=http://localhost:3001 npm run visual:explore`).

Compare `visual-regression/output/explore-capture.png` to your local reference; adjust [`features/explore/explore-screen.tsx`](features/explore/explore-screen.tsx) until they match.

Optional pixel diff:

```bash
EXPLORE_VISUAL_DIFF=1 npm run visual:explore
```

Writes `visual-regression/output/explore-diff.png` when reference and capture dimensions match.

## Visual regression (search results)

Add **`visual-regression/reference/search-design.png`** locally only (gitignored). Use **390×844** to match the capture viewport.

1. Start Next (default `http://127.0.0.1:3000`). Example: `npm run dev`.
2. Start **printpadi-be** so `GET /api/products` can satisfy the capture query (default `q=Tshirt`).
3. Run `npm run visual:search` (optional: `BASE_URL=http://localhost:3001 npm run visual:search`).

Compare `visual-regression/output/search-capture.png` to your local reference; adjust [`features/search/search-results-screen.tsx`](features/search/search-results-screen.tsx) until they match.

Optional env:

- `SEARCH_CAPTURE_QUERY` — query string for the capture URL, default `q=Tshirt` (e.g. `SEARCH_CAPTURE_QUERY=q=Hoodie`).
- `SEARCH_VISUAL_DIFF=1` — writes `visual-regression/output/search-diff.png` when reference and capture dimensions match.

```bash
SEARCH_VISUAL_DIFF=1 npm run visual:search
```

Uses `puppeteer-core` with your installed Chrome/Chromium. Set `PUPPETEER_EXECUTABLE_PATH` if auto-detection fails (macOS default tries `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`).

## Visual regression (source from china)

Add **`visual-regression/reference/source-china-design.png`** locally only (gitignored). Use **390×844** viewport (or taller reference; diff compares the overlapping top region).

1. Start Next (default `http://127.0.0.1:3000`). Example: `npm run dev`.
2. Start **printpadi-be** so `GET /api/products?origin=CHINA` returns products for the grid.
3. Run `npm run visual:source-china` (optional: `BASE_URL=http://localhost:3001 npm run visual:source-china`).

Compare `visual-regression/output/source-china-capture.png` to your local reference; adjust [`features/source-china/source-china-screen.tsx`](features/source-china/source-china-screen.tsx) until they match.

Optional pixel diff:

```bash
SOURCE_CHINA_VISUAL_DIFF=1 npm run visual:source-china
```

Writes `visual-regression/output/source-china-diff.png` when widths match (compares top `min(ref, capture)` height).

## Visual regression (request custom quote)

Add **`visual-regression/reference/request-quote-design.png`** locally only (gitignored). Use **390×844** viewport (or taller reference; diff compares the overlapping top region).

1. Start Next (default `http://127.0.0.1:3000`). Example: `npm run dev`.
2. Run `npm run visual:request-quote` (optional: `BASE_URL=http://localhost:3001 npm run visual:request-quote`).

Compare `visual-regression/output/request-quote-capture.png` to your local reference; adjust [`features/request-quote/request-quote-screen.tsx`](features/request-quote/request-quote-screen.tsx) until they match.

Optional pixel diff:

```bash
REQUEST_QUOTE_VISUAL_DIFF=1 npm run visual:request-quote
```

Writes `visual-regression/output/request-quote-diff.png` when widths match (compares top `min(ref, capture)` height).
