import Game from './game.js';

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
            elements.inputSection.style.display = 'none'; // Hide input section
        } else {
            alert('Please enter a number between 15 and 25.');
        }
    });

    // Remove event listeners for sumUpButton and deleteNumberButton

    // Event listener for clicks on pairs
    document.getElementById('current-string').addEventListener('click', function (event) {
        const clickedSpan = event.target;
        if (clickedSpan.classList.contains('paired') || clickedSpan.classList.contains('unpaired')) {
            const clickedSpanIndex = clickedSpan.getAttribute('data-index');
            const clickedSpanClass = clickedSpan.classList[0];
            game.playTurn(clickedSpanIndex, clickedSpanClass); // Pass the clicked pair to playTurn


            updateLogChangesInString(game.numericalString);
            updateLogPlayerMoves();
            updateUI();
        }
    });

    function updateUI() {
        stringAsSpans(game.generatePairs());
        elements.player1ScoreElement.textContent = game.player1Score;
        elements.player2ScoreElement.textContent = game.player2Score;
        elements.currentPlayerElement.textContent = `Player ${game.currentPlayer}`;

        if (game.numericalString.length === 1) {
            alert(game.endGame());
            // Disable event listener for clicks on pairs
            document.getElementById('current-string').removeEventListener('click', function(){});
        }
    }
    function stringAsSpans(pairs) {
        const pCurrentString = document.getElementById('current-string');
        pCurrentString.innerHTML = 'Current string: '; // Clear existing content
    
        pairs.forEach((pair, index) => { // Access index parameter in forEach
            const spanPair = document.createElement('span');
            spanPair.textContent = pair.flat().join('');
            if (pair.length === 1) spanPair.classList.add('unpaired'); // Add a class to unpaired numbers
            else spanPair.classList.add('paired'); // Add a class to each span
            spanPair.setAttribute('data-index', index); // Set data-index attribute with current index
            pCurrentString.appendChild(spanPair);
        });
    }

    function updateLogChangesInString(numericalString) {
        const listStringChanges = document.getElementById('log-list-changes-string');
        const listItem = document.createElement('li');
        listItem.textContent = numericalString;
        listStringChanges.appendChild(listItem);
    }
    
    function updateLogPlayerMoves() {
        const listPlayerMoves = document.getElementById('log-list-player-moves');
        const listItem = document.createElement('li');
        listItem.textContent = `Player ${game.currentPlayer} made a move`;
        listPlayerMoves.appendChild(listItem);
    }

    function getElements() {
        return {
            inputSection: document.querySelector('.input-section'),
            currentStringElement: document.getElementById('current-string'),
            player1ScoreElement: document.getElementById('player1-score'),
            player2ScoreElement: document.getElementById('player2-score'),
            currentPlayerElement: document.getElementById('current-player'),
            startGameButton: document.querySelector('.start-game-btn'),
            additionalContent: document.getElementById('additional-content'),
            logChangesInString: document.getElementById('log-changes-string'),
            logPlayerMoves: document.getElementById('log-moves'),
            logStartStringListElem: document.getElementById('log-start-string'),
        };
    }
});
