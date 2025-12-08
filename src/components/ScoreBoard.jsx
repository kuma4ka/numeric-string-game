import { motion } from 'framer-motion';
import styles from './ScoreBoard.module.css';

const ScoreBoard = ({ userScore, pcScore, currentPlayer }) => {
  return (
    <div className={styles.container}>
      <div className={`${styles.player} ${currentPlayer === 'User' ? styles.active : ''}`}>
        <div className={styles.label}>User</div>
        <motion.div
          className={styles.score}
          key={userScore}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {userScore}
        </motion.div>
      </div>

      <div className={`${styles.player} ${currentPlayer === 'PC' ? styles.active : ''}`}>
        <div className={styles.label}>PC</div>
        <motion.div
          className={styles.score}
          key={pcScore}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {pcScore}
        </motion.div>
      </div>
    </div>
  );
};

export default ScoreBoard;
