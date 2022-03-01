import { initializeApp } from "firebase/app";
import { inMemoryPersistence, getAuth, setPersistence } from "firebase/auth";

export const app = initializeApp({
  apiKey: "AIzaSyCsukUZtMkI5FD_etGfefO4Sr7fHkZM7Rg",
  authDomain: "hexlabs-cloud.firebaseapp.com",
});

const auth = getAuth(app);
setPersistence(auth, inMemoryPersistence);
