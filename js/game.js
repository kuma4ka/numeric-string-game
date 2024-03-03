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
        let PCMove;
        if (pairs[pairs.length - 1].length === 1) {

            PCMove = `PC deleted ${JSON.stringify(pairs[pairs.length - 1])}.`;

            this.deleteUnpairedNumber(pairs);
            this.updateNumericalString(pairs);
            console.log(`Score user: ${this.userScore}. Score PC: ${this.pcScore}.`);
            this.switchPlayer(PCMove);
            return;
        }

        const randomPairToSumUp = Math.floor(Math.random() * pairs.length);
        PCMove = `PC summed up ${JSON.stringify(pairs[randomPairToSumUp])} pair.`;
        
        this.sumUpPair(pairs, randomPairToSumUp);
        console.log(`Score user: ${this.userScore}. Score PC: ${this.pcScore}.`);
        this.updateNumericalString(pairs);

        this.switchPlayer(PCMove);
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
        this.currentPlayer === 'User' ? this.pcScore-- : this.userScore--;
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
