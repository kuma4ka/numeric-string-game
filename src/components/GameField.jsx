import styles from './GameField.module.css';

const GameField = ({ numericalString, onMove, currentPlayer }) => {
  return (
    <div className={styles.container}>
      {numericalString.map((num, index) => {
        const isPairStart = index % 2 === 0 && index < numericalString.length - 1;
        const isPairEnd = index % 2 !== 0;
        const isOrphan = index === numericalString.length - 1 && index % 2 === 0;

        let itemClass = styles.item;
        if (isPairStart) itemClass += ` ${styles.pairStart}`;
        if (isPairEnd) itemClass += ` ${styles.pairEnd}`;
        if (isOrphan) itemClass += ` ${styles.orphan}`;

        if (currentPlayer !== 'User') itemClass += ` ${styles.disabled}`;

        const handleClick = () => {
          if (currentPlayer !== 'User') return;
          if (isPairStart || isPairEnd) {
            onMove(isPairStart ? index : index - 1, 'MERGE');
          } else if (isOrphan) {
            onMove(index, 'DELETE');
          }
        };

        return (
          <div key={`${index}-${num}`} className={itemClass} onClick={handleClick}>
            {num}
          </div>
        );
      })}
    </div>
  );
};

export default GameField;
