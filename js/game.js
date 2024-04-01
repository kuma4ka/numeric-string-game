import Logger from './logs.js';
class Game {
    constructor(stringLength) {
        this.stringLength = stringLength;
        this.numericalString = this.generateNumericalString(stringLength);
        this.userScore = 0;
        this.pcScore = 0;
        this.currentPlayer = 'User';
    }

    generateNumericalString(length) {
        let numericalString = '';
        for (let i = 0; i < length; i++) {
            numericalString += Math.floor(Math.random() * 6) + 1;
        }
        return numericalString;
    }

    playTurn(spanIndex, spanClass) {
        let pairs = this.generatePairs();

        this.makePlayerMove(pairs, spanIndex, spanClass);

        if (this.numericalString.length === 1) {
            this.endGame();
            return;
        }
        
        this.makePCMove(pairs);
    }

    switchPlayer(playerMove) {
        Logger.updateLogPlayerMoves(playerMove);
        Logger.updateLogChangesInString(this.numericalString);

        this.currentPlayer = this.currentPlayer === 'User' ? 'PC' : 'User';
    }

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

    makePCMove(pairs) {
        let bestMove = this.alphaBeta(this.numericalString, 10, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, true);
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

    alphaBeta(numericalString, depth, alpha, beta, maximizingPlayer) {
        if (depth === 0 || numericalString.length === 1) {
            return { score: this.evaluate(numericalString), index: -1 };
        }

        let pairs = this.generatePairs();

        if (maximizingPlayer) {
            let maxEval = { score: Number.NEGATIVE_INFINITY, index: -1 };
            for (let i = 0; i < pairs.length; i++) {
                let newNumericalString = this.simulateMove(numericalString, pairs, i);
                let evaluate = this.alphaBeta(newNumericalString, depth - 1, alpha, beta, false);
                if (evaluate.score > maxEval.score) {
                    maxEval.score = evaluate.score;
                    maxEval.index = i;
                }
                alpha = Math.max(alpha, evaluate.score);
                if (beta <= alpha) break;
            }
            return maxEval;
        } else {
            let minEval = { score: Number.POSITIVE_INFINITY, index: -1 };
            for (let i = 0; i < pairs.length; i++) {
                let newNumericalString = this.simulateMove(numericalString, pairs, i);
                let evaluate = this.alphaBeta(newNumericalString, depth - 1, alpha, beta, true);
                if (evaluate.score < minEval.score) {
                    minEval.score = evaluate.score;
                    minEval.index = i;
                }
                beta = Math.min(beta, evaluate.score);
                if (beta <= alpha) break;
            }
            return minEval;
        }
    }

    evaluate() {
        return this.userScore - this.pcScore;
    }
    

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

    isOddLength() {
        return this.numericalString.length % 2 !== 0;
    }

    updateNumericalString(pairs) {
        const newStr = pairs.flat().join('');
        this.numericalString = newStr;
    }

    sumUpPair(pairs, selectedPairIndex) {
        let sum = pairs[selectedPairIndex].reduce((a, b) => a + b, 0);
        if (sum > 6) {
            sum -= 6;
        }
        
        pairs[selectedPairIndex] = sum.toString();
        this.currentPlayer === "User" ? this.userScore++ : this.pcScore++;
    }

    deleteUnpairedNumber(pairs) {
        pairs.pop();
        if (this.currentPlayer === 'User') {
            this.pcScore -= 2;
        }
        else {
            this.userScore -= 2;
        }
    }

    endGame() {
        alert("Game Over!");
        alert("User Score: " + this.userScore);
        alert("PC Score: " + this.pcScore);
        alert(this.userScore > this.pcScore ? "User Wins!" : (this.pcScore > this.userScore ? "PC Wins!" : "It's a draw!"));
        return;
    }
}

export default Game;