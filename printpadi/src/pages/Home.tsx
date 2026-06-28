import { IonContent, IonPage } from '@ionic/react';

export default function Home() {
  return (
    <IonPage>
      <IonContent fullscreen>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Home</h1>
          <p>Loading...</p>
        </div>
      </IonContent>
    </IonPage>
  );
}
