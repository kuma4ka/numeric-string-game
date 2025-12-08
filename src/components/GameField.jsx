import { motion, AnimatePresence } from 'framer-motion';
import styles from './GameField.module.css';

const GameField = ({ numericalString, onMove, currentPlayer, gameStatus, isProcessing }) => {
  return (
    <div className={styles.container}>
      <AnimatePresence mode="popLayout">
        {numericalString.map((num, index) => {
          const isPairStart = index % 2 === 0 && index < numericalString.length - 1;
          const isPairEnd = index % 2 !== 0;
          const isOrphan = index === numericalString.length - 1 && index % 2 === 0;

          let itemClass = styles.item;
          if (isPairStart) itemClass += ` ${styles.pairStart}`;
          if (isPairEnd) itemClass += ` ${styles.pairEnd}`;
          if (isOrphan) itemClass += ` ${styles.orphan}`;

          const isDisabled = currentPlayer !== 'User' || gameStatus === 'FINISHED' || isProcessing;

          if (isDisabled) {
            itemClass += ` ${styles.disabled}`;
          }

          const handleClick = () => {
            if (isDisabled) return;

            if (isPairStart || isPairEnd) {
              onMove(isPairStart ? index : index - 1, 'MERGE');
            } else if (isOrphan) {
              onMove(index, 'DELETE');
            }
          };

          return (
            <motion.div
              layout
              key={`${index}-${num}-${numericalString.length}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className={itemClass}
              onClick={handleClick}
              whileHover={{ scale: isDisabled ? 1 : 1.1 }}
              whileTap={{ scale: isDisabled ? 1 : 0.9 }}
            >
              {num}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default GameField;
