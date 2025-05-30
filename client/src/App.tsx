// import './App.css';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { Outlet } from 'react-router-dom';
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from './components/Header';
import NavigationBar from './components/Nav/index';
import Footer from './components/Footer';
import { useContext } from 'react';
import { AuthProvider } from './utils/authContext';
// import LandingPage from './pages/LandingPage';
// import Home from './pages/Home';







const httpLink = createHttpLink({
   uri: import.meta.env.VITE_GRAPHQL_URI || '/graphql',
});

// Construct request middleware that will attach the JWT token to every request as an `authorization` header
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('id_token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});


const client = new ApolloClient({
  // Set up our client to execute the `authLink` middleware prior to making the request to our GraphQL API
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
        <AuthProvider>
    <ApolloProvider client={client}>
      <Header />
      <NavigationBar />
      {/* This will render the matched child route from main.tsx routing */}
      <Outlet />
      <Footer />
    </ApolloProvider>

        </AuthProvider>

  );
}

export default App;
