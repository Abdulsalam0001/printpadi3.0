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

/* ── Theme ──
   tailwind.css must load first: it brings in Tailwind's base/utilities
   plus the @theme tokens that every ported Tailwind className relies on.
   variables.css / global.css follow for the legacy/custom-CSS components
   (Carousel.tsx, ContainerWithGradient.tsx, etc.) that are still in the
   tree but no longer used by the pages. */
import './theme/tailwind.css';
import './theme/variables.css';
import './theme/global.css';

/* ── Ionic core setup ── */
setupIonicReact({
  mode: 'ios',
  animated: true,
});

/* ── React Query client ── */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 60_000,
    },
  },
});

// ── Tab icon helper ──

type TabName = 'home' | 'explore' | 'cart' | 'design' | 'profile';

function getTabIcon(tabName: TabName, isActive: boolean) {
  const icons: Record<TabName, { active: string; outline: string }> = {
    home:    { active: home,    outline: homeOutline    },
    explore: { active: search,  outline: searchOutline  },
    cart:    { active: cart,    outline: cartOutline    },
    design:  { active: brush,   outline: brushOutline   },
    profile: { active: person,  outline: personOutline  },
  };
  return isActive ? icons[tabName].active : icons[tabName].outline;
}

// ── Root App ──

const App: React.FC = () => {
  const hydrate = useCartStore(s => s.hydrate);
  const [activeTab, setActiveTab] = useState<TabName>('home');

  useEffect(() => { 
    void hydrate(); 
  }, [hydrate]);

  return (
    <QueryClientProvider client={queryClient}>
      <IonApp>
        <IonReactRouter>
          {/* Bootstrap favorites */}
          <FavoritesBootstrap />

          {/* Main tabs structure */}
          <IonTabs onIonTabsWillChange={e => setActiveTab(e.detail.tab as TabName)}>
            <IonRouterOutlet>
              {/* ── Tab routes ── */}
              <Route exact path="/home" component={Home} />
              <Route exact path="/explore" component={Explore} />
              <Route exact path="/cart" component={Cart} />
              <Route exact path="/design" component={Design} />
              <Route exact path="/profile" component={Profile} />

              {/* ── Subpage routes (no tabs) ── */}
              <Route exact path="/cart/summary" component={CartSummary} />
              <Route exact path="/product/:id" component={ProductDetail} />
              <Route exact path="/search" component={Search} />
              <Route exact path="/service/curate-event" component={CurateEvent} />
              <Route exact path="/service/request-quote" component={RequestQuote} />
              <Route exact path="/service/source-china" component={SourceChina} />
              <Route exact path="/service/hire-designer" component={HireDesigner} />
              <Route exact path="/service/shop-gifts" component={ShopGifts} />
              <Route exact path="/auth/login" component={AuthLogin} />
              <Route exact path="/auth/error" component={AuthError} />

              {/* ── Default redirect ── */}
              <Route exact path="/">
                <Redirect to="/home" />
              </Route>
            </IonRouterOutlet>

            {/* ── Tab bar (MUST be sibling of IonRouterOutlet) ── */}
            <IonTabBar slot="bottom">
              <IonTabButton tab="home" href="/home">
                <IonIcon icon={getTabIcon('home', activeTab === 'home')} />
                <IonLabel>home</IonLabel>
              </IonTabButton>

              <IonTabButton tab="explore" href="/explore">
                <IonIcon icon={getTabIcon('explore', activeTab === 'explore')} />
                <IonLabel>explore</IonLabel>
              </IonTabButton>

              <IonTabButton tab="cart" href="/cart">
                <IonIcon icon={getTabIcon('cart', activeTab === 'cart')} />
                <IonLabel>my cart</IonLabel>
              </IonTabButton>

              <IonTabButton tab="design" href="/design">
                <IonIcon icon={getTabIcon('design', activeTab === 'design')} />
                <IonLabel>design</IonLabel>
              </IonTabButton>

              <IonTabButton tab="profile" href="/profile">
                <IonIcon icon={getTabIcon('profile', activeTab === 'profile')} />
                <IonLabel>profile</IonLabel>
              </IonTabButton>
            </IonTabBar>
          </IonTabs>

          {/* Toaster overlay */}
          <Toaster richColors position="top-center" />
        </IonReactRouter>
      </IonApp>
    </QueryClientProvider>
  );
};

export default App;