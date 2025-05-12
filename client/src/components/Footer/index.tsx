import { useLocation, useNavigate } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import './Footer.css';

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
  
  return (
    <footer>
      <div>
        {location.pathname !== '/' && (
          <button
            onClick={handleGoBack}
          >
            &larr; Go Back
          </button>
        )}
        <div className="social-icons">
          <p><i className="instagram icon"></i></p>
          <p><i className="facebook icon"></i></p>
          <p><i className="twitter icon"></i></p>
          <p><i className="youtube icon"></i></p>
        </div>
        <h4>&copy; {new Date().getFullYear()} - Brain Games</h4>
      </div>
    </footer>
  );
};

export default Footer;
