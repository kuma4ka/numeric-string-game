export const MIN_LENGTH = 15;
export const MAX_LENGTH = 25;
export const MAX_NUMBER = 6;

export const generateInitialState = (length) => {
  const validLength = Math.max(MIN_LENGTH, Math.min(length, MAX_LENGTH));
  return Array.from({ length: validLength }, () => Math.floor(Math.random() * MAX_NUMBER) + 1);
};

export const calculateMergeResult = (a, b) => {
  const sum = a + b;
  if (sum > MAX_NUMBER) {
    return ((sum - 1) % MAX_NUMBER) + 1;
  }
  return sum;
};

export const applyMove = (currentState, index, type) => {
  const newState = [...currentState];

  if (type === 'DELETE') {
    newState.pop();
  } else if (type === 'MERGE') {
    const newVal = calculateMergeResult(newState[index], newState[index + 1]);
    newState.splice(index, 2, newVal);
  }

  return newState;
};

export const findBestMove = (currentState) => {
  let bestMove = null;
  let maxScoreGain = -Infinity;

  for (let i = 0; i < currentState.length - 1; i += 2) {
    if (maxScoreGain < 1) {
      maxScoreGain = 1;
      bestMove = { index: i, type: 'MERGE' };
    }
  }

  if (currentState.length % 2 !== 0) {
    if (maxScoreGain < 2) {
      bestMove = { index: currentState.length - 1, type: 'DELETE' };
    }
  }

  return bestMove;
};
