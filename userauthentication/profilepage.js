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

  onAuthStateChanged(auth, (user) => {
    if (user) {  // Ensure user is authenticated
        const loggedInUserId = localStorage.getItem('loggedInUserId') || user.uid; // Fallback to auth UID

        if (loggedInUserId) {
            console.log("Logged in User ID:", loggedInUserId);
            const docRef = doc(db, "users", loggedInUserId);
            
            getDoc(docRef)
                .then((docSnap) => {
                    if (docSnap.exists()) {
                        const userData = docSnap.data();
                        document.getElementById('loggedUserFName').innerText = userData.firstName || "N/A";
                        document.getElementById('loggedUserLName').innerText = userData.lastName || "N/A";
                        document.getElementById('loggedUserEmail').innerText = userData.email || "N/A";
                    } else {
                        console.log("No document found matching ID");
                    }
                })
                .catch((error) => {
                    console.log("Error getting document:", error);
                });
        } else {
            console.log("User ID not found in Local Storage");
        }
    } else {
        console.log("No user is signed in");
    }
});
