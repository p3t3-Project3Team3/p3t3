import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthService from "./utils/auth"; 

import App from "./App.jsx";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Error from "./pages/Error";
import About from "./pages/AboutUs";
import FlashCards from "./pages/FlashCard";
import Matching from "./pages/Matching";
import Crossword from "./pages/Crossword";
import Game from "./pages/Game";
import Decks from "./pages/Decks";
import NewCard from "./components/NewCard/index";
import LandingPage from "./pages/LandingPage";
import "./index.css";

function requireAuth() {
  if (!AuthService.loggedIn()) {
    return redirect("/login");
  }
  return null;
}

// Loader to redirect logged-in users away from auth pages & landing page
function redirectIfAuth() {
  if (AuthService.loggedIn()) {
    return redirect("/home");
  }
  return null;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <LandingPage />,
        loader: redirectIfAuth,
      },
      {
        index: true,
        element: <Home />,
        loader: requireAuth,
      },
      {
        path: "/login",
        element: <Login />,
        loader: redirectIfAuth,
      },
      {
        path: "/signup",
        element: <Signup />,
        loader: redirectIfAuth,

      },
      {
        path: "/profiles/:profileId",
        element: <Profile />,
        loader: requireAuth,
      },
      {
        path: "/me",
        element: <Profile />,
        loader: requireAuth,
      },
      {
        path: "/game/flashCards",
        element: <FlashCards />,
        loader: requireAuth,
      },
      {
        path: "/game/matching",
        element: <Matching />,
        loader: requireAuth,
      },
      {
        path: "/game/crossword",
        element: <Crossword />,
        loader: requireAuth,
      },
      {
        path:'/game/flashCards/Decks',
        element: <Decks/>,
        loader: requireAuth,
      },
       {
        path:'/flashCards/NewCard',
        element: <NewCard/>,
        loader: requireAuth,
      },
      {
        path: "/game",
        element: <Game />,
        loader: requireAuth,
      },
      {
        path: "/AboutUs",
        element: <About />,
        loader: requireAuth,
      },
    ],
  },
]);

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<RouterProvider router={router} />);
}
