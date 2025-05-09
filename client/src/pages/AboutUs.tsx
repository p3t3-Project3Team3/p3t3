// import "../styles/AboutUS.css";

const About =() => {
  return(
    <div className="about">
      <h1>About Us</h1>
      <p> Welcome to our project! We are a team of passionate web developers who created this site to showcase the skills and technologies we've been learning in class. This project reflects our commitment to continuous learning, collaboration, and creativity in the world of web development. We’ve included links to our GitHub profiles so you can explore our work, follow our progress, and see how we bring ideas to life through code. Thank you for visiting — we look forward to connecting with you!</p>
      <section className="profiles">
      <div className="profile">
        <div className="image-and-network">
          <h3>Zawadi Brown</h3>
          <img  src="https://media.licdn.com/dms/image/v2/C5603AQGicxW5rlLP4w/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1656351109306?e=1749686400&v=beta&t=wFiNoaI2dSHq4CzeQ348oWdQEuvGeCUZhq_zV8vTPn4"
            alt="Zawadi Brown"className="profile-image"/>
          <a href="https://github.com/Zawadiflag12?tab=repositories"><img className="mini-logo" src="https://logos-world.net/wp-content/uploads/2020/11/GitHub-Symbol.png" /></a>
        </div>
        <div className="bio">
          <p>As an aspiring full-stack developer with a background in Allied Health, I bring a unique perspective to problem-solving, attention to detail, and user-centered design. My experience in healthcare has honed my ability to assess complex systems, identify inefficiencies, and implement solutions—skills that directly translate into developing intuitive and functional web applications.</p>
        </div>
      </div>
      <div className="profile">
        <div className="image-and-network">
          <h3>Seth Eggenburg</h3>
          <img src= 'https://avatars.githubusercontent.com/u/190832220?v=4&size=64' alt="Seth Eggenburg" className="profile-image"/>
          <a href="https://github.com/SethEggz"><img className="mini-logo" src="https://logos-world.net/wp-content/uploads/2020/11/GitHub-Symbol.png" /></a>
        </div>
        <div className="bio">
        <p>Seth  Likes solving problems and building things. Is currently in a full stack coding class. He knows TS, JS, HTML, SQL, and CSS. he will be learning  python as well. Seth spends his free time playing games like Magic: The Gathering, Baltro, Fallout 76 and more.</p></div>
      </div>
      <div className="profile">
        <div className="image-and-network">
          <h3>Christopher Lin</h3>
          <img src='' alt="Christopher Lin" className="profile-image"/>
          <a href="http://github.com/christophermlin"><img className="mini-logo" src="https://logos-world.net/wp-content/uploads/2020/11/GitHub-Symbol.png" /></a>
        </div>
        <div className="bio">
        <p>...</p></div>
      </div>
      <div className="profile">
        <div className="image-and-network">
          <h3>Kristin Lisnoff</h3>
          <img src="https://avatars.githubusercontent.com/u/102912613?v=4" alt="Kristin Lisnoff" className="profile-image"/>
          <a href="https://github.com/kirstinlisnoff"><img className="mini-logo" src="https://logos-world.net/wp-content/uploads/2020/11/GitHub-Symbol.png" /></a>
        </div>
        <div className="bio">
        <p>...</p>
        </div>

      </div>
     </section>
    </div>
  );
};

export default About;