import { MIN_LENGTH, MAX_LENGTH, MAX_NUMBER, SCORES } from './constants';

export const generateInitialState = (length) => {
  const validLength = Math.max(MIN_LENGTH, Math.min(length, MAX_LENGTH));
  return Array.from({ length: validLength }, () => Math.floor(Math.random() * MAX_NUMBER) + 1);
};

export const calculateMergeResult = (a, b) => {
  const sum = a + b;
  return sum > MAX_NUMBER ? ((sum - 1) % MAX_NUMBER) + 1 : sum;
};

export const calculateMoveScore = (move, state) => {
  if (move.type === 'DELETE') {
    return SCORES.DELETE_COST;
  }

  if (move.type === 'MERGE') {
    const a = state[move.index];
    const b = state[move.index + 1];
    if ((a + b) % 7 === 0 || a + b === 7) {
      return SCORES.MERGE_BONUS;
    }
    return SCORES.MERGE_BASE;
  }
  return 0;
};

export const simulateMove = (currentState, move) => {
  const newState = [...currentState];

  if (move.type === 'DELETE') {
    newState.pop();
  } else if (move.type === 'MERGE') {
    const newVal = calculateMergeResult(newState[move.index], newState[move.index + 1]);
    newState.splice(move.index, 2, newVal);
  }
  return newState;
};

export const getAvailableMoves = (currentState) => {
  const moves = [];
  for (let i = 0; i < currentState.length - 1; i += 2) {
    moves.push({ type: 'MERGE', index: i });
  }
  if (currentState.length % 2 !== 0) {
    moves.push({ type: 'DELETE', index: currentState.length - 1 });
  }
  return moves;
};
