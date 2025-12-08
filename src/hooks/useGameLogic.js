import { useState, useEffect, useCallback } from 'react';
import {
  generateInitialState,
  simulateMove,
  findBestMove,
  SCORES,
  ALGORITHMS,
} from '../utils/gameLogic';

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
        const newState = simulateMove(prevString, { index, type });
        if (newState.length <= 1) {
          setGameStatus('FINISHED');
        }
        return newState;
      });

      if (currentPlayer === 'User') {
        if (type === 'MERGE') setUserScore((s) => s + SCORES.MERGE_REWARD);
        else if (type === 'DELETE') setPcScore((s) => s - SCORES.DELETE_PENALTY);
      } else {
        if (type === 'MERGE') setPcScore((s) => s + SCORES.MERGE_REWARD);
        else if (type === 'DELETE') setUserScore((s) => s - SCORES.DELETE_PENALTY);
      }

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
