import { describe, it, expect } from 'vitest';
import { calculateMergeResult, calculateMoveScore } from './helpers';
import { SCORES } from './constants';

describe('Game Helpers Logic', () => {
  describe('calculateMergeResult', () => {
    it('should sum numbers correctly if result <= 6', () => {
      expect(calculateMergeResult(2, 3)).toBe(5);
      expect(calculateMergeResult(1, 1)).toBe(2);
    });

    it('should wrap around using modulo 6 if result > 6', () => {
      expect(calculateMergeResult(4, 5)).toBe(3);
      expect(calculateMergeResult(6, 6)).toBe(6);
      expect(calculateMergeResult(3, 4)).toBe(1);
    });
  });

  describe('calculateMoveScore', () => {
    it('should return base score for normal merge', () => {
      const state = [2, 3];
      const move = { type: 'MERGE', index: 0 };
      expect(calculateMoveScore(move, state)).toBe(SCORES.MERGE_BASE);
    });

    it('should return BONUS score for Golden Pair (Sum 7)', () => {
      const state = [3, 4];
      const move = { type: 'MERGE', index: 0 };
      expect(calculateMoveScore(move, state)).toBe(SCORES.MERGE_BONUS);
    });

    it('should return negative score for DELETE move', () => {
      const state = [1, 2, 3];
      const move = { type: 'DELETE', index: 2 };
      expect(calculateMoveScore(move, state)).toBe(SCORES.DELETE_COST);
    });
  });
});
