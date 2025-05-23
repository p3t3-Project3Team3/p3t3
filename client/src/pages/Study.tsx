// // this is a page component for the study of the Flashcardsimport React, { useState, useEffect } from 'react';
// // // import { motion } from 'framer-motion';
// // import { useQuery } from '@apollo/client';
// // import { useParams, useNavigate } from 'react-router-dom';
// // import { QUERY_ALL_DECKS } from '../utils/queries';

// // interface Flashcard {
// //   _id: string;
// //   term: string;
// //   definition: string;
// // }

// // interface StudyStats {
// //   correct: number;
// //   incorrect: number;
// //   total: number;
// //   currentStreak: number;
// //   bestStreak: number;
// // }

// const StudyPage = {
//   return(
//     <>
//     </>
//   )
//   // const { id } = useParams<{ id: string }>();
//   // const navigate = useNavigate();
  
//   // // Apollo query for deck data
//   // const { data, loading, error } = useQuery(QUERY_ALL_DECKS, {
//   //   variables: { id: id },
//   // });

//   // // Study state
//   // const [currentCardIndex, setCurrentCardIndex] = useState(0);
//   // const [isFlipped, setIsFlipped] = useState(false);
//   // const [studyMode, setStudyMode] = useState<'sequential' | 'random' | 'incorrect'>('sequential');
//   // const [showAnswer, setShowAnswer] = useState(false);
//   // const [studyStats, setStudyStats] = useState<StudyStats>({
//   //   correct: 0,
//   //   incorrect: 0,
//   //   total: 0,
//   //   currentStreak: 0,
//   //   bestStreak: 0
//   // });
//   // const [incorrectCards, setIncorrectCards] = useState<Flashcard[]>([]);
//   // const [studyCards, setStudyCards] = useState<Flashcard[]>([]);
//   // const [isStudyComplete, setIsStudyComplete] = useState(false);

//   // // Initialize study cards when data loads
//   // useEffect(() => {
//   //   if (data?.getDeck?.flashcards) {
//   //     const cards = [...data.getDeck.flashcards];
//   //     if (studyMode === 'random') {
//   //       // Shuffle cards for random mode
//   //       for (let i = cards.length - 1; i > 0; i--) {
//   //         const j = Math.floor(Math.random() * (i + 1));
//   //         [cards[i], cards[j]] = [cards[j], cards[i]];
//   //       }
//   //     } else if (studyMode === 'incorrect' && incorrectCards.length > 0) {
//   //       setStudyCards(incorrectCards);
//   //       return;
//   //     }
//   //     setStudyCards(cards);
//   //     setCurrentCardIndex(0);
//   //     setIsFlipped(false);
//   //     setShowAnswer(false);
//   //   }
//   // }, [data, studyMode, incorrectCards]);

//   // // Card flip animation variants
//   // const cardVariants = {
//   //   front: { rotateY: 0 },
//   //   back: { rotateY: 180 },
//   // };

//   // const cardTransition = {
//   //   duration: 0.6,
//   //   type: "spring",
//   //   stiffness: 300,
//   //   damping: 20,
//   // };

//   // const handleFlip = () => {
//   //   setIsFlipped(!isFlipped);
//   //   setShowAnswer(true);
//   // };

//   // const handleAnswer = (isCorrect: boolean) => {
//   //   if (!showAnswer) return;

//   //   const newStats = { ...studyStats };
//   //   newStats.total += 1;
    
//   //   if (isCorrect) {
//   //     newStats.correct += 1;
//   //     newStats.currentStreak += 1;
//   //     newStats.bestStreak = Math.max(newStats.bestStreak, newStats.currentStreak);
//   //   } else {
//   //     newStats.incorrect += 1;
//   //     newStats.currentStreak = 0;
//   //     // Add to incorrect cards for review
//   //     const currentCard = studyCards[currentCardIndex];
//   //     if (!incorrectCards.find(card => card._id === currentCard._id)) {
//   //       setIncorrectCards([...incorrectCards, currentCard]);
//   //     }
//   //   }
    
//   //   setStudyStats(newStats);
//   //   nextCard();
//   // };

//   // const nextCard = () => {
//   //   if (currentCardIndex < studyCards.length - 1) {
//   //     setCurrentCardIndex(currentCardIndex + 1);
//   //     setIsFlipped(false);
//   //     setShowAnswer(false);
//   //   } else {
//   //     setIsStudyComplete(true);
//   //   }
//   // };

//   // const previousCard = () => {
//   //   if (currentCardIndex > 0) {
//   //     setCurrentCardIndex(currentCardIndex - 1);
//   //     setIsFlipped(false);
//   //     setShowAnswer(false);
//   //   }
//   // };

//   // const restartStudy = () => {
//   //   setCurrentCardIndex(0);
//   //   setIsFlipped(false);
//   //   setShowAnswer(false);
//   //   setIsStudyComplete(false);
//   //   setStudyStats({
//   //     correct: 0,
//   //     incorrect: 0,
//   //     total: 0,
//   //     currentStreak: 0,
//   //     bestStreak: 0
//   //   });
//   // };

//   // const switchStudyMode = (mode: 'sequential' | 'random' | 'incorrect') => {
//   //   if (mode === 'incorrect' && incorrectCards.length === 0) {
//   //     alert('No incorrect cards to review yet!');
//   //     return;
//   //   }
//   //   setStudyMode(mode);
//   //   restartStudy();
//   // };

//   // if (loading) return <div className="flex justify-center p-8"><p>Loading deck...</p></div>;
//   // if (error) return <div className="flex justify-center p-8 text-red-600"><p>Error: {error.message}</p></div>;
//   // if (!data?.getDeck) return <div className="flex justify-center p-8"><p>Deck not found</p></div>;

//   // const deck = data.getDeck;
//   // const currentCard = studyCards[currentCardIndex];

//   // if (isStudyComplete) {
//   //   return (
//   //     <div className="max-w-2xl mx-auto p-6 text-center">
//   //       <h1 className="text-3xl font-bold text-gray-800 mb-6">Study Complete! 🎉</h1>
        
//   //       <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//   //         <h2 className="text-xl font-semibold mb-4">Final Results</h2>
//   //         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//   //           <div className="bg-green-50 p-4 rounded">
//   //             <div className="text-2xl font-bold text-green-600">{studyStats.correct}</div>
//   //             <div className="text-sm text-green-700">Correct</div>
//   //           </div>
//   //           <div className="bg-red-50 p-4 rounded">
//   //             <div className="text-2xl font-bold text-red-600">{studyStats.incorrect}</div>
//   //             <div className="text-sm text-red-700">Incorrect</div>
//   //           </div>
//   //           <div className="bg-blue-50 p-4 rounded">
//   //             <div className="text-2xl font-bold text-blue-600">
//   //               {studyStats.total > 0 ? Math.round((studyStats.correct / studyStats.total) * 100) : 0}%
//   //             </div>
//   //             <div className="text-sm text-blue-700">Accuracy</div>
//   //           </div>
//   //           <div className="bg-purple-50 p-4 rounded">
//   //             <div className="text-2xl font-bold text-purple-600">{studyStats.bestStreak}</div>
//   //             <div className="text-sm text-purple-700">Best Streak</div>
//   //           </div>
//   //         </div>
//   //       </div>

//   //       <div className="space-y-3">
//   //         <button
//   //           onClick={restartStudy}
//   //           className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 w-full"
//   //         >
//   //           Study Again
//   //         </button>
          
//   //         {incorrectCards.length > 0 && (
//   //           <button
//   //             onClick={() => switchStudyMode('incorrect')}
//   //             className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 w-full"
//   //           >
//   //             Review Incorrect Cards ({incorrectCards.length})
//   //           </button>
//   //         )}
          
//   //         <button
//   //           onClick={() => navigate(`/deck/${id}`)}
//   //           className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 w-full"
//   //         >
//   //           Back to Deck
//   //         </button>
//   //       </div>
//   //     </div>
//   //   );
//   // }

//   // if (!currentCard) {
//   //   return <div className="flex justify-center p-8"><p>No cards to study</p></div>;
//   // }

//   // return (
//   //   <div className="max-w-4xl mx-auto p-6">
//   //     {/* Header */}
//   //     <div className="mb-6">
//   //       <h1 className="text-2xl font-bold text-gray-800 mb-2">Studying: {deck.title}</h1>
//   //       <div className="flex flex-wrap items-center justify-between">
//   //         <div className="text-gray-600">
//   //           Card {currentCardIndex + 1} of {studyCards.length}
//   //         </div>
//   //         <div className="flex items-center space-x-4 text-sm">
//   //           <span className="text-green-600">✓ {studyStats.correct}</span>
//   //           <span className="text-red-600">✗ {studyStats.incorrect}</span>
//   //           <span className="text-purple-600">🔥 {studyStats.currentStreak}</span>
//   //         </div>
//   //       </div>
//   //     </div>

//   //     {/* Study Mode Selector */}
//   //     <div className="mb-6">
//   //       <div className="flex flex-wrap gap-2">
//   //         <button
//   //           onClick={() => switchStudyMode('sequential')}
//   //           className={`px-4 py-2 rounded-md text-sm ${
//   //             studyMode === 'sequential' 
//   //               ? 'bg-blue-600 text-white' 
//   //               : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//   //           }`}
//   //         >
//   //           Sequential
//   //         </button>
//   //         <button
//   //           onClick={() => switchStudyMode('random')}
//   //           className={`px-4 py-2 rounded-md text-sm ${
//   //             studyMode === 'random' 
//   //               ? 'bg-blue-600 text-white' 
//   //               : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//   //           }`}
//   //         >
//   //           Random
//   //         </button>
//   //         <button
//   //           onClick={() => switchStudyMode('incorrect')}
//   //           disabled={incorrectCards.length === 0}
//   //           className={`px-4 py-2 rounded-md text-sm ${
//   //             studyMode === 'incorrect' 
//   //               ? 'bg-blue-600 text-white' 
//   //               : incorrectCards.length === 0
//   //               ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//   //               : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//   //           }`}
//   //         >  Review Incorrect ({incorrectCards.length})
//   //         </button>
//   //       </div>
//   //     </div>

//   //     {/* Progress Bar */}
//   //     <div className="mb-6">
//   //       <div className="bg-gray-200 rounded-full h-2">
//   //         <div 
//   //           className="bg-blue-600 h-2 rounded-full transition-all duration-300"
//   //           style={{ width: `${((currentCardIndex) / studyCards.length) * 100}%` }}
//   //         ></div>
//   //       </div>
//   //     </div>

//   //     {/* Flashcard */}
//   //     <div className="flex justify-center mb-8">
//   //       <div className="relative w-96 h-64" style={{ perspective: '1000px' }}>
//   //         <motion.div
//   //           className="absolute inset-0 w-full h-full cursor-pointer"
//   //           initial={isFlipped ? "back" : "front"}
//   //           animate={isFlipped ? "back" : "front"}
//   //           variants={cardVariants}
//   //           transition={cardTransition}
//   //           onClick={handleFlip}
//   //           style={{ transformStyle: "preserve-3d" }}
//   //         >
//   //           {/* Front of Card */}
//   //           <div 
//   //             className="absolute inset-0 w-full h-full"
//   //             style={{ backfaceVisibility: "hidden" }}
//   //           >
//   //             <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg flex items-center justify-center p-6">
//   //               <div className="text-center">
//   //                 <div className="text-white text-xs uppercase tracking-wide mb-4 opacity-75">
//   //                   Term
//   //                 </div>
//   //                 <div className="text-white text-xl font-medium leading-tight mb-4">
//   //                   {currentCard.term}
//   //                 </div>
//   //                 <div className="text-white text-sm opacity-75">
//   //                   Click to reveal answer
//   //                 </div>
//   //               </div>
//   //             </div>
//   //           </div>

//   //           {/* Back of Card */}
//   //           <div 
//   //             className="absolute inset-0 w-full h-full"
//   //             style={{ 
//   //               backfaceVisibility: "hidden",
//   //               transform: "rotateY(180deg)"
//   //             }}
//   //           >
//   //             <div className="w-full h-full bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg flex items-center justify-center p-6">
//   //               <div className="text-center">
//   //                 <div className="text-white text-xs uppercase tracking-wide mb-4 opacity-75">
//   //                   Definition
//   //                 </div>
//   //                 <div className="text-white text-xl font-medium leading-tight">
//   //                   {currentCard.definition}
//   //                 </div>
//   //               </div>
//   //             </div>
//   //           </div>
//   //         </motion.div>
//   //       </div>
//   //     </div>

//   //     {/* Answer Buttons */}
//   //     {showAnswer && (
//   //       <div className="flex justify-center space-x-4 mb-6">
//   //         <button
//   //           onClick={() => handleAnswer(false)}
//   //           className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 flex items-center gap-2"
//   //         >
//   //           ✗ Incorrect
//   //         </button>
//   //         <button
//   //           onClick={() => handleAnswer(true)}
//   //           className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 flex items-center gap-2"
//   //         >
//   //           ✓ Correct
//   //         </button>
//   //       </div>
//   //     )}

//   //     {/* Navigation */}
//   //     <div className="flex justify-between items-center">
//   //       <button
//   //         onClick={previousCard}
//   //         disabled={currentCardIndex === 0}
//   //         className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
//   //       >
//   //         Previous
//   //       </button>

//   //       <button
//   //         onClick={() => navigate(`/deck/${id}`)}
//   //         className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
//   //       >
//   //         Exit Study
//   //       </button>

//   //       <button
//   //         onClick={nextCard}
//   //         disabled={currentCardIndex === studyCards.length - 1}
//   //         className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
//   //       >
//   //         Skip
//   //       </button>
//   //     </div>
//     // </div>
// };

// export default StudyPage;