import '../styles/deck.css';
// import { useQuery } from '@apollo/client';
// import { Navigate } from 'react-router-dom';

// import { QUERY_PROFILES } from '../utils/queries';

const Decks = () => {
//   const { loading, data } = useQuery(QUERY_PROFILES);
//   const profiles = data?.profiles || [];
    
//     const handleDeckOpen = (deckId: string) => {
//         // Logic to open the deck goes here
//         if(deckId !== undefined) {
//             Navigate(`/decks/${deckId}`);
//         } else {
//             console.error("No deck Found");
//         }
//         console.log(`Opening deck ${deckId}`);
//     };

  return (
    <main>
      <div>
        <div>
          <h1>Welcome to your deck of FlashCards</h1>
        <div className="deckContainer">
            <div className='decks'>
              <h4> This is a placeholder for the CSS deck</h4>
              <button className="ui purple button"> Open deck</button>
              </div>
            <div className='decks'>
              <h4> This is a placeholder for the JavaScript deck</h4>
              <button className="ui purple button"> Open deck</button>
              </div>
            <div className='decks'>
              <h4> This is a placeholder for the TypeScript deck</h4>
              <button className="ui purple button"> Open deck</button>
              </div>
        </div>
          {/* {loading ? (
            <div>Loading...</div>
          ) : (
            <h3>Your FlashCard Decks.</h3>
            <div>
                <div onClick={()=>handleDeckOpen()}></div>
            </div>
          )} */}
        </div>
      </div>
    </main>
  );
};

export default Decks;
