import { useState, useEffect, useCallback } from 'react';
import { generateInitialState, applyMove, findBestMove } from '../utils/gameLogic';

export const useGameLogic = () => {
  const [numericalString, setNumericalString] = useState([]);
  const [userScore, setUserScore] = useState(0);
  const [pcScore, setPcScore] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState('User');
  const [gameStatus, setGameStatus] = useState('IDLE');
  const [winner, setWinner] = useState(null);

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
        const newString = applyMove(prevString, index, type);
        if (newString.length <= 1) {
          setGameStatus('FINISHED');
        }
        return newString;
      });

      if (currentPlayer === 'User') {
        if (type === 'MERGE') setUserScore((s) => s + 1);
        else if (type === 'DELETE') setPcScore((s) => s - 2);
      } else {
        if (type === 'MERGE') setPcScore((s) => s + 1);
        else if (type === 'DELETE') setUserScore((s) => s - 2);
      }

      setCurrentPlayer((prev) => (prev === 'User' ? 'PC' : 'User'));
    },
    [currentPlayer]
  );

  useEffect(() => {
    if (gameStatus === 'FINISHED') {
      if (userScore > pcScore) setWinner('User');
      else if (pcScore > userScore) setWinner('PC');
      else setWinner('Draw');
    }
  }, [gameStatus, userScore, pcScore]);

  useEffect(() => {
    if (gameStatus === 'PLAYING' && currentPlayer === 'PC') {
      const timer = setTimeout(() => {
        const move = findBestMove(numericalString);
        if (move) {
          performMove(move.index, move.type);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [gameStatus, currentPlayer, numericalString, performMove]);

  return {
    numericalString,
    userScore,
    pcScore,
    currentPlayer,
    gameStatus,
    winner,
    startGame,
    performMove,
  };
};
