import React from "react";

import Button from "../components/UI/Button";
import BlockContent from "../components/UI/Block";
import Block from "../components/UI/Block";
import { useNavigate } from "react-router-dom";
// import "./../styles/LandingPage.css"; // Import your CSS file for styling



export default function LandingPage() {
  const navigate = useNavigate();

      const routeSignUp = () => {
    navigate("/signup");
  };
   const routeLogin = () => {
    navigate("/login");
  };
  
  return (
    <div className="LandingPage">
      {/* Hero Section */}
      <div>
        <h1>Master Anything, One Game at a Time</h1>
        <p>Transform studying into a game. Create flashcards, play interactive games, and boost your learning.</p>
        <div>
          <Button variant="primary" className="ui violet button"onClick={routeSignUp}>Sign Up </Button>
          <Button variant="primary" className="ui violet button" onClick={routeLogin}>Log In</Button>
        </div>
      </div>

      {/* Key Features Section */}
      <div>
        <Block>
          <BlockContent>🎮 <h2>Play Your Way</h2>
          <p>Choose from multiple fun game modes to test your knowledge.</p></BlockContent>
        </Block>
        <Block>
          <BlockContent>📝 <h2>Create Custom Decks</h2>
          <p>Easily build flashcard decks on any subject.</p></BlockContent>
        </Block>
        <Block>
          <BlockContent>📊 <h2>Track Your Progress</h2>
          <p>Monitor your learning stats and see your improvement over time.</p></BlockContent>
        </Block>
      </div>

      {/* Testimonials Section */}
      <div>
        <h2>Why Learners Love Us</h2>
        <p>"This website made studying feel like a game! I’ve never enjoyed learning this much." – Alex S.</p>
        <p>"I aced my exams thanks to the flashcard games. Highly recommend it!" – Maya P.</p>
      </div>

      {/* Secure Access Section */}
      <div>
        <h2>Your Learning, Protected</h2>
        <p>Sign in or create an account to securely save your flashcard decks and track your progress.</p>
      </div>

    </div>
  );
}
