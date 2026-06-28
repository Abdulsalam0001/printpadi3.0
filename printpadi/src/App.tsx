// ============================================================
// PrintPadi – App.tsx
// Ionic React equivalent of app/layout.tsx + the Next.js
// App Router file-system routing.
//
// Route map (mirrors Next.js app/ directory):
//   /home                     → Home
//   /explore                  → Explore
//   /cart                     → Cart
//   /cart/summary             → CartSummary
//   /design                   → Design
//   /profile                  → Profile
//   /search                   → Search
//   /product/:id              → ProductDetail
//   /service/curate-event     → CurateEvent
//   /service/request-quote    → RequestQuote
//   /service/source-china     → SourceChina
//   /service/hire-designer    → HireDesigner
//   /service/shop-gifts       → ShopGifts (AI)
//   /auth/login               → AuthLogin
//   /auth/error               → AuthError
// ============================================================

import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import {
  homeOutline,
  home,
  searchOutline,
  search,
  cartOutline,
  cart,
  brushOutline,
  brush,
  personOutline,
  person,
} from 'ionicons/icons';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { useState, useEffect } from 'react';

/* ── Pages ── */
import Home          from './pages/Home';
import Explore       from './pages/Explore';
import Cart          from './pages/Cart';
import CartSummary   from './pages/CartSummary';
import Design        from './pages/Design';
import Profile       from './pages/Profile';
import Search        from './pages/Search';
import ProductDetail from './pages/ProductDetail';
import CurateEvent   from './pages/service/CurateEvent';
import RequestQuote  from './pages/service/RequestQuote';
import SourceChina   from './pages/service/SourceChina';
import HireDesigner  from './pages/service/HireDesigner';
import ShopGifts     from './pages/service/ShopGifts';
import AuthLogin     from './pages/auth/Login';
import AuthError     from './pages/auth/Error';

/* ── Bootstrap ── */
import FavoritesBootstrap from './components/FavoritesBootstrap';
import { useCartStore }       from './store/cartStore';
import { useIonRouter }       from '@ionic/react';

/* ── Theme ── */
import './theme/variables.css';
import './theme/global.css';

/* ── Ionic core setup ── */
setupIonicReact({
  mode: 'ios',          // ios mode gives the cleanest look, matching the design
  animated: true,
});

/* ── React Query client (mirrors providers.tsx) ── */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 60_000,      // same as Next.js project
    },
  },
});

// ── Tab icon helper (mirrors getIcon() in bottom-nav.tsx) ─────

type TabName = 'home' | 'explore' | 'cart' | 'design' | 'profile';

function useTabIcon(tabName: TabName, activeTab: TabName) {
  const isActive = activeTab === tabName;
  const icons: Record<TabName, { active: string; outline: string }> = {
    home:    { active: home,    outline: homeOutline    },
    explore: { active: search,  outline: searchOutline  },
    cart:    { active: cart,    outline: cartOutline    },
    design:  { active: brush,   outline: brushOutline   },
    profile: { active: person,  outline: personOutline  },
  };
  return isActive ? icons[tabName].active : icons[tabName].outline;
}

// ── Tab bar (mirrors bottom-nav.tsx exactly) ──────────────────

function PrintPadiTabBar({ activeTab }: { activeTab: TabName }) {
  return (
    <IonTabBar slot="bottom">
      {/* home */}
      <IonTabButton tab="home" href="/home">
        <IonIcon icon={useTabIcon('home', activeTab)} />
        <IonLabel>home</IonLabel>
      </IonTabButton>

      {/* explore */}
      <IonTabButton tab="explore" href="/explore">
        <IonIcon icon={useTabIcon('explore', activeTab)} />
        <IonLabel>explore</IonLabel>
      </IonTabButton>

      {/* my cart */}
      <IonTabButton tab="cart" href="/cart">
        <IonIcon icon={useTabIcon('cart', activeTab)} />
        <IonLabel>my cart</IonLabel>
      </IonTabButton>

      {/* design */}
      <IonTabButton tab="design" href="/design">
        <IonIcon icon={useTabIcon('design', activeTab)} />
        <IonLabel>design</IonLabel>
      </IonTabButton>

      {/* profile */}
      <IonTabButton tab="profile" href="/profile">
        <IonIcon icon={useTabIcon('profile', activeTab)} />
        <IonLabel>profile</IonLabel>
      </IonTabButton>
    </IonTabBar>
  );
}

// ── Tabs wrapper – tracks active tab for icon toggling ────────

function TabsShell() {
  const [activeTab, setActiveTab] = useState<TabName>('home');

  return (
    <IonTabs onIonTabsWillChange={e => setActiveTab(e.detail.tab as TabName)}>
      <IonRouterOutlet>
        {/* ── Tab root routes ── */}
        <Route exact path="/home"    component={Home}    />
        <Route exact path="/explore" component={Explore} />
        <Route exact path="/cart"    component={Cart}    />
        <Route exact path="/design"  component={Design}  />
        <Route exact path="/profile" component={Profile} />

        {/* ── Default redirect ── */}
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
      </IonRouterOutlet>

      <PrintPadiTabBar activeTab={activeTab} />
    </IonTabs>
  );
}

// ── Root App ─────────────────────────────────────────────────

const App: React.FC = () => {
  // Rehydrate cart from Capacitor Preferences on launch
  const hydrate = useCartStore(s => s.hydrate);
  useEffect(() => { void hydrate(); }, [hydrate]);

  return (
    <QueryClientProvider client={queryClient}>
      <IonApp>
        <IonReactRouter>
          {/*
            Bootstrap favorites (mirrors <FavoritesBootstrap /> in layout.tsx).
            Must be inside IonReactRouter so useIonRouter works in children.
          */}
          <FavoritesBootstrap />

          <IonRouterOutlet id="main">
            {/* ── Tab shell (home, explore, cart, design, profile) ── */}
            <Route path="/(home|explore|cart|design|profile)" component={TabsShell} />

            {/* ── Subpages (show back-button top nav, no tab bar) ── */}

            {/* Cart summary / checkout */}
            <Route exact path="/cart/summary" component={CartSummary} />

            {/* Product detail */}
            <Route exact path="/product/:id" component={ProductDetail} />

            {/* Search */}
            <Route exact path="/search" component={Search} />

            {/* Services */}
            <Route exact path="/service/curate-event"    component={CurateEvent}   />
            <Route exact path="/service/request-quote"   component={RequestQuote}  />
            <Route exact path="/service/source-china"    component={SourceChina}   />
            <Route exact path="/service/hire-designer"   component={HireDesigner}  />
            <Route exact path="/service/shop-gifts"      component={ShopGifts}     />

            {/* Auth */}
            <Route exact path="/auth/login" component={AuthLogin} />
            <Route exact path="/auth/error" component={AuthError} />

            {/* Default */}
            <Route exact path="/">
              <Redirect to="/home" />
            </Route>
          </IonRouterOutlet>
        </IonReactRouter>

        {/*
          Toaster (mirrors <Toaster richColors position="top-center" /> in layout.tsx)
          Rendered outside router so it always sits on top.
        */}
        <Toaster richColors position="top-center" />
      </IonApp>
    </QueryClientProvider>
  );
};

export default App;
