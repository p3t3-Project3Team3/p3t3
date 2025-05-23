import { useState } from 'react';
// import { useQuery } from '@apollo/client';
// import { QUERY_ALL_DECKS } from '../utils/queries';
// import { useNavigate } from 'react-router-dom';
import "../css/games.css"; // Adjust the path if needed
import SelectDeck from '../components/SelectDeck'; // Adjust the path if needed




const Game = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  if (selectedGame) {
    return <SelectDeck gamePath={selectedGame} />
  }
  // const [selectDeck, setSelectDeck] = useState(false);
  // const navigate = useNavigate();

  // const { data, loading } = useQuery(QUERY_ALL_DECKS);
  // const decks = data?.getAllDecks || [];

  // const handleGameSelect = (game: string) => {
  //   setSelectedGame(game);
  //   setSelectDeck(true);
  // };

  // const handleDeckSelect = (deckId: string) => {
  //   if (deckId !== undefined) {
  //     navigate(`/game/${selectedGame}/${deckId}`);
  //   } else {
  //     console.error("No deck Found");
  //   }
  // };


  return (
  <main>
      <div>
        <h1>Select a Game!</h1>
        <h2 onClick={() => setSelectedGame("flashcard")}>Flashcard Game</h2>
        <h2 onClick={() => setSelectedGame("matching")}>Matching Game</h2>
        <h2 onClick={() => setSelectedGame("crossword")}>Crossword Game</h2>
      </div>
{/* 
      {selectDeck && (
        <div className="deck-select-modal">
          <h1>Select a Deck for {selectedGame}!</h1>
          {loading ? (
            <p>Loading decks...</p>
          ) : (
            decks.map((deck: any) => (
              <div key={deck._id} onClick={() => handleDeckSelect(deck._id)}>
                <h2>{deck.title}</h2>
                <p>{deck.description}</p>
              </div>
            ))
          )}
          <button onClick={() => setSelectDeck(false)}>Back to Game Selection</button>
        </div> */}
      {/* )} */}
  </main>
  );
}
export default Game;