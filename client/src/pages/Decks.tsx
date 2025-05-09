// import { useQuery } from '@apollo/client';
// import { Navigate } from 'react-router-dom';

// import { QUERY_PROFILES } from '../utils/queries';

// const Decks = () => {
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

//   return (
  //   <main>
  //     <div>
  //       <div>
  //         {loading ? (
  //           <div>Loading...</div>
  //         ) : (
  //           <h3>Your FlashCard Decks.</h3>
  //           <div>
  //               <div onClick={()=>handleDeckOpen()}><div/>
  //           <div/>
  //         )}
  //       </div>
  //     </div>
  //   </main>
  // );
// };

// export default Decks;
