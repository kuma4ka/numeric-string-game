export const MIN_LENGTH = 15;
export const MAX_LENGTH = 25;
export const MAX_NUMBER = 6;

export const ALGORITHMS = {
  MINIMAX: 'MINIMAX',
  ALPHA_BETA: 'ALPHA_BETA',
};

export const SCORES = {
  MERGE_BASE: 1,
  MERGE_BONUS: 3,
  DELETE_COST: -1,
};

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

const MAX_DEPTH = 5;

const evaluateState = (aiScore, userScore) => {
  return aiScore - userScore;
};

const minimax = (state, depth, isMaximizing, alpha, beta, aiScore, userScore, usePruning) => {
  if (depth === 0 || state.length <= 1) {
    return { score: evaluateState(aiScore, userScore) };
  }

  const moves = getAvailableMoves(state);

  if (isMaximizing) {
    let maxEval = -Infinity;
    let bestMove = null;

    for (const move of moves) {
      const nextState = simulateMove(state, move);
      const points = calculateMoveScore(move, state);

      const evalResult = minimax(
        nextState,
        depth - 1,
        false,
        alpha,
        beta,
        aiScore + points,
        userScore,
        usePruning
      );

      if (evalResult.score > maxEval) {
        maxEval = evalResult.score;
        bestMove = move;
      }

      if (usePruning) {
        alpha = Math.max(alpha, evalResult.score);
        if (beta <= alpha) break;
      }
    }
    return { score: maxEval, move: bestMove };
  } else {
    let minEval = Infinity;

    for (const move of moves) {
      const nextState = simulateMove(state, move);
      const points = calculateMoveScore(move, state);

      const evalResult = minimax(
        nextState,
        depth - 1,
        true,
        alpha,
        beta,
        aiScore,
        userScore + points,
        usePruning
      );

      if (evalResult.score < minEval) {
        minEval = evalResult.score;
      }

      if (usePruning) {
        beta = Math.min(beta, evalResult.score);
        if (beta <= alpha) break;
      }
    }
    return { score: minEval };
  }
};

export const findBestMove = (currentState, currentAiScore, currentUserScore, algorithmType) => {
  if (currentState.length <= 1) return null;

  const usePruning = algorithmType === ALGORITHMS.ALPHA_BETA;

  const result = minimax(
    currentState,
    MAX_DEPTH,
    true,
    -Infinity,
    Infinity,
    currentAiScore,
    currentUserScore,
    usePruning
  );

  return result.move || getAvailableMoves(currentState)[0];
};
