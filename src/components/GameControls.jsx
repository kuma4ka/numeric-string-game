import { useState } from 'react';
import styles from './GameControls.module.css';
import { MIN_LENGTH, MAX_LENGTH } from '../utils/gameLogic';

const GameControls = ({ onStart, isPlaying }) => {
  const [length, setLength] = useState(20);

  const handleStart = () => {
    onStart(Number(length));
  };

  return (
    <div className={styles.container}>
      <input
        className={styles.input}
        type="number"
        min={MIN_LENGTH}
        max={MAX_LENGTH}
        value={length}
        onChange={(e) => setLength(e.target.value)}
        disabled={isPlaying}
      />
      <button onClick={handleStart}>{isPlaying ? 'Restart Game' : 'Start Game'}</button>
    </div>
  );
};

export default GameControls;
