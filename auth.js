// Function to store user data in localStorage
export function storeUserData(userData) {
    localStorage.setItem("loggedInUser", JSON.stringify(userData));
  }
  
  // Function to retrieve logged-in user data
  export function getUserData() {
    return JSON.parse(localStorage.getItem("loggedInUser"));
  }
  
  // Function to check if user is logged in
  export function isUserLoggedIn() {
    return localStorage.getItem("loggedInUser") !== null;
  }
  
  // Function to log out user
  export function logoutUser() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "index.html"; // Redirect to login page
  }
  