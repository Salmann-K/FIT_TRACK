import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyDQ-SzneOPvJlRsViEp7oafP-QcUx3JlOM",
  authDomain: "fittrack-bff5b.firebaseapp.com",
  projectId: "fittrack-bff5b",
  storageBucket: "fittrack-bff5b.firebasestorage.app",
  messagingSenderId: "531769032525",
  appId: "1:531769032525:web:ac070719efe67924450104"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };