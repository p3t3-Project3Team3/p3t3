import { useState } from 'react';
// import { useQuery } from '@apollo/client';
// import { QUERY_ALL_DECKS } from '../utils/queries';
// import { useNavigate } from 'react-router-dom';
import "../styles/games.css"; // Adjust the path if needed
import SelectDeck from '../components/SelectDeck/index'; // Adjust the path if needed




const Game = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  if (selectedGame) {
    return <SelectDeck gamePath={selectedGame} />
  }
  

  return (
  <main>
      <div>
        <h1>Select a Game!</h1>
        <button className='ui violet button' onClick={() => setSelectedGame("flashcard")}>Flashcard Game</button><br/>
        <button className='ui violet button' onClick={() => setSelectedGame("matching")}>Matching Game</button><br/>
        <button className='ui violet button' onClick={() => setSelectedGame("crossword")}>Crossword Game</button>
      </div>
  </main>
  );
}
export default Game;