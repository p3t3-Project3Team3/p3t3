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
              {loginCheck && (
                <>
              <Nav.Link as={NavLink} to="/">
                Home
              </Nav.Link>
              <Nav.Link href="#features">Create Deck</Nav.Link>
              <Nav.Link as={NavLink} to="/game/flashCards/Decks">View Decks</Nav.Link>
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
                <NavDropdown.Item as={NavLink} to="game/FlashCards">
                  Flashcards
                </NavDropdown.Item>{" "}
                <br />
                <NavDropdown.Item as={NavLink} to="game/Matching">
                  Matching
                </NavDropdown.Item>{" "}
                <br />
                <NavDropdown.Item as={NavLink} to="game/Crossword">
                  Crosswords
                </NavDropdown.Item>{" "}
                <br />
              </NavDropdown>
              <Nav.Link as={NavLink} to="/AboutUs">
                About Us
              </Nav.Link>
              <Nav.Link as={NavLink} to="/leaderboard">Leaderboard
              </Nav.Link>
              </>
)}

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      
    </>
  );
};

export default NavigationBar;
