import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import AuthService from "./utils/auth"; 

import App from "./App.jsx";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Error from "./pages/Error";
import About from "./pages/AboutUs";
import FlashCards from "./pages/FlashCard.js";
import Matching from "./pages/Matching";
import Crossword from "./pages/Crossword";
import Game from "./pages/Game";
import Decks from "./pages/Decks";
import NewCard from "./components/NewCard/index";
import LandingPage from "./pages/LandingPage";
// import Study from "./pages/Study";
import DeckDetail from "./components/Decks/details.js";
import "./index.css";



const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <LandingPage />
      },
      {
        path: "/Home",
        element: <Home />
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/signup",
        element: <Signup />

      },
      {
        path: "/profiles/:profileId",
        element: <Profile />
      },
      {
        path: "/me",
        element: <Profile />
      },
      {
        path: "/flashcard/:deckId/flashCards",
        element: <FlashCards />
      },
      {
        path: "/matching/:deckId",
        element: <Matching />
      },
      {
        path: "/crossword/:deckId",
        element: <Crossword />,
      },
      {
        path:'/game/flashCards/Decks',
        element: <Decks/>
      },
       {
        path:'/flashCards/NewCard',
        element: <NewCard/>
      },
      {
        path: "/game",
        element: <Game />
      },
      {
        path: "/AboutUs",
        element: <About />
      },
      // { 
      //   path:"/deck/${deckId}/study",
      //   element: <Study />
      // },
      {
        path:"/decks/:Id",
        element: <DeckDetail />
      }
    ],
  },
]);

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<RouterProvider router={router} />);
}
