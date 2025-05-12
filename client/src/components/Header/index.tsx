import { Link } from 'react-router-dom';
import { type MouseEvent} from 'react';
import Auth from '../../utils/auth';
import "./Header.css"
import 'semantic-ui-css/semantic.min.css';

const Header = () => {
  const logout = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    Auth.logout();
  };
  return (
    <header>
      <h1> Brain Games</h1>
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
