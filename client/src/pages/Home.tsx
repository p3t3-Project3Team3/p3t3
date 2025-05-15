import { useQuery } from '@apollo/client';
import 'semantic-ui-css/semantic.min.css';
import '../styles/Home.css';

import { QUERY_PROFILES } from '../utils/queries';

const Home = () => {
  const { loading, data } = useQuery(QUERY_PROFILES);
  const profiles = data?.profiles || [];

  return (
    <main>
      <div>
        <h1>Welcome to the Brain games Page</h1>
        <h4>This is the home page. It can display the games and the different decks here.</h4>
        {/* <div>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <h3>There are {profiles.length} users.</h3>
          )}
        </div> */}
        <div className='gameContainer'> 
          <div className="homeFlashcard">
            <h2>Flashcard Game</h2>
            <p>Test your knowledge with our flashcard game!</p>
            <button className="ui violet button">Play Now</button>
          </div>
          <div className="homeMatching">
            <h2>Matching Game</h2>
            <p>Test your knowledge with our Matching game!</p>
            <button className="ui violet button">Play Now</button>
          </div>
          <div className="homeCrossword">
            <h2>Crossword Game</h2>
            <p>Test your knowledge with our Crossword game!</p>
            <button className="ui violet button">Play Now</button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
