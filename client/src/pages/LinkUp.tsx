import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import { useParams, useNavigate } from 'react-router-dom';
import { QUERY_SINGLE_DECK } from '../utils/queries';
import { StatsManager } from '../utils/StatsManager';
import { Flashcard } from '../interfaces/Flashcard';
import '../styles/LinkUp.css';

interface Connection {
  termId: string;
  definitionId: string;
  isCorrect: boolean;
}

interface Position {
  x: number;
  y: number;
}

interface DrawingState {
  isDrawing: boolean;
  startPoint: Position | null;
  currentPoint: Position | null;
  startElementId: string | null;
  startElementType: 'term' | 'definition' | null;
}

interface GameStats {
  attempts: number;
  correct: number;
  timeElapsed: number;
  gameStarted: boolean;
  gameCompleted: boolean;
  startTime: number;
}

const LinkUp: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data, loading, error } = useQuery(QUERY_SINGLE_DECK, {
    variables: { id: id },
    skip: !id,
  });

  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [shuffledDefinitions, setShuffledDefinitions] = useState<Flashcard[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [drawingState, setDrawingState] = useState<DrawingState>({
    isDrawing: false,
    startPoint: null,
    currentPoint: null,
    startElementId: null,
    startElementType: null
  });

  const [gameStats, setGameStats] = useState<GameStats>({
    attempts: 0,
    correct: 0,
    timeElapsed: 0,
    gameStarted: false,
    gameCompleted: false,
    startTime: 0
  });

  const [statsUpdated, setStatsUpdated] = useState(false);

  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize flashcards when data loads
  useEffect(() => {
    if (data?.getSingleDeck?.flashcards) {
      const cards = data.getSingleDeck.flashcards.slice(0, 8); // Limit to 8 for better UX
      setFlashcards(cards);
      
      const shuffled = [...cards].sort(() => Math.random() - 0.5);
      setShuffledDefinitions(shuffled);
    }
  }, [data]);

  // Timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (gameStats.gameStarted && !gameStats.gameCompleted) {
      interval = setInterval(() => {
        setGameStats(prev => ({
          ...prev,
          timeElapsed: Math.floor((Date.now() - prev.startTime) / 1000)
        }));
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameStats.gameStarted, gameStats.gameCompleted]);

  // Check if game is completed and update stats
  useEffect(() => {
    if (flashcards.length > 0 && connections.length === flashcards.length && connections.every(conn => conn.isCorrect)) {
      setGameStats(prev => {
        const newStats = { ...prev, gameCompleted: true };
        
        // Update global stats only once when game is completed
        if (!statsUpdated && prev.gameStarted) {
          const isPerfect = newStats.attempts === flashcards.length; // Perfect = minimum attempts
          
          StatsManager.updateLinkUpStats({
            completed: true,
            timeElapsed: newStats.timeElapsed,
            attempts: newStats.attempts,
            correct: newStats.correct,
            totalCards: flashcards.length,
            perfect: isPerfect
          });
          
          setStatsUpdated(true);
        }
        
        return newStats;
      });
    }
  }, [connections, flashcards.length, statsUpdated]);

  const getElementCenter = (elementId: string): Position | null => {
    const element = document.getElementById(elementId);
    if (!element || !containerRef.current) return null;

    const containerRect = containerRef.current.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    return {
      x: elementRect.left + elementRect.width / 2 - containerRect.left,
      y: elementRect.top + elementRect.height / 2 - containerRect.top
    };
  };

  // Get coordinates from either mouse or touch event
  const getEventCoordinates = (e: MouseEvent | TouchEvent) => {
    if ('touches' in e) {
      // Touch event
      const touch = e.touches[0] || e.changedTouches[0];
      return { clientX: touch.clientX, clientY: touch.clientY };
    } else {
      // Mouse event
      return { clientX: e.clientX, clientY: e.clientY };
    }
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent, elementId: string, elementType: 'term' | 'definition') => {
    e.preventDefault();
    
    // Start game on first interaction
    if (!gameStats.gameStarted) {
      setGameStats(prev => ({
        ...prev,
        gameStarted: true,
        startTime: Date.now()
      }));
    }

    const startPoint = getElementCenter(elementId);
    if (!startPoint) return;

    setDrawingState({
      isDrawing: true,
      startPoint,
      currentPoint: startPoint,
      startElementId: elementId,
      startElementType: elementType
    });
  };

  const handleMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!drawingState.isDrawing || !containerRef.current) return;

    e.preventDefault();
    const coordinates = getEventCoordinates(e);
    const containerRect = containerRef.current.getBoundingClientRect();
    const currentPoint = {
      x: coordinates.clientX - containerRect.left,
      y: coordinates.clientY - containerRect.top
    };

    setDrawingState(prev => ({
      ...prev,
      currentPoint
    }));
  }, [drawingState.isDrawing]);

  const handleEnd = useCallback((e: MouseEvent | TouchEvent) => {
    if (!drawingState.isDrawing) return;

    e.preventDefault();
    const coordinates = getEventCoordinates(e);
    
    // Find the element at the end position
    const elementAtPoint = document.elementFromPoint(coordinates.clientX, coordinates.clientY);
    const endElementId = elementAtPoint?.id || elementAtPoint?.closest('[id]')?.id;
    
    if (endElementId && drawingState.startElementId && endElementId !== drawingState.startElementId) {
      const endElementType = endElementId.startsWith('term-') ? 'term' : 'definition';
      
      // Only allow connections between different types
      if (drawingState.startElementType !== endElementType) {
        createConnection(drawingState.startElementId, endElementId, drawingState.startElementType!);
      }
    }

    setDrawingState({
      isDrawing: false,
      startPoint: null,
      currentPoint: null,
      startElementId: null,
      startElementType: null
    });
  }, [drawingState]);

  // Add event listeners for both mouse and touch
  useEffect(() => {
    if (drawingState.isDrawing) {
      // Mouse events
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleEnd);
      
      // Touch events
      document.addEventListener('touchmove', handleMove, { passive: false });
      document.addEventListener('touchend', handleEnd, { passive: false });
    }

    return () => {
      // Mouse events
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      
      // Touch events
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [drawingState.isDrawing, handleMove, handleEnd]);

  const createConnection = (startId: string, endId: string, startType: 'term' | 'definition') => {
    // Remove any existing connections for these elements
    setConnections(prev => prev.filter(conn => 
      (startType === 'term' ? conn.termId !== startId : conn.definitionId !== startId) &&
      (startType === 'definition' ? conn.termId !== endId : conn.definitionId !== endId)
    ));

    const termId = startType === 'term' ? startId : endId;
    const definitionId = startType === 'definition' ? startId : endId;

    // Extract the flashcard IDs
    const termFlashcardId = termId.replace('term-', '');
    const definitionFlashcardId = definitionId.replace('definition-', '');

    const isCorrect = termFlashcardId === definitionFlashcardId;

    const newConnection: Connection = {
      termId,
      definitionId,
      isCorrect
    };

    setConnections(prev => [...prev, newConnection]);
    setGameStats(prev => ({
      ...prev,
      attempts: prev.attempts + 1,
      correct: isCorrect ? prev.correct + 1 : prev.correct
    }));
  };

  const clearConnections = () => {
    setConnections([]);
    setGameStats(prev => ({
      ...prev,
      attempts: 0,
      correct: 0
    }));
  };

  const resetGame = () => {
    // If a game was started but not completed, record it in stats
    if (gameStats.gameStarted && !gameStats.gameCompleted && !statsUpdated) {
      StatsManager.updateLinkUpStats({
        completed: false,
        timeElapsed: gameStats.timeElapsed,
        attempts: gameStats.attempts,
        correct: gameStats.correct,
        totalCards: flashcards.length,
        perfect: false
      });
    }

    setConnections([]);
    if (flashcards.length > 0) {
      const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
      setShuffledDefinitions(shuffled);
    }
    setGameStats({
      attempts: 0,
      correct: 0,
      timeElapsed: 0,
      gameStarted: false,
      gameCompleted: false,
      startTime: 0
    });
    setStatsUpdated(false);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getConnectionColor = (connection: Connection): string => {
    return connection.isCorrect ? '#10b981' : '#ef4444';
  };

  const getElementConnectionStatus = (elementId: string): 'correct' | 'incorrect' | 'none' => {
    const connection = connections.find(conn => conn.termId === elementId || conn.definitionId === elementId);
    if (!connection) return 'none';
    return connection.isCorrect ? 'correct' : 'incorrect';
  };

  if (loading) {
    return (
      <div className="linkup-container">
        <div className="loading-state">
          Loading flashcards...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="linkup-container">
        <div className="error-state">
          Error loading deck: {error.message}
          <br />
          <button 
            onClick={() => navigate('/game/flashCards/Decks')}
            className="control-button ui red button touchable"
            style={{ marginTop: '1rem' }}
          >
            Back to Decks
          </button>
        </div>
      </div>
    );
  }

  if (!data?.getSingleDeck || !flashcards.length) {
    return (
      <div className="linkup-container">
        <div className="error-state">
          No flashcards available for this deck.
          <br />
          <button 
            onClick={() => navigate('/game/flashCards/Decks')}
            className="control-button ui red button touchable"
            style={{ marginTop: '1rem' }}
          >
            Back to Decks
          </button>
        </div>
      </div>
    );
  }

  const deck = data.getSingleDeck;

  return (
    <div className="linkup-container">
      {/* Header */}
      <div className="linkup-header">
        <h1 className="linkup-title">Line Matching Game</h1>
        <p className="linkup-subtitle">
          Draw lines to connect terms with their correct definitions from: <strong>{deck.title}</strong>
        </p>
        <p className="mobile-instructions">
          On mobile: Touch and drag from a term to its matching definition
        </p>
      </div>

      {/* Game Stats */}
      <div className="game-stats">
        <div className="stat-item stat-item-blue">
          <div className="stat-value stat-value-blue">{gameStats.attempts}</div>
          <div className="stat-label stat-label-blue">Attempts</div>
        </div>
        <div className="stat-item stat-item-green">
          <div className="stat-value stat-value-green">{gameStats.correct}</div>
          <div className="stat-label stat-label-green">Correct</div>
        </div>
        <div className="stat-item stat-item-purple">
          <div className="stat-value stat-value-purple">{formatTime(gameStats.timeElapsed)}</div>
          <div className="stat-label stat-label-purple">Time</div>
        </div>
        <div className="stat-item stat-item-orange">
          <div className="stat-value stat-value-orange">
            {flashcards.length > 0 ? Math.round((gameStats.correct / flashcards.length) * 100) : 0}%
          </div>
          <div className="stat-label stat-label-orange">Progress</div>
        </div>
      </div>

      {/* Controls */}
      <div className="game-controls">
        <button
          onClick={clearConnections}
          className="control-button ui red button touchable"
        >
          Clear Lines
        </button>
        <button
          onClick={resetGame}
          className="control-button ui yellow button touchable"
        >
          New Game
        </button>
        
        <button
          onClick={() => navigate(`/deck/${id}`)}
          className="control-button ui red button touchable"
        >
          Back to Deck
        </button>
      </div>

      {/* Game Completed Message */}
      {gameStats.gameCompleted && (
        <div className="game-completed">
          <h3 className="completed-title">🎉 Congratulations!</h3>
          <p>
            You've matched all terms correctly in {formatTime(gameStats.timeElapsed)} with {gameStats.attempts} attempts!
            {gameStats.attempts === flashcards.length && (
              <span style={{ color: '#f59e0b', fontWeight: 'bold' }}> Perfect game! ⭐</span>
            )}
          </p>
        </div>
      )}

      {/* Connection Status */}
      {connections.length > 0 && (
        <div className="connection-status">
          <div className="status-header">
            <span className="status-title">Connections Made:</span>
            <span className="status-count">{connections.length} / {flashcards.length}</span>
          </div>
          <div className="status-indicators">
            <div className="status-item">
              <div className="status-dot correct"></div>
              <span>Correct: {connections.filter(c => c.isCorrect).length}</span>
            </div>
            <div className="status-item">
              <div className="status-dot incorrect"></div>
              <span>Incorrect: {connections.filter(c => !c.isCorrect).length}</span>
            </div>
          </div>
        </div>
      )}

      {/* Game Area */}
      <div ref={containerRef} className="game-area">
        {/* SVG for drawing lines */}
        <svg
          ref={svgRef}
          className="game-svg"
        >
          {/* Draw existing connections */}
          {connections.map((connection, index) => {
            const startPoint = getElementCenter(connection.termId);
            const endPoint = getElementCenter(connection.definitionId);
            
            if (!startPoint || !endPoint) return null;

            const color = getConnectionColor(connection);
            const connectionNumber = index + 1;

            return (
              <g key={index}>
                {/* Shadow/outline for better visibility */}
                <line
                  x1={startPoint.x}
                  y1={startPoint.y}
                  x2={endPoint.x}
                  y2={endPoint.y}
                  stroke="rgba(0,0,0,0.3)"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
                {/* Main connection line */}
                <line
                  x1={startPoint.x}
                  y1={startPoint.y}
                  x2={endPoint.x}
                  y2={endPoint.y}
                  stroke={color}
                  strokeWidth="5"
                  strokeLinecap="round"
                  className="connection-line"
                />
                {/* Connection number in the middle */}
                <circle
                  cx={(startPoint.x + endPoint.x) / 2}
                  cy={(startPoint.y + endPoint.y) / 2}
                  r="12"
                  fill="white"
                  stroke={color}
                  strokeWidth="2"
                />
                <text
                  x={(startPoint.x + endPoint.x) / 2}
                  y={(startPoint.y + endPoint.y) / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="12"
                  fontWeight="bold"
                  fill={color}
                >
                  {connectionNumber}
                </text>
              </g>
            );
          })}

          {/* Draw current line being drawn */}
          {drawingState.isDrawing && drawingState.startPoint && drawingState.currentPoint && (
            <g>
              {/* Shadow for better visibility */}
              <line
                x1={drawingState.startPoint.x}
                y1={drawingState.startPoint.y}
                x2={drawingState.currentPoint.x}
                y2={drawingState.currentPoint.y}
                stroke="rgba(0,0,0,0.2)"
                strokeWidth="6"
                strokeDasharray="8,4"
              />
              {/* Main drawing line */}
              <line
                x1={drawingState.startPoint.x}
                y1={drawingState.startPoint.y}
                x2={drawingState.currentPoint.x}
                y2={drawingState.currentPoint.y}
                stroke="#3b82f6"
                strokeWidth="4"
                strokeDasharray="8,4"
                className="drawing-line"
              />
              {/* Start point indicator */}
              <circle
                cx={drawingState.startPoint.x}
                cy={drawingState.startPoint.y}
                r="6"
                fill="#3b82f6"
                opacity="0.8"
              />
            </g>
          )}
        </svg>

        {/* Game Content */}
        <div className="game-content">
          {/* Terms Column */}
          <div className="terms-column">
            <h3 className="column-title">Terms</h3>
            {flashcards.map((card) => {
              const elementId = `term-${card._id}`;
              const connectionStatus = getElementConnectionStatus(elementId);
              
              return (
                <div
                  key={card._id}
                  id={elementId}
                  className={`
                    game-item ${
                      connectionStatus === 'correct' ? 'game-item-correct' :
                      connectionStatus === 'incorrect' ? 'game-item-incorrect' :
                      'game-item-default'
                    }
                  `}
                  onMouseDown={(e) => handleStart(e, elementId, 'term')}
                  onTouchStart={(e) => handleStart(e, elementId, 'term')}
                >
                  <div className="term-text">{card.term}</div>
                </div>
              );
            })}
          </div>

          {/* Definitions Column */}
          <div className="definitions-column">
            <h3 className="column-title">Definitions</h3>
            {shuffledDefinitions.map((card) => {
              const elementId = `definition-${card._id}`;
              const connectionStatus = getElementConnectionStatus(elementId);
              
              return (
                <div
                  key={card._id}
                  id={elementId}
                  className={`
                    game-item ${
                      connectionStatus === 'correct' ? 'game-item-correct' :
                      connectionStatus === 'incorrect' ? 'game-item-incorrect' :
                      'game-item-default'
                    }
                  `}
                  onMouseDown={(e) => handleStart(e, elementId, 'definition')}
                  onTouchStart={(e) => handleStart(e, elementId, 'definition')}
                >
                  <div className="definition-text">{card.definition}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="instructions">
        <p className="instructions-text">
          Click and drag from a term to its matching definition to draw a connection line.
          <br />
          <span className="instruction-highlight">Green lines with ✓ = correct matches</span> • 
          <span className="instruction-highlight"> Red lines with ✗ = incorrect matches</span>
          <br />
          Connection numbers help you track which items are linked together.
        </p>
      </div>
    </div>
  );
};

export default LinkUp;