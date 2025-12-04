import { useGameLogic } from './hooks/useGameLogic';
import ScoreBoard from './components/ScoreBoard';
import GameControls from './components/GameControls';
import GameField from './components/GameField';

function App() {
  const {
    numericalString,
    userScore,
    pcScore,
    currentPlayer,
    gameStatus,
    winner,
    startGame,
    performMove,
  } = useGameLogic();

  return (
    <div className="game-container">
      <h1>Numeric String Game</h1>

      <div className="card">
        <ScoreBoard userScore={userScore} pcScore={pcScore} currentPlayer={currentPlayer} />

        <GameControls onStart={startGame} isPlaying={gameStatus === 'PLAYING'} />

        {gameStatus !== 'IDLE' && (
          <GameField
            numericalString={numericalString}
            onMove={performMove}
            currentPlayer={currentPlayer}
          />
        )}

        {gameStatus === 'FINISHED' && (
          <div className="winner-banner">Game Over! Winner: {winner}</div>
        )}
      </div>
    </div>
  );
}

export default App;
