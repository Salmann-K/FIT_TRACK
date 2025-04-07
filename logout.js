import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import{getFirestore, getDoc, doc} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js"

const firebaseConfig = {
  apiKey: "AIzaSyDQ-SzneOPvJlRsViEp7oafP-QcUx3JlOM",
  authDomain: "fittrack-bff5b.firebaseapp.com",
  projectId: "fittrack-bff5b",
  storageBucket: "fittrack-bff5b.firebasestorage.app",
  messagingSenderId: "531769032525",
  appId: "1:531769032525:web:ac070719efe67924450104"
  };
 
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  const auth=getAuth();
  const db=getFirestore();


  const logoutButton=document.getElementById('logout');

  logoutButton.addEventListener('click',()=>{
    localStorage.removeItem('loggedInUserId');
    signOut(auth)
    .then(()=>{
        window.location.href='./userauthentication/index.html';
    })
    .catch((error)=>{
        console.error('Error Signing out:', error);
    })
  })