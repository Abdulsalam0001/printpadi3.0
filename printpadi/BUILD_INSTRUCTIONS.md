# PrintPadi Ionic React – Build & Run Instructions

## Prerequisites

- **Node.js 18+** and npm 9+
- **Git**
- For iOS: **Xcode 14+** (Mac only)
- For Android: **Android Studio 2022.1+**, Android SDK 31+, Java 11+

---
cd printpadi-ionic-react
npm install
npm run build        # Generates dist/
npm run cap:sync     # Syncs web assets
npm run cap:add:ios  # or cap:add:android

## Step 1: Install Dependencies

```bash
# Navigate to project root
cd printpadi-ionic-react

# Install npm packages
npm install

# Install Capacitor CLI globally (optional, but recommended)
npm install -g @ionic/cli
```

---

## Step 2: Set Environment Variables

```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local and fill in your API base URL
# e.g., VITE_API_BASE_URL=http://localhost:5000
nano .env.local
```

---

## Step 3: Build Web Assets

```bash
# Build the React app for production
npm run build

# This generates dist/ folder that Capacitor will copy to native apps
```

After this step, the Capacitor error about missing `dist/` directory will be resolved.

---

## Step 4: Add iOS and/or Android Platforms

### For iOS (macOS only):
```bash
npm run cap:add:ios
# Opens Xcode after adding
# OR manually: npm run cap:open:ios
```

### For Android:
```bash
npm run cap:add:android
# Opens Android Studio after adding
# OR manually: npm run cap:open:android
```

---

## Step 5: Sync Project

After adding a platform, sync all web assets:

```bash
npm run cap:sync
```

This copies `dist/` into the native projects.

---

## Step 6: Run on Device or Emulator

### Web (Development):
```bash
npm run dev
# Opens http://localhost:3000 in your browser
```

### iOS (Xcode):
```bash
npm run cap:open:ios
# In Xcode:
#   1. Select simulator or device
#   2. Press Play (Cmd + R) to build and run
```

### Android (Android Studio):
```bash
npm run cap:open:android
# In Android Studio:
#   1. Select emulator or device
#   2. Click Run (Shift + F10) to build and run
```

---

## Workflow for Development

1. **Edit code** in `src/`
2. **Run `npm run build`** to rebuild web assets
3. **Run `npm run cap:sync`** to copy to native projects
4. **Run on device** using Xcode or Android Studio

Or use the development server:
```bash
npm run dev   # Runs http://localhost:3000 with hot reload
```

---

## Troubleshooting

### Error: "Could not find the web assets directory: ./dist"
- Run `npm run build` first
- Then run `npm run cap:sync`

### Error: "Cannot find module '@ionic/react'"
- Run `npm install` again
- Clear node_modules: `rm -rf node_modules && npm install`

### App doesn't show the correct design
- Verify theme files are imported in `src/main.tsx` and `src/App.tsx`
- Check browser DevTools (F12) for CSS errors
- Clear browser cache (Cmd+Shift+R or Ctrl+Shift+R)

### API calls failing (404 or CORS errors)
- Verify `VITE_API_BASE_URL` in `.env.local` is correct
- Check that backend API is running
- For local development, ensure CORS is configured on backend

---

## Project Structure

```
printpadi-ionic-react/
├── src/
│   ├── main.tsx              ← Entry point
│   ├── App.tsx               ← Router & IonTabs shell
│   ├── theme/                ← CSS tokens & global styles
│   ├── pages/                ← Page components (Home, Cart, etc.)
│   ├── components/           ← Reusable UI components
│   ├── store/                ← Zustand stores (cart, favorites)
│   ├── lib/                  ← Utilities & API client
│   └── models/               ← TypeScript types
├── public/                   ← Static assets
├── index.html                ← HTML entry
├── vite.config.ts            ← Vite configuration
├── capacitor.config.ts       ← Capacitor configuration
├── package.json              ← Dependencies
├── tsconfig.json             ← TypeScript config
├── .env.example              ← Environment template
└── .gitignore                ← Git ignore rules
```

---

## Next Steps

Once the build completes successfully:
- **Step 5** will show building the page components (Home, Cart, Design, etc.)
- **Step 6** will flesh out all the UI components (TopNav, ProductCard, Carousel, etc.)
- **Step 7** will implement the cart and favorites flows
- **Step 8** will add product data and API integration

Enjoy building! 🚀
