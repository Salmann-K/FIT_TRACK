// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, setDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQ-SzneOPvJlRsViEp7oafP-QcUx3JlOM",
  authDomain: "fittrack-bff5b.firebaseapp.com",
  projectId: "fittrack-bff5b",
  storageBucket: "fittrack-bff5b.appspot.com",
  messagingSenderId: "531769032525",
  appId: "1:531769032525:web:ac070719efe67924450104"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Function to store user data in localStorage
function storeUserData(userData) {
  localStorage.setItem("loggedInUser", JSON.stringify(userData));
}

// Function to retrieve user data
export function getUserData() {
  return JSON.parse(localStorage.getItem("loggedInUser"));
}

// Function to check if user is logged in
export function isUserLoggedIn() {
  return localStorage.getItem("loggedInUser") !== null;
}

// 🔹 SIGNUP FUNCTION
document.querySelector("#signup form")?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("rEmail").value.trim();
  const password = document.getElementById("rPassword").value.trim();
  const firstName = document.getElementById("fName").value.trim();
  const lastName = document.getElementById("lName").value.trim();

  if (!email || !password || !firstName || !lastName) {
    alert("All fields are required!");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userData = {
      uid: user.uid,
      email,
      firstName,
      lastName,
      createdAt: new Date().toISOString(),
    };

    await setDoc(doc(db, "users", user.uid), userData);
    storeUserData(userData);  // Store user data in localStorage

    alert("Account Created Successfully!");
    window.location.href = "index.html";  // Redirect after successful login
  } catch (error) {
    console.error("Signup Error:", error);
    alert("Signup failed! Try again.");
  }
});

// 🔹 LOGIN FUNCTION
document.querySelector("#signIn form")?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please enter both email and password!");
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      storeUserData(userData);  // Store user data in localStorage

      alert("Login successful!");
      window.location.href = "../index.html";  // Redirect to dashboard
    } else {
      alert("User data not found!");
    }
  } catch (error) {
    console.error("Login Error:", error);
    alert("Incorrect Email or Password!");
  }
});

// 🔹 LOGOUT FUNCTION
document.getElementById("logoutBtn")?.addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");  // Remove user data from localStorage
  alert("Logged out successfully!");
  window.location.href = "index.html";  // Redirect to homepage
});
