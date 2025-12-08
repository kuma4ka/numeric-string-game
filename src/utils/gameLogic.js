export const MIN_LENGTH = 15;
export const MAX_LENGTH = 25;
export const MAX_NUMBER = 6;

export const SCORES = {
  MERGE_REWARD: 1,
  DELETE_PENALTY: 1,
};

export const generateInitialState = (length) => {
  const validLength = Math.max(MIN_LENGTH, Math.min(length, MAX_LENGTH));
  return Array.from({ length: validLength }, () => Math.floor(Math.random() * MAX_NUMBER) + 1);
};

export const calculateMergeResult = (a, b) => {
  const sum = a + b;
  return sum > MAX_NUMBER ? ((sum - 1) % MAX_NUMBER) + 1 : sum;
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

const MAX_DEPTH = 6;

const evaluateState = (aiScore, userScore) => {
  return aiScore - userScore;
};

const minimax = (state, depth, isMaximizing, alpha, beta, aiScore, userScore) => {
  if (depth === 0 || state.length <= 1) {
    return { score: evaluateState(aiScore, userScore) };
  }

  const moves = getAvailableMoves(state);

  if (isMaximizing) {
    let maxEval = -Infinity;
    let bestMove = null;

    for (const move of moves) {
      const nextState = simulateMove(state, move);
      let newAiScore = aiScore;
      let newUserScore = userScore;

      if (move.type === 'MERGE') newAiScore += SCORES.MERGE_REWARD;
      else if (move.type === 'DELETE') newUserScore -= SCORES.DELETE_PENALTY;

      const evalResult = minimax(
        nextState,
        depth - 1,
        false,
        alpha,
        beta,
        newAiScore,
        newUserScore
      );

      if (evalResult.score > maxEval) {
        maxEval = evalResult.score;
        bestMove = move;
      }
      alpha = Math.max(alpha, evalResult.score);
      if (beta <= alpha) break;
    }
    return { score: maxEval, move: bestMove };
  } else {
    let minEval = Infinity;

    for (const move of moves) {
      const nextState = simulateMove(state, move);
      let newAiScore = aiScore;
      let newUserScore = userScore;

      if (move.type === 'MERGE') newUserScore += SCORES.MERGE_REWARD;
      else if (move.type === 'DELETE') newAiScore -= SCORES.DELETE_PENALTY;

      const evalResult = minimax(nextState, depth - 1, true, alpha, beta, newAiScore, newUserScore);

      if (evalResult.score < minEval) {
        minEval = evalResult.score;
      }
      beta = Math.min(beta, evalResult.score);
      if (beta <= alpha) break;
    }
    return { score: minEval };
  }
};

export const findBestMove = (currentState, currentAiScore, currentUserScore) => {
  const result = minimax(
    currentState,
    MAX_DEPTH,
    true,
    -Infinity,
    Infinity,
    currentAiScore,
    currentUserScore
  );
  return result.move || getAvailableMoves(currentState)[0];
};
