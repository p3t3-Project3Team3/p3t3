// import { Link } from 'react-router-dom';
import { type MouseEvent, useState } from 'react';
// import Auth from '../../utils/auth';
import "./Header.css"
import 'semantic-ui-css/semantic.min.css';

const Header = () => {
  // const logout = (event: MouseEvent<HTMLButtonElement>) => {
  //   event.preventDefault();
  //   Auth.logout();
  // }; // Ensure this is used or remove it

  //darkmode button
  const [darkMode, setDarkMode] = useState(() => {
    // Initialize dark mode based on localStorage
    return localStorage.getItem('darkMode') === 'true';
  });

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.body.classList.toggle('dark', newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };


  return (
    <header>
      <button onClick={toggleDarkMode}>
          <i className={`${darkMode ? 'moon icon' : 'sun icon'}`}></i>
        </button>
      <h1> Study Games</h1>
      {/* <div>
        <Link to="/">
          <h2>
             link to home page goes here
          </h2>
        </Link>
        <div>
          {Auth.loggedIn() ? (
            <>
              <Link to="/me">
                View My Profile<i className="user icon"></i>
              </Link>
              <button onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                Login
              </Link>
              <Link to="/signup">
                Signup
              </Link>
            </>
          )}
        </div>
      </div> */}
    </header>
  );
};

export default Header;