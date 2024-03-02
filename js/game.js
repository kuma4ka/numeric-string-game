class Game {
    constructor(stringLength) {
        this.stringLength = stringLength;
        this.numericalString = this.generateNumericalString(stringLength);
        this.player1Score = 0;
        this.player2Score = 0;
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

        if (this.numericalString.length === 1) {
            this.endGame();
            return;
        }
        
        if (spanClass === 'paired') {
            this.sumUpPair(pairs, spanIndex);
        }
        else if (spanClass === 'unpaired') {
            this.deleteUnpairedNumber(pairs);
        }

        this.updateNumericalString(pairs);

        if (this.numericalString.length === 1) {
            this.endGame();
            return;
        }
        
        this.makePCMove(pairs);
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'User' ? 'PC' : 'User';
    }

    makePlayerMove(pairs, spanIndex, spanClass) {
        if (spanClass === 'paired') {
            this.sumUpPair(pairs, spanIndex);
        }
        else if (spanClass === 'unpaired') {
            this.deleteUnpairedNumber(pairs);
        }

        this.updateNumericalString(pairs);

        this.switchPlayer();
    }

    makePCMove(pairs) {
        if (pairs[pairs.length - 1].length === 1) {
            this.deleteUnpairedNumber(pairs);
            return;
        }

        const randomPairToSumUp = Math.floor(Math.random() * pairs.length);
        
        this.sumUpPair(pairs, randomPairToSumUp);

        this.updateNumericalString(pairs);

        this.switchPlayer();
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
        this.currentPlayer === "User" ? this.player1Score++ : this.player2Score++;
    }

    deleteUnpairedNumber(pairs) {
        pairs.pop();
        this.currentPlayer === 'User' ? this.player1Score-- : this.player2Score--;
    }

    endGame() {
        alert("Game Over!");
        alert("User Score: " + this.player1Score);
        alert("PC Score: " + this.player2Score);
        alert(this.player1Score > this.player2Score ? "Player 1 Wins!" : (this.player2Score > this.player1Score ? "Player 2 Wins!" : "It's a draw!"));
    }
}

export default Game;
