// import 'semantic-ui-css/semantic.min.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from "react";
import auth from "../../utils/auth";
import { NavLink } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "../Nav/Nav.css";
import Login from "../../pages/Login";
import { useAuth } from '../../utils/authContext';

// import { useNavigate } from "react-router";

const NavigationBar = () => {
  //   const  navigate = useNavigate();
  const [loginCheck, setLoginCheck] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { isAuthenticated, username, logout } = useAuth();

  // const navigate = useNavigate();

 if (!isAuthenticated) {
    return null; 
  }
  // const checkLogin = () => {
  //   if (auth.loggedIn()) {
  //     setLoginCheck(true);
  //   }
  // };

// useEffect(() => {
//   if (auth.loggedIn()) {
//     setLoginCheck(true);
//     const profile = auth.getProfile();
//     setUsername(profile.data.username);
//   } else {
//     setLoginCheck(false);
//     setUsername("");
//   }
// }, []);

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/Home">
              Home
            </Nav.Link>
            <Nav.Link as={NavLink}to="/decks/createNewDeck">Create Deck</Nav.Link>
            <Nav.Link as={NavLink} to="/game/flashCards/Decks">
              View Decks
            </Nav.Link>
            <NavDropdown
              title={
                <NavLink
                  to="/game"
                  className="dropdown-title-link"
                  onClick={(e) => e.stopPropagation()}
                >
                  Games
                </NavLink>
              }
              id="games-dropdown"
            >
              <NavDropdown.Item as={NavLink} to="/game/FlashCards">
                Flashcards
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/game/Matching">
                Matching
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/game/Crossword">
                Crosswords
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link as={NavLink} to="/AboutUs">
              About Us
            </Nav.Link>
            <Nav.Link as={NavLink} to="/Stats">
              Stats
            </Nav.Link>
            <Nav.Link onClick={logout}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="currentColor"
                className="bi bi-door-closed"
                viewBox="0 0 20 20"
              >
                <path d="M3 2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v13h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3zm1 13h8V2H4z" />
                <path d="M9 9a1 1 0 1 0 2 0 1 1 0 0 0-2 0" />
              </svg>
              <span>{username}</span>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </>
  );
};

export default NavigationBar;
