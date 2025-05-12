import { useQuery } from '@apollo/client';

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
      </div>
    </main>
  );
};

export default Home;
