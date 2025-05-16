// handles the card flip animation
import { useState } from "react";
import { motion } from "framer-motion";

import { CardFront } from "../CardFront";
import { CardBack } from "../CardBack"; 
import { useNavigate } from "react-router-dom";

const Card = () => {
  const [flipped, setFlipped] = useState(false);
  const handleFlip = () => {
    setFlipped(!flipped);
  };
  const cardVariants = {
    front: { rotateY: 0 },
    back: { rotateY: 180 },
  };
  const cardTransition = {
    duration: 0.6,
    type: "spring",
    stiffness: 300,
    damping: 20,
  };
    
  const navigate = useNavigate();
  const routeEdit = () => { 
    let path = `EditCard`; 
    navigate(path);
  }
  const routeNew = () => { 
    let path = `NewCard`; 
    navigate(path);
  }

  return (
    <div>
      <motion.div
        className="card"
        initial={flipped ? "back" : "front"}
        animate={flipped ? "back" : "front"}
        variants={cardVariants}
        transition={cardTransition}
      >
        <CardFront />
        <CardBack />
      </motion.div>
      <button onClick={handleFlip} className="ui violet button">Flip</button>
      <button onClick={routeEdit} className="ui violet button">Edit</button>
      <button onClick={routeNew} className="ui violet button">New</button>
    </div>
  );
}

export default Card;

