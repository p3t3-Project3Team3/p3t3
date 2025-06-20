import "../styles/AboutUS.css"; 

const About =() => {
  return(
    <main>
      <div className="about">
        <h1>About Us</h1>
        <p> Welcome to our project! </p>
        <section className="profiles">
        <div className="profile">
          <div className="image-and-network">
            <h3>Zawadi Brown</h3>
            <img  src="https://media.licdn.com/dms/image/v2/C5603AQGicxW5rlLP4w/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1656351109306?e=1749686400&v=beta&t=wFiNoaI2dSHq4CzeQ348oWdQEuvGeCUZhq_zV8vTPn4"
              alt="Zawadi Brown"className="profile-image"/>
            <a href="https://github.com/Zawadiflag12?tab=repositories"><i className="github icon"></i></a>
          </div>
          <div className="bio">
      <p>As an aspiring full-stack developer with a background in Allied Health, I bring a unique perspective to problem-solving, attention to detail, and user-centered design. My experience in healthcare has honed my ability to assess complex systems, identify inefficiencies, and implement solutions—skills that directly translate into developing intuitive and functional web applications.

</p> <br />
          </div>
        </div>
        <div className="profile">
          <div className="image-and-network">
            <h3>Seth Eggenburg</h3>
            <img src= 'https://avatars.githubusercontent.com/u/190832220?v=4&size=64' alt="Seth Eggenburg" className="profile-image"/>
            <a href="https://github.com/SethEggz"><i className="github icon"></i></a>
          </div>
          <div className="bio">
          <p>Seth  Likes solving problems and building things. Is currently in a full stack coding class. He knows TS, JS, HTML, SQL, and CSS. he will be learning  python as well. Seth spends his free time playing games like Magic: The Gathering, Baltro, Fallout 76 and more. hates render</p></div>
        </div> <br />
        <div className="profile">
          <div className="image-and-network">
            <h3>Christopher Lin</h3>
            <img src= 'https://ca.slack-edge.com/T080710S2SD-U0851CBST88-5ee7a9cf7865-512' alt="Christopher Lin" className="profile-image"/>
            <a href="https://github.com/christophermlin"><i className="github icon"></i></a>
          </div>
          <div className="bio">
            <p>Christopher is a creative first and foremost, with training in jazz piano, voice, and guitar, and worked in fine dining before pivoting towards a software development career.</p>
          </div>
        </div> <br />
        <div className="profile">
          <div className="image-and-network">
            <h3>Kirstin Lisnoff</h3>
            <img src= 'https://media.licdn.com/dms/image/v2/D4E03AQGqEi_qoti3bA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1728847838434?e=1754524800&v=beta&t=LtD6zrYh-A5O1COvhJXOT6YYzLZEQf3DBULkEyo2XY4' alt="Kirstin Lisnoff" className="profile-image"/>
            <a href="https://github.com/kirstinlisnoff"><i className="github icon"></i></a>
          </div>
          <div className="bio">
          <p>Kirstin is a highly motivated aspiring software developer with a foundation in full-stack web development and strong problem-solving skills. With several years of service experience and a Bachelor's degree in Mathematical Sciences, she brings sharp attention to detail, a collaborative mindset, and a passion for continuous learning. </p></div>
        </div>
       </section>
      </div>
    </main>
  );
};

export default About;