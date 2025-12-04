const GameField = ({ numericalString, onMove, currentPlayer }) => {
  return (
    <div className="string-container">
      {numericalString.map((num, index) => {
        const isPairStart = index % 2 === 0 && index < numericalString.length - 1;
        const isPairEnd = index % 2 !== 0;
        const isOrphan = index === numericalString.length - 1 && index % 2 === 0;

        let className = 'number-item';
        if (isPairStart) className += ' pair-start';
        if (isPairEnd) className += ' pair-end';
        if (isOrphan) className += ' orphan';

        const handleClick = () => {
          if (currentPlayer !== 'User') return; // Блокуємо, якщо ходить ПК

          if (isPairStart || isPairEnd) {
            const pairIndex = isPairStart ? index : index - 1;
            onMove(pairIndex, 'MERGE');
          } else if (isOrphan) {
            onMove(index, 'DELETE');
          }
        };

        return (
          <div key={`${index}-${num}`} className={className} onClick={handleClick}>
            {num}
          </div>
        );
      })}
    </div>
  );
};

export default GameField;
