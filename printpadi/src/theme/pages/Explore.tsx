import { IonContent, IonPage } from '@ionic/react';
import { useState } from 'react';

const CATEGORIES = [
  { slug: 'business', name: 'Business', src: 'https://placehold.co/76x76/E6E7E9/808080?text=B' },
  { slug: 'wedding', name: 'Wedding', src: 'https://placehold.co/76x76/f5e6ff/9810FA?text=W' },
  { slug: 'gifts', name: 'Gifts', src: 'https://placehold.co/76x76/fff3e0/E65100?text=G' },
  { slug: 'events', name: 'Events', src: 'https://placehold.co/76x76/e8f5e9/2e7d32?text=Ev' },
  { slug: 'stickers', name: 'Stickers', src: 'https://placehold.co/76x76/fce4ec/c62828?text=St' },
  { slug: 'packaging', name: 'Packaging', src: 'https://placehold.co/76x76/f3e5f5/6a1b9a?text=P' },
  { slug: 'signage', name: 'Signage', src: 'https://placehold.co/76x76/e3f2fd/1565C0?text=Si' },
  { slug: 'clothing', name: 'Clothing', src: 'https://placehold.co/76x76/1a1a2e/ffffff?text=Cl' },
];

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <IonPage>
      <IonContent fullscreen>
        <div style={{ maxWidth: '448px', margin: '0 auto', padding: '12px 16px 80px' }}>
          {/* Status bar replica */}
          <div style={{ display: 'flex', justifyContent: 'space-between', height: '44px', fontSize: '15px', fontWeight: 500, color: '#101010' }}>
            <span>9:41</span>
            <span>📶 📡 🔋</span>
          </div>

          {/* Search bar */}
          <div className="explore-search-bar" style={{ marginTop: '12px' }}>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: '14px', background: 'transparent' }}
            />
            <button className="explore-search-btn" style={{ cursor: 'pointer' }}>🔍</button>
          </div>

          <h2 style={{ fontFamily: 'Bricolage Grotesque', marginTop: '28px', fontSize: '17px', fontWeight: 600 }}>
            Explore Our Categories
          </h2>

          {/* Categories grid */}
          <ul className="explore-cats-grid">
            {CATEGORIES.map(c => (
              <li key={c.slug} className="explore-cat-item" onClick={() => window.location.href = '/search'}>
                <div className="explore-cat-img">
                  <img src={c.src} alt={c.name} loading="lazy" />
                </div>
                <span className="explore-cat-label">{c.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </IonContent>
    </IonPage>
  );
}
