import { useLocation, useNavigate } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import '../../styles/Footer.css';


const Footer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleGoBack = () => {
    if(window.history.length > 1) { //Check if there is a previous page in the history stack
      navigate(-1);
    } else {
      navigate('/');
    }
  }
  
    const handleLoginClick = () => {
    navigate('/login');
  };
  
  return (
    <footer>
      <div className="footer">
        {location.pathname !== '/' && (
          <button className='go-back-button'
            onClick={handleGoBack}
          >
            &larr; Go Back
          </button>
        )}
        <div className="social-icons">
          <p><i className="instagram icon"></i></p>
          <p><i className="facebook icon"></i></p>
          {/* <p><i className="twitter icon"></i></p> */}
          <p><i className="youtube icon"></i></p>
           <p onClick={handleLoginClick} className="login-link">Login</p>
        </div>
        <h4>&copy; {new Date().getFullYear()} - Brain Games</h4>
      </div>
    </footer>
  );
};

export default Footer;
