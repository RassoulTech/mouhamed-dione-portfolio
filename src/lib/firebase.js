import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

/*
 * Configuration Firebase.
 * Les valeurs viennent des variables d'environnement (fichier .env en local,
 * et reglages Vercel en ligne). Voir FIREBASE-SETUP.md pour les obtenir.
 *
 * NB : ces cles ne sont PAS secretes — c'est normal qu'elles soient cote client.
 * La securite est assuree par l'authentification + les regles Firestore.
 */
const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Tant que Firebase n'est pas configure, le site continue de marcher
// avec les articles Markdown (voir src/utils/posts.js).
export const isFirebaseConfigured = Boolean(config.apiKey && config.projectId);

let db = null;
let auth = null;

if (isFirebaseConfigured) {
  const app = initializeApp(config);
  db = getFirestore(app);
  auth = getAuth(app);
}

export { db, auth };
