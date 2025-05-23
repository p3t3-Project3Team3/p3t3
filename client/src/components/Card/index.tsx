// import { useState } from "react";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import "./Card.css";

// interface CardProps {
//   term: string;
//   definition: string;
//   cardId?: string;
//   deckId?: string;
//   showButtons?: boolean;
// }

// const Card: React.FC<CardProps> = ({ 
//   term, 
//   definition, 
//   cardId, 
//   deckId, 
//   showButtons = true 
// }) => {
//   const [flipped, setFlipped] = useState(false);
//   const navigate = useNavigate();

//   const handleFlip = () => {
//     setFlipped(!flipped);
//   };

//   const cardVariants = {
//     front: { rotateY: 0 },
//     back: { rotateY: 180 },
//   };

//   const cardTransition = {
//     duration: 0.6,
//     type: "spring",
//     stiffness: 300,
//     damping: 20,
//   };

//   const routeEdit = () => {
//     if (cardId && deckId) {
//       navigate(`/deck/${deckId}/card/${cardId}/edit`);
//     } else {
//       navigate('EditCard');
//     }
//   };

//   const routeNew = () => {
//     if (deckId) {
//       navigate(`/deck/${deckId}/new-card`);
//     } else {
//       navigate('NewCard');
//     }
//   };

//   return (
//     <div className="flex flex-col items-center space-y-4">
//       {/* Card Container */}
//       <div className="relative w-80 h-48 card-container">
//         <motion.div
//           className="absolute inset-0 w-full h-full cursor-pointer card-3d"
//           initial={flipped ? "back" : "front"}
//           animate={flipped ? "back" : "front"}
//           variants={cardVariants}
//           transition={cardTransition}
//           onClick={handleFlip}
//         >
//           {/* Front of Card */}
//           <div className="absolute inset-0 w-full h-full card-face">
//             <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg card-shadow flex items-center justify-center p-6">
//               <div className="text-center">
//                 <div className="text-white text-xs uppercase tracking-wide mb-2 opacity-75">
//                   Term
//                 </div>
//                 <div className="text-white text-lg font-medium leading-tight">
//                   {term || "Click to add term..."}
//                 </div>
//                 <div className="text-white text-xs mt-4 opacity-75">
//                   Click to flip
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Back of Card */}
//           <div className="absolute inset-0 w-full h-full card-face card-back">
//             <div className="w-full h-full bg-gradient-to-br from-green-500 to-green-600 rounded-lg card-shadow flex items-center justify-center p-6">
//               <div className="text-center">
//                 <div className="text-white text-xs uppercase tracking-wide mb-2 opacity-75">
//                   Definition
//                 </div>
//                 <div className="text-white text-lg font-medium leading-tight">
//                   {definition || "Click to add definition..."}
//                 </div>
//                 <div className="text-white text-xs mt-4 opacity-75">
//                   Click to flip back
//                 </div>
//               </div>
//             </div>
//           </div>
//         </motion.div>
//       </div>

//       {/* Status Indicator */}
//       <div className="text-sm text-gray-600">
//         Showing: <span className="font-medium">{flipped ? "Definition" : "Term"}</span>
//       </div>

//       {/* Action Buttons */}
//       {showButtons && (
//         <div className="flex space-x-3">
//           <button 
//             onClick={handleFlip} 
//             className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-md transition-colors"
//           >
//             Flip
//           </button>
//           <button 
//             onClick={routeEdit} 
//             className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-md transition-colors"
//           >
//             Edit
//           </button>
//           <button 
//             onClick={routeNew} 
//             className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-md transition-colors"
//           >
//             New
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Card;