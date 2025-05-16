// import { redirect } from "react-router-dom";
// import AuthService from "./utils/auth"; // Adjust the import path

// // Loader that protects routes from unauthorized access
// export function requireAuth() {
//   if (!AuthService.loggedIn()) {
//     // User not logged in, redirect to login page
//     return redirect("/login");
//   }
//   // User is logged in, allow access
//   return null;
// }

// // Loader that redirects logged-in users away from public pages like Landing, Login, Signup
// export function redirectIfAuth() {
//   if (AuthService.loggedIn()) {
//     // User logged in, redirect to home page
//     return redirect("/home");
//   }
//   // User not logged in, allow access
//   return null;
// }
