import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { browserLocalPersistence, connectAuthEmulator, getAuth, setPersistence } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

const firebaseConfig: FirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Alterna entre Produção e Emulador
const useEmulator = import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true';

// Inicializa App
export const app = initializeApp(firebaseConfig);

// Firestore
export const db = useEmulator
    ? getFirestore(app)
    : initializeFirestore(app, {
          localCache: persistentLocalCache({
              tabManager: persistentMultipleTabManager()
          })
      }, '(default)');

// Auth
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);

// Conectar aos emuladores se necessário
if (useEmulator) {
    console.log('🔥 Conectando aos emuladores Firebase...');
    connectAuthEmulator(auth, 'http://127.0.0.1:9099');
    connectFirestoreEmulator(db, '127.0.0.1', 8080);
}

export const analytics = isSupported().then((yes) => {
    if (yes) getAnalytics(app);
});

export default app;