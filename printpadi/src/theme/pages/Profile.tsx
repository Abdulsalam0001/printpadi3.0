import { IonContent, IonPage } from '@ionic/react';
import { useState } from 'react';

export default function Profile() {
  const [open, setOpen] = useState<string | null>(null);

  const toggleSection = (id: string) => {
    setOpen(open === id ? null : id);
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="profile-page">
          {/* User header */}
          <div className="profile-user-header">
            <div className="avatar-circle">👤</div>
            <div className="user-info">
              <h2 className="user-name">Guest User</h2>
              <p className="user-email">Sign in to access your account</p>
            </div>
          </div>

          {/* Accordion sections */}
          <div className="profile-accordion">
            {[
              { id: 'orders', title: 'My Orders', icon: '📋' },
              { id: 'favs', title: 'Favourites', icon: '❤️' },
              { id: 'help', title: 'Help & Support', icon: '💬' },
              { id: 'socials', title: 'Follow Us', icon: '🌐' },
              { id: 'account', title: 'Account', icon: '👤' },
            ].map(section => (
              <div key={section.id} className="acc-section">
                <div 
                  className="acc-header"
                  onClick={() => toggleSection(section.id)}
                >
                  <span className="acc-header-left">
                    <span className="acc-icon">{section.icon}</span>
                    <span className="acc-title">{section.title}</span>
                  </span>
                  <span className={`acc-chevron ${open === section.id ? 'acc-chevron--open' : ''}`}>
                    ▼
                  </span>
                </div>
                {open === section.id && (
                  <div className="acc-body">
                    <a className="sub-link" href="#">View more</a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
