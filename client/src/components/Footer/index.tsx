

import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import "../../styles/Footer.css";


const Footer = (): React.ReactElement => {
  const navigate = useNavigate();

  
  
  
  return (
    <footer>
      <div className="footer">
       
        <div className="social-icons">
          <p><i className="instagram icon"></i></p>
          <p><i className="facebook icon"></i></p>
          <p><i className="twitter icon"></i></p>
          <p><i className="linkedin icon"></i></p>
          <p onClick={() => window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank')}>
  <i className="youtube icon"></i>
</p>
          
        </div>
        <h4 onClick={() => navigate('/')}>&copy; {new Date().getFullYear()} - StudyQuest</h4>
      </div>
    </footer>
  );
};

export default Footer;
