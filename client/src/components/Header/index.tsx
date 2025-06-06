import { useState, useEffect } from 'react';
import "../../styles/Header.css"
import 'semantic-ui-css/semantic.min.css';

const Header = () => {
 

  //darkmode button
  const [darkMode, setDarkMode] = useState(() => {
    // Initialize dark mode based on localStorage
    return localStorage.getItem('darkMode') === 'true';
  });

 useEffect(() => {
    // Set class on initial load
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };



  return (
    <header>
      <button onClick={toggleDarkMode}>
        <i className={`${darkMode ? 'moon icon' : 'sun icon'} touchable`}></i>
      </button>
      <h1>Study Quest</h1>
    </header>
  );
};

export default Header;