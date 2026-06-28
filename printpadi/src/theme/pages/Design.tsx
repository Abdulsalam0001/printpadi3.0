import { IonContent, IonPage } from '@ionic/react';

export default function Design() {
  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="design-page">
          <h1>Design</h1>
          <p>Create custom prints with AI or work with a designer on your next project.</p>
          <div className="design-btns">
            <a href="/service/shop-gifts" style={{ textDecoration: 'none' }}>
              <button className="design-btn-primary">AI Design</button>
            </a>
            <a href="/service/hire-designer" style={{ textDecoration: 'none' }}>
              <button className="design-btn-secondary">Hire a designer</button>
            </a>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
