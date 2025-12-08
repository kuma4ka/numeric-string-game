import { useState } from 'react';
import styles from './GameControls.module.css';
import { MIN_LENGTH, MAX_LENGTH, ALGORITHMS } from '../utils/constants';

const GameControls = ({ onStart, gameStatus, algorithm, onAlgorithmChange }) => {
  const [length, setLength] = useState(20);

  const handleChange = (e) => {
    setLength(e.target.value);
  };

  const handleStart = () => {
    let finalValue = Number(length);
    if (finalValue < MIN_LENGTH) finalValue = MIN_LENGTH;
    if (finalValue > MAX_LENGTH) finalValue = MAX_LENGTH;

    setLength(finalValue);
    onStart(finalValue);
  };

  const isLocked = gameStatus === 'PLAYING';

  const getButtonLabel = () => {
    if (gameStatus === 'PLAYING') return 'Restart';
    if (gameStatus === 'FINISHED') return 'Play Again';
    return 'Start';
  };

  return (
    <div className={styles.container}>
      <div className={styles.selectWrapper}>
        <select
          className={styles.select}
          value={algorithm}
          onChange={(e) => onAlgorithmChange(e.target.value)}
          disabled={isLocked}
        >
          <option value={ALGORITHMS.MINIMAX}>Minimax (Slow)</option>
          <option value={ALGORITHMS.ALPHA_BETA}>Alpha-Beta (Fast)</option>
        </select>
      </div>

      <input
        className={styles.input}
        type="number"
        min={MIN_LENGTH}
        max={MAX_LENGTH}
        value={length}
        onChange={handleChange}
        disabled={isLocked}
      />

      <button className={styles.startBtn} onClick={handleStart}>
        {getButtonLabel()}
      </button>
    </div>
  );
};

export default GameControls;
