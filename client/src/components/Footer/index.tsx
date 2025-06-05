
import React from 'react';
import 'semantic-ui-css/semantic.min.css';



const Footer = (): React.ReactElement => {
  // const location = useLocation();


  
  
  return (
    <footer>
      <div className="footer">
       
        <div className="social-icons">
          <p><i className="instagram icon"></i></p>
          <p><i className="facebook icon"></i></p>
          <p><i className="twitter icon"></i></p>
          <p><i className="linkedin icon"></i></p>
          <p><i className="youtube icon"></i></p>
          
        </div>
        <h4>&copy; {new Date().getFullYear()} - StudyQuest</h4>
      </div>
    </footer>
  );
};

export default Footer;
