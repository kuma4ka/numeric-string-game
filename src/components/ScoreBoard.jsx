const ScoreBoard = ({ userScore, pcScore, currentPlayer }) => {
  return (
    <div className="scoreboard">
      <div className={currentPlayer === 'User' ? 'active-turn' : ''}>User: {userScore}</div>
      <div className={currentPlayer === 'PC' ? 'active-turn' : ''}>PC: {pcScore}</div>
    </div>
  );
};

export default ScoreBoard;
