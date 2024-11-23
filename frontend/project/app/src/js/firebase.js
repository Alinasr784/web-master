import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyAcaVxUAvPAIoxegj8l6WS0wWMNb5dRn90",
  authDomain: "web-goo-e407c.firebaseapp.com",
  projectId: "web-goo-e407c",
  storageBucket: "web-goo-e407c.appspot.com",
  messagingSenderId: "115162528815",
  appId: "1:115162528815:web:57c2539dd41bb54c45dada",
  measurementId: "G-9KV7P1WPHB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);