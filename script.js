class Game {
    constructor(stringLength) {
        this.stringLength = stringLength;
        this.numericalString = this.generateNumericalString(stringLength);
        this.player1Score = 0;
        this.player2Score = 0;
        this.currentPlayer = 1;
    }

    generateNumericalString(length) {
        let numericalString = '';
        for (let i = 0; i < length; i++) {
            numericalString += Math.floor(Math.random() * 6) + 1;
        }
        return numericalString;
    }

    playTurn() {
        const pairs = this.generatePairs();

        if (this.numericalString.length === 1) {
            this.endGame();
            return;
        }
        
        this.makePlayerMove(pairs);
        
        if (this.numericalString.length === 1) {
            this.endGame();
            return;
        }
        
        this.makePCMove(pairs);
    }

    makePlayerMove(pairs) {
        console.log(`🚀 ~ Game ~ makeMovePerson ~ ${JSON.stringify(pairs)}:`)
        let selectedPairIndex = this.promptUserForPair(pairs);

        if (this.isOddLength() && pairs[selectedPairIndex - 1].length === 1 && selectedPairIndex === pairs.length) {
            selectedPairIndex = this.promptUserForPair(pairs, `In numeric string with odd length choose only two-number pair: ${JSON.stringify(pairs)}.`);
        }

        this.updatePairsAndScores(pairs, selectedPairIndex);
        this.updateNumericalString(pairs);
        this.switchPlayer();
    }

    makePCMove(pairs) {
        console.log(`🚀 ~ Game ~ makePCMove ~ ${JSON.stringify(pairs)}:`)

        if (pairs[pairs.length - 1].length === 1) {
            this.deleteUnpairedNumber();
            return;
        }

        const randomPairToSumUp = Math.floor(Math.random() * pairs.length);
        
        this.updatePairsAndScores(pairs, randomPairToSumUp);
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

    promptUserForPair(pairs, message) {
        return parseInt(prompt(message || `Choose the pair (start - 1, end - ${pairs.length}): ${JSON.stringify(pairs)}.`));
    }

    isOddLength() {
        return this.numericalString.length % 2 !== 0;
    }

    updatePairsAndScores(pairs, selectedPairIndex) {
        let sum = pairs[selectedPairIndex - 1].reduce((a, b) => a + b, 0);
        if (sum > 6) {
            sum -= 6;
        }
        pairs[selectedPairIndex - 1] = sum.toString();
        this.currentPlayer === 1 ? this.player1Score++ : this.player2Score++;
        if (this.isOddLength()) {
            this.currentPlayer === 1 ? this.player1Score-- : this.player2Score--;
        }
    }

    updateNumericalString(pairs) {
        const newStr = pairs.flat().join('');
        this.numericalString = newStr;
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 1 ? 'PC' : 1;
    }

    deleteUnpairedNumber() {
        if (this.isOddLength()) {
            this.numericalString = this.numericalString.slice(0, -1);
            this.currentPlayer === 1 ? this.player1Score-- : this.player2Score--;
        }
    }

    endGame() {
        alert("Game Over!");
        alert("Player 1 Score: " + this.player1Score);
        alert("Player 2 Score: " + this.player2Score);
        alert(this.player1Score > this.player2Score ? "Player 1 Wins!" : (this.player2Score > this.player1Score ? "Player 2 Wins!" : "It's a draw!"));
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const elements = getElements(); // Retrieve all required elements

    let game;

    elements.startGameButton.addEventListener('click', function () {
        const length = parseInt(document.getElementById('length-number').value);
        if (length >= 15 && length <= 25) {
            game = new Game(length);
            updateUI();
            elements.additionalContent.style.display = 'block';
            elements.logPlayerMoves.style.display = 'block'; // Make logPlayerMoves visible
            elements.logChangesInString.style.display = 'block'; // Make logChangesInString visible
            elements.logStartStringListElem.textContent = `Start string: ${game.numericalString}`;
        } else {
            alert('Please enter a number between 15 and 25.');
        }
    });

    elements.sumUpButton.addEventListener('click', function () {
        game.playTurn();
        updateLogChangesInString(game.numericalString);
        updateUI();
    });

    elements.deleteNumberButton.addEventListener('click', function () {
        game.deleteUnpairedNumber();
        updateLogChangesInString(game.numericalString);
        
        updateUI();
    });

    function updateUI() {
        elements.currentStringElement.textContent = game.numericalString;
        elements.player1ScoreElement.textContent = game.player1Score;
        elements.player2ScoreElement.textContent = game.player2Score;
        elements.currentPlayerElement.textContent = `Player ${game.currentPlayer}`;

        if (game.numericalString.length === 1) {
            alert(game.endGame());
            elements.sumUpButton.disabled = true;
            elements.deleteNumberButton.disabled = true;
        }
    }

    function updateLogChangesInString(numericalString) {
        const listStringChanges = document.getElementById('log-list-changes-string');
        const listItem = document.createElement('li');
        listItem.textContent = numericalString;
        listStringChanges.appendChild(listItem);
    }
    

    function getElements() {
        return {
            currentStringElement: document.getElementById('current-string'),
            player1ScoreElement: document.getElementById('player1-score'),
            player2ScoreElement: document.getElementById('player2-score'),
            currentPlayerElement: document.getElementById('current-player'),
            sumUpButton: document.getElementById('sum-up-btn'),
            deleteNumberButton: document.getElementById('delete-number-btn'),
            startGameButton: document.querySelector('.start-game-btn'),
            additionalContent: document.getElementById('additional-content'),
            logChangesInString: document.getElementById('log-changes-string'),
            logPlayerMoves: document.getElementById('log-moves'),
            logStartStringListElem: document.getElementById('log-start-string'),
        };
    }
});
