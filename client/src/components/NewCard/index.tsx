// this component is used to create a new card
import { CardFront } from "../CardFront";
import { CardBack } from "../CardBack"; 


import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ALL_DECKS } from '../../utils/queries';
import { CREATE_FLASHCARD } from '../../utils/mutations';
import { useParams } from 'react-router-dom';


const NewCard = () => {
 const { id: id } = useParams();
  const { data, loading } = useQuery(QUERY_ALL_DECKS, {
    variables: { id: id },
  });

  const [createFlashcard] = useMutation(CREATE_FLASHCARD);

  const handleCreate = () => {
    createFlashcard({
      variables: {
        term: '',
        definition: '',
        deck: id,
      },
      refetchQueries: [{ query: QUERY_ALL_DECKS, variables: { id: id } }],
    });
  };

  if (loading) return <p>Loading...</p>;
  return (
    <>
    <h2>{data.getDeck.title}</h2>
      <div>
         <CardFront />
         <CardBack />
      </div>
      <button onClick={handleCreate}>Add Flashcard</button>
      <ul>
        {data.getDeck.flashcards.map((card: any) => (
          <li key={card._id}>
            {card.term}: {card.definition}
          </li>
        ))}
      </ul> 
    </> 
  );
};

export default NewCard;