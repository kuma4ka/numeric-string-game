import Logger from './logs.js';

// Define the Game class
class Game {
    constructor(stringLength, mode, playTurn) {
        this.stringLength = stringLength;
        this.numericalString = this.generateNumericalString(stringLength);
        this.userScore = 0;
        this.pcScore = 0;
        this.currentPlayer = playTurn;
        this.mode = mode;
    }

    // Generate a random numerical string of a given length
    generateNumericalString(length) {
        let numericalString = '';
        for (let i = 0; i < length; i++) {
            numericalString += Math.floor(Math.random() * 6) + 1;
        }
        return numericalString;
    }

    playTurn(spanIndex, spanClass) {
        let pairs = this.generatePairs();
    
        if (this.currentPlayer === 'User') {
            this.makePlayerMove(pairs, spanIndex, spanClass);
            
            if (this.numericalString.length !== 1) {
                this.playTurn();
            } else {
                return
            }
        } else {
            this.makePCMove(pairs);
        }
    }

    // Switch the current player
    switchPlayer(playerMove) {
        Logger.updateLogPlayerMoves(playerMove);
        Logger.updateLogChangesInString(this.numericalString);

        this.currentPlayer = this.currentPlayer === 'User' ? 'PC' : 'User';
    }

    // Make a move for the player
    makePlayerMove(pairs, spanIndex, spanClass) {
        let playerMove; 

        if (spanClass === 'paired') {
            playerMove = `User summed up ${JSON.stringify(pairs[spanIndex])} pair.`;

            this.sumUpPair(pairs, spanIndex);
            console.log(`Score user: ${this.userScore}. Score PC: ${this.pcScore}.`);
        }
        else if (spanClass === 'unpaired') {
            playerMove = `User deleted ${JSON.stringify(pairs[spanIndex])}.`;

            this.deleteUnpairedNumber(pairs);
            console.log(`Score user: ${this.userScore}. Score PC: ${this.pcScore}.`);
        }

        this.updateNumericalString(pairs);

        this.switchPlayer(playerMove);
    }

    // Make a move for the PC
    makePCMove(pairs) {
        let bestMove;
        console.log('im here PCMove');

        if (this.mode === 'MiniMax') {
            bestMove = this.miniMax(this.numericalString, 5, true);
            console.log('im here minimax');
        } else if (this.mode === 'AlphaBeta') {
            bestMove = this.alphaBeta(this.numericalString, 5, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, true);
            console.log('im here alpha');
        
        }

        let selectedPairIndex = bestMove.index;

        let pcMove;
        if (pairs[selectedPairIndex].length === 2) {
            pcMove = `PC summed up ${JSON.stringify(pairs[selectedPairIndex])} pair.`;
            this.sumUpPair(pairs, selectedPairIndex);
        } else {
            pcMove = `PC deleted ${JSON.stringify(pairs[selectedPairIndex])}.`;
            this.deleteUnpairedNumber(pairs);
        }

        this.updateNumericalString(pairs);
        this.switchPlayer(pcMove);
    }

    // Perform the alpha-beta pruning algorithm to determine the best move for the PC
    alphaBeta(numericalString, depth, alpha, beta, maximizingPlayer) {
        if (depth === 0 || numericalString.length === 1) {
            // console.log("Terminal Node Reached.");
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
                let evaluate = this.alphaBeta(newNumericalString, depth - 1, alpha, beta, false);
                // console.log(`Maximizing Player - Evaluated Move: ${JSON.stringify(pairs[i])}`);
                // console.log(`Maximizing Player - Evaluated Score: ${evaluate.score}`);
                if (evaluate.score > maxEval.score) {
                    maxEval.score = evaluate.score;
                    maxEval.index = i;
                }
                alpha = Math.max(alpha, evaluate.score);
                // console.log(`Maximizing Player - Alpha: ${alpha}`);
                // console.log(`Maximizing Player - Beta: ${beta}`);
                if (beta <= alpha) {
                    // console.log("Maximizing Player - Beta Cut-off.");
                    break;
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
                let evaluate = this.alphaBeta(newNumericalString, depth - 1, alpha, beta, true);
                // console.log(`Minimizing Player - Evaluated Move: ${JSON.stringify(pairs[i])}`);
                // console.log(`Minimizing Player - Evaluated Score: ${evaluate.score}`);
                if (evaluate.score < minEval.score) {
                    minEval.score = evaluate.score;
                    minEval.index = i;
                }
                beta = Math.min(beta, evaluate.score);
                // console.log(`Minimizing Player - Alpha: ${alpha}`);
                // console.log(`Minimizing Player - Beta: ${beta}`);
                if (beta <= alpha) {
                    // console.log("Minimizing Player - Beta Cut-off.");
                    break;
                }
            }
            // console.log("Minimizing Player - Best Move:", minEval);
            return minEval;
        }
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
        let newNumericalString = numericalString.slice();
        let pair = pairs[index];
        if (pair.length === 2) {
            let sum = pair.reduce((a, b) => a + b, 0);
            if (sum > 6) {
                sum -= 6;
            }
            newNumericalString = newNumericalString.replace(pair.join(''), sum.toString());
        } else {
            newNumericalString = newNumericalString.replace(pair[0], '');
        }
        return newNumericalString;
    }
    
    // Generate pairs from the numerical string
    generatePairs() {
        const pairs = [];
        for (let i = 0; i < this.numericalString.length; i += 2) {
            if (i + 1 < this.numericalString.length) {
                pairs.push([parseInt(this.numericalString[i]), parseInt(this.numericalString[i + 1])]);
            } else {
                pairs.push([parseInt(this.numericalString[i])]);
            }
        }
        return pairs;
    }

    // Check if the numerical string has an odd length
    isOddLength() {
        return this.numericalString.length % 2 !== 0;
    }

    // Update the numerical string based on the pairs
    updateNumericalString(pairs) {
        const newStr = pairs.flat().join('');
        this.numericalString = newStr;
    }

    // Sum up a pair and update the scores
    sumUpPair(pairs, selectedPairIndex) {
        let sum = pairs[selectedPairIndex].reduce((a, b) => a + b, 0);
        if (sum > 6) {
            sum -= 6;
        }
        
        pairs[selectedPairIndex] = sum.toString();
        this.currentPlayer === "User" ? this.userScore++ : this.pcScore++;
    }

    // Delete an unpaired number and update the scores
    deleteUnpairedNumber(pairs) {
        pairs.pop();
        if (this.currentPlayer === 'User') {
            this.pcScore -= 2;
        }
        else {
            this.userScore -= 2;
        }
    }

    // End the game and display the winner
    endGame() {
        let winner = this.userScore > this.pcScore ? "User Wins!" : (this.pcScore > this.userScore ? "PC Wins!" : "It's a draw!");
        alert("Game Over!");
        alert("User Score: " + this.userScore);
        alert("PC Score: " + this.pcScore);
        alert(winner);
        return winner;
    }
}

export default Game;