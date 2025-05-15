import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

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
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/profiles/:profileId",
        element: <Profile />,
      },
      {
        path: "/me",
        element: <Profile />,
      },
      {
        path: "/game/flashCards",
        element: <FlashCards />,
      },
      {
        path: "/game/matching",
        element: <Matching />,
      },
      {
        path: "/game/crossword",
        element: <Crossword />,
      },
      {
        path:'/game/flashCards/Decks',
        element: <Decks/>
      },
      // {
      //   path:'/flashCards/Decks/:deckId',
      //   element: <Deck/>
      // },
      // {
      //   path:'/flashCards/NewCard',
      //   element: <NewCard/>
      // },
      // {
      //   path:'/flashCards/NewDeck',
      //   element: <NewDeck/>
      // },
      // {
      //   path:'/flashCards/Decks/:deckId/Card/:cardId',
      //   element: <Card/>
      // },
      // {
      //   path:'/flashCards/Decks/:deckId/EditCard/:cardId',
      //   element: <EditCard/>
      // },
      // {
      //   path:'/flashCards/Decks/:deckId/EditDeck/:deckId',
      //   element: <EditDeck/>
      // },
      // {
      //   path:'/flashCards/Decks/:deckId/Study',
      //   element: <Study/>
      // },{
      //   path:'/flashCards/Decks/:deckId/Study/:cardId',
      //   element: <Study/>
      // },
      // {
      //   path:'/flashCards/Decks/:deckId/Study/New',
      //   element: <NewStudy/>
      // },
      // {
      //   path:'/flashCards/Decks/:deckId/Game',
      //   element: <Game/>
      // },{
      //   path:'/flashCards/Decks/:deckId/Game/:cardId',
      //   element: <Game/>
      // },
      // {
      //   path:'/flashCards/Decks/:deckId/Game/New',
      //   element: <NewGame/>
      // },
      {
        path: "/game",
        element: <Game />,
      },
      {
        path: "/AboutUs",
        element: <About />,
      },
    ],
  },
]);

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<RouterProvider router={router} />);
}
