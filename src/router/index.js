import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "../views/LoginView.vue";
import LandingPageView from "../views/LandingPageView.vue";
import FolderView from "../views/FolderView.vue";
import FileView from "../views/FileView.vue";
import RecentView from "../views/RecentView.vue";

const routes = [
  {
    path: "/",
    name: "Login",
    component: LoginPage,
  },
  {
    path: "/landing",
    name: "landingPage",
    component: LandingPageView,
  },
  {
    path: "/file",
    name: "filePage",
    component: FileView,
  },
  {
    path: "/recent",
    name: "recentPage",
    component: RecentView,
  },
  {
    path: "/folder/:id",
    name: "FolderView",
    component: FolderView,
  },
];

// Create a new Vue Router instance
const router = createRouter({
  // Use the HTML5 history mode for cleaner URLs
  history: createWebHistory(),
  // Pass the routes configuration to the router
  routes,
});

// Define a function to check if the user is authenticated
const checkUserAuthentication = () => {
  // The user is considered authenticated if the 'isLoggedIn' item in the session storage is 'true'
  return sessionStorage.getItem("isLoggedIn") === "true";
};

// Add a global navigation guard
router.beforeEach((to, from, next) => {
  // Check if the route requires authentication
  if (to.name !== "Login" && !checkUserAuthentication()) {
    // If it does require authentication and the user is not authenticated, redirect to the login page
    next({ name: "Login" });
  } else {
    // If it doesn't require authentication, or if the user is authenticated, proceed
    next();
  }
});

export default router;
