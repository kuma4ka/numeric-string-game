import { useState, useEffect, useCallback } from 'react';
import { ALGORITHMS } from '../utils/constants';
import { generateInitialState, simulateMove, calculateMoveScore } from '../utils/helpers';
import { findBestMove } from '../utils/ai';

export const useGameLogic = () => {
  const [numericalString, setNumericalString] = useState([]);
  const [userScore, setUserScore] = useState(0);
  const [pcScore, setPcScore] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState('User');
  const [gameStatus, setGameStatus] = useState('IDLE');
  const [winner, setWinner] = useState(null);
  const [algorithm, setAlgorithm] = useState(ALGORITHMS.ALPHA_BETA);

  const startGame = useCallback((length) => {
    const startString = generateInitialState(length);
    setNumericalString(startString);
    setUserScore(0);
    setPcScore(0);
    setCurrentPlayer('User');
    setGameStatus('PLAYING');
    setWinner(null);
  }, []);

  const performMove = useCallback(
    (index, type) => {
      setNumericalString((prevString) => {
        const move = { index, type };

        const points = calculateMoveScore(move, prevString);

        if (currentPlayer === 'User') {
          setUserScore((s) => s + points);
        } else {
          setPcScore((s) => s + points);
        }

        const newState = simulateMove(prevString, move);

        if (newState.length <= 1) {
          setGameStatus('FINISHED');
        }

        return newState;
      });

      setCurrentPlayer((prev) => (prev === 'User' ? 'PC' : 'User'));
    },
    [currentPlayer]
  );

  useEffect(() => {
    if (gameStatus === 'PLAYING' && currentPlayer === 'PC') {
      const timer = setTimeout(() => {
        const move = findBestMove(numericalString, pcScore, userScore, algorithm);
        if (move) {
          performMove(move.index, move.type);
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [gameStatus, currentPlayer, numericalString, pcScore, userScore, performMove, algorithm]);

  useEffect(() => {
    if (gameStatus === 'FINISHED') {
      if (userScore > pcScore) setWinner('User');
      else if (pcScore > userScore) setWinner('PC');
      else setWinner('Draw');
    }
  }, [gameStatus, userScore, pcScore]);

  return {
    numericalString,
    userScore,
    pcScore,
    currentPlayer,
    gameStatus,
    winner,
    algorithm,
    setAlgorithm,
    startGame,
    performMove,
  };
};
