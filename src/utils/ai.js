import { ALGORITHMS } from './constants';
import { simulateMove, getAvailableMoves, calculateMoveScore } from './helpers';

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
