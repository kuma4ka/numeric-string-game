import { generateNumericalString } from '../utils/generateNumericalString.js';
import Logger from './logs.js';

// Define the Game class
class Game {
    constructor(stringLength, mode, currentPlayer) {
        this.stringLength = stringLength;
        this.numericalString = generateNumericalString(stringLength);
        this.userScore = 0;
        this.pcScore = 0;
        this.currentPlayer = currentPlayer;
        this.mode = mode;
    }

    // Play a turn in the game
    playTurn(spanIndex, spanClass) {
        const pairs = this.generatePairs();

        if (this.currentPlayer !== 'User') {
            return this.makePCMove(pairs);
        }

        this.makePlayerMove(pairs, spanIndex, spanClass);

        if (this.numericalString.length !== 1) {
            this.playTurn();
        }
    }

    // Switch the current player
    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'User' ? 'PC' : 'User';
    }

    // Make a move for the player
    makePlayerMove(pairs, spanIndex, spanClass) {
        const isPaired = spanClass === 'paired';
        const logPlayerMove = isPaired
            ? `User summed up ${JSON.stringify(pairs[spanIndex])} pair.`
            : `User deleted ${JSON.stringify(pairs[spanIndex])}.`;

        if (isPaired) {
            this.sumUpPair(pairs, spanIndex);
        } else {
            this.deleteUnpairedNumber(pairs);
        }

        Logger.updateLogPlayerMoves(logPlayerMove);
        console.log(`Score user: ${this.userScore}. Score PC: ${this.pcScore}.`);

        this.updateNumericalString(pairs);
        Logger.updateLogChangesInString(this.numericalString);

        this.switchPlayer();
    }

    // Make a move for the PC
    makePCMove(pairs) {
        const bestMove = this.chooseBestMove();
        const selectedPairIndex = bestMove.index;
        const isPaired = pairs[selectedPairIndex].length === 2;
        const logPlayerMove = isPaired
            ? `PC summed up ${JSON.stringify(pairs[selectedPairIndex])} pair.`
            : `PC deleted ${JSON.stringify(pairs[selectedPairIndex])}.`;

        if (isPaired) {
            this.sumUpPair(pairs, selectedPairIndex);
        } else {
            this.deleteUnpairedNumber(pairs);
        }

        Logger.updateLogPlayerMoves(logPlayerMove);

        this.updateNumericalString(pairs);
        Logger.updateLogChangesInString(this.numericalString);

        this.switchPlayer();
    }

    chooseBestMove() {
        if (this.mode === 'MiniMax') {
            return this.miniMax(this.numericalString, 5, true);
        }

        return this.alphaBeta(this.numericalString, 5, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, true);
    }

    // Perform the alpha-beta pruning algorithm to determine the best move for the PC
    alphaBeta(numericalString, depth, alpha, beta, maximizingPlayer) {
        if (depth === 0 || numericalString.length === 1) {
            return { score: this.evaluate(numericalString), index: -1 };
        }

        const pairs = this.generatePairs();
        const currentEval = {
            score: maximizingPlayer ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
            index: -1,
        };

        for (let i = 0; i < pairs.length; i++) {
            const newNumericalString = this.simulateMove(numericalString, pairs, i);
            let evaluate = this.alphaBeta(newNumericalString, depth - 1, alpha, beta, maximizingPlayer ? false : true);

            if (
                (maximizingPlayer && evaluate.score > currentEval.score) ||
                (!maximizingPlayer && evaluate.score < currentEval.score)
            ) {
                currentEval.score = evaluate.score;
                currentEval.index = i;
            }

            if (maximizingPlayer) {
                alpha = Math.max(alpha, evaluate.score);
            } else {
                beta = Math.min(beta, evaluate.score);
            }

            if (beta <= alpha) {
                break;
            }
        }
        return currentEval;
    }

    miniMax(numericalString, depth, maximizingPlayer) {
        // console.log(`MiniMax called with depth: ${depth}, maximizingPlayer: ${maximizingPlayer}`);

        if (depth === 0 || numericalString.length === 1) {
            // console.log("Reached terminal state.");
            return { score: this.evaluate(numericalString), index: -1 };
        }

        let pairs = this.generatePairs();
        // console.log("Pairs:", pairs);

        if (maximizingPlayer) {
            let maxEval = { score: Number.NEGATIVE_INFINITY, index: -1 };
            for (let i = 0; i < pairs.length; i++) {
                let newNumericalString = this.simulateMove(numericalString, pairs, i);
                // console.log(`Maximizing Player - Trying move: ${JSON.stringify(pairs[i])}`);
                // console.log(`New Numerical String: ${newNumericalString}`);
                let evaluate = this.miniMax(newNumericalString, depth - 1, false);
                // console.log(`Maximizing Player - Evaluated Move: ${JSON.stringify(pairs[i])}`);
                // console.log(`Maximizing Player - Evaluated Score: ${evaluate.score}`);
                if (evaluate.score > maxEval.score) {
                    maxEval.score = evaluate.score;
                    maxEval.index = i;
                }
            }
            // console.log("Maximizing Player - Best Move:", maxEval);
            return maxEval;
        } else {
            let minEval = { score: Number.POSITIVE_INFINITY, index: -1 };
            for (let i = 0; i < pairs.length; i++) {
                let newNumericalString = this.simulateMove(numericalString, pairs, i);
                // console.log(`Minimizing Player - Trying move: ${JSON.stringify(pairs[i])}`);
                // console.log(`New Numerical String: ${newNumericalString}`);
                let evaluate = this.miniMax(newNumericalString, depth - 1, true);
                // console.log(`Minimizing Player - Evaluated Move: ${JSON.stringify(pairs[i])}`);
                // console.log(`Minimizing Player - Evaluated Score: ${evaluate.score}`);
                if (evaluate.score < minEval.score) {
                    minEval.score = evaluate.score;
                    minEval.index = i;
                }
            }
            // console.log("Minimizing Player - Best Move:", minEval);
            return minEval;
        }
    }

    // Evaluate the current state of the game
    evaluate() {
        return this.userScore - this.pcScore;
    }

    // Simulate a move by replacing numbers in the numerical string
    simulateMove(numericalString, pairs, index) {
        const newNumericalString = numericalString.slice();
        const pair = pairs[index];
        let sum = pair.reduce((a, b) => a + b, 0);

        if (sum > 6) {
            sum -= 6;
        }

        const newNumStringParam = pair[1] ? (pair.join(''), sum.toString()) : (pair[0], '');

        return newNumericalString.replace(newNumStringParam);
    }

    // Generate pairs from the numerical string
    generatePairs() {
        const pairs = [];
        for (let i = 0; i < this.numericalString.length; i += 2) {
            const generatedPair = [parseInt(this.numericalString[i]), parseInt(this.numericalString[i + 1])];

            pairs.push(i + 1 < this.numericalString.length ? generatedPair : [generatedPair[0]]);
        }
        return pairs;
    }

    // Check if the numerical string has an odd length
    isOddLength() {
        return this.numericalString.length % 2 !== 0;
    }

    // Update the numerical string based on the pairs
    updateNumericalString(pairs) {
        this.numericalString = pairs.flat().join('');
    }

    // Sum up a pair and update the scores
    sumUpPair(pairs, selectedPairIndex) {
        let sum = pairs[selectedPairIndex].reduce((a, b) => a + b, 0);
        if (sum > 6) {
            sum -= 6;
        }

        pairs[selectedPairIndex] = sum.toString();
        this.currentPlayer === 'User' ? this.userScore++ : this.pcScore++;
    }

    // Delete an unpaired number and update the scores
    deleteUnpairedNumber(pairs) {
        pairs.pop();
        if (this.currentPlayer === 'User') {
            this.pcScore -= 2;
        } else {
            this.userScore -= 2;
        }
    }

    // End the game and display the winner
    endGame() {
        const winner =
            this.userScore > this.pcScore ? 'User Wins!' : this.pcScore > this.userScore ? 'PC Wins!' : "It's a draw!";
        alert('Game Over!');
        alert('User Score: ' + this.userScore);
        alert('PC Score: ' + this.pcScore);
        alert(winner);
        return winner;
    }
}

export default Game;
