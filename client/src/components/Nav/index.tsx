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

// import { useNavigate } from "react-router";

const NavigationBar = () => {
  //   const  navigate = useNavigate();
  const [loginCheck, setLoginCheck] = useState(false);

  const checkLogin = () => {
    if (auth.loggedIn()) {
      setLoginCheck(true);
    }
  };

  useEffect(() => {
    checkLogin();
  }, [loginCheck]);

  const [showDropdown, setShowDropdown] = useState(false);

  //   const goToLogin = () => {
  //     if (!auth.loggedIn()) {
  //       navigate('/login');
  //     }
  //   };

  //   const goToaddDeck = () => {
  //     if (auth.loggedIn()) {
  //       navigate('/flashcards/decks');
  //     }
  //   };

  //     const goToDecks = () => {
  //         if (auth.loggedIn()) {
  //             navigate('/flashcards/decks');
  //         }
  //         }

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          {/* <Navbar.Brand href="#home">My App</Navbar.Brand> */}
          {/* <Navbar.Toggle aria-controls="basic-navbar-nav" /> */}
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#pricing">
                <Login />{" "}
              </Nav.Link>
              <Nav.Link as={NavLink} to="/">
                Home
              </Nav.Link>
              <Nav.Link href="#features">Create Deck</Nav.Link>
              <Nav.Link href="#pricing">View Deck</Nav.Link>
              <NavDropdown
                title={
                  <NavLink
                    to="/game"
                    className="dropdown-title-link"
                    onClick={(e) => e.stopPropagation()} // prevents dropdown from toggling on click
                  >
                    Games
                  </NavLink>
                }
                id="games-dropdown"
                show={showDropdown}
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
              >
                <NavDropdown.Item as={NavLink} to="/FlashCards">
                  Flashcards
                </NavDropdown.Item>{" "}
                <br />
                <NavDropdown.Item as={NavLink} to="/Matching">
                  Matching
                </NavDropdown.Item>{" "}
                <br />
                <NavDropdown.Item as={NavLink} to="/Crossword">
                  Crosswords
                </NavDropdown.Item>{" "}
                <br />
              </NavDropdown>
              <Nav.Link as={NavLink} to="/AboutUs">
                About Us
              </Nav.Link>
              {loginCheck && (
  <Nav.Link as={NavLink} to="/leaderboard">Leaderboard</Nav.Link>
)}

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* <div className="nav-container">
        <div className="nav-links-container">
          <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>Home</NavLink>
          {loginCheck && (
            <NavLink to="/flashcards/decks" className={({ isActive }) => isActive ? "active" : ""}>flashcards</NavLink>
          )}
          {/* {loginCheck && (
            <NavLink to="/sell" className={({ isActive }) => isActive ? "active" : ""}></NavLink>
          )} */}
      {/* </div> */}
      {/* <div className="user-info">
          {loginCheck && (
           
              <svg xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30" fill="currentColor"
                className="bi bi-cart4"
                viewBox="0 0 20 20">
                <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5M3.14 5l.5 2H5V5zM6 5v2h2V5zm3 0v2h2V5zm3 0v2h1.36l.5-2zm1.11 3H12v2h.61zM11 8H9v2h2zM8 8H6v2h2zM5 8H3.89l.5 2H5zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0m9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0"/>
              </svg>
          )}</div>
          {!loginCheck ? (
            <NavLink className={({ isActive }) => isActive ? "active" : ""} to='/login'>Login</NavLink>
          ) : (
              <div onClick={() => auth.logout()}>
                <svg xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  fill="currentColor"
                  className="bi bi-door-closed"
                  viewBox="0 0 20 20">
                  <path d="M3 2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v13h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3zm1 13h8V2H4z"/>
                  <path d="M9 9a1 1 0 1 0 2 0 1 1 0 0 0-2 0"/>
                </svg>
              </div>
            )}
        </div> */}
    </>
  );
};

export default NavigationBar;
