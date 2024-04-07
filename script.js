import Game from './js/game.js';

document.addEventListener("DOMContentLoaded", function () {
    const elements = getElements();
    let game;

    // Event listener for the enter key press on the length input field
    document.getElementById('length-number').addEventListener('keypress', handleEnterKeyPress);

    // Event listener for the start game button click
    elements.startGameButton.addEventListener('click', function () {
        const length = parseInt(document.getElementById('length-number').value);
        if (length >= 15 && length <= 25) {
            const mode = elements.modeSelect.value;
            const playerTurn = elements.playerSelect.value;
            game = new Game(length, mode, playerTurn);
            updateUI();
            elements.additionalContent.style.display = 'block';
            elements.logPlayerMoves.style.display = 'block';
            elements.logChangesInString.style.display = 'block';
            elements.logStartStringListElem.textContent = `Start string: ${game.numericalString}`;
            elements.inputSection.style.display = 'none';
            if (playerTurn === 'PC') {
                setTimeout(() => {
                    game.playTurn();
                }, 300);
            }
        } else {
            alert('Please enter a number between 15 and 25.');
        }
    });

    // Event listener for the click on the current string
    document.getElementById('current-string').addEventListener('click', handleClick);

    // Function to handle the click on the current string
    function handleClick(event) {
        const clickedSpan = event.target;
        if (clickedSpan.classList.contains('paired') || clickedSpan.classList.contains('unpaired')) {
            const clickedSpanIndex = clickedSpan.getAttribute('data-index');
            const clickedSpanClass = clickedSpan.classList[0];
            game.playTurn(clickedSpanIndex, clickedSpanClass);
            updateUI();
        }
    }

    // Function to update the UI
    function updateUI() {
        stringAsSpans(game.generatePairs());
        elements.userScoreElement.textContent = game.userScore;
        elements.pcScoreElement.textContent = game.pcScore;

        if (game.numericalString.length === 1) {
            let winner = game.endGame();
            elements.restartButton.style.display = 'block';
            elements.winnerParagraph.textContent = winner;
            elements.winnerParagraph.style.color = 'green';
            restartGame();
            document.getElementById('current-string').removeEventListener('click', handleClick);
        }
    }
    
    // Function to convert the string into spans
    function stringAsSpans(pairs) {
        const pCurrentString = document.getElementById('current-string');
        pCurrentString.innerHTML = 'Current string: ';
    
        pairs.forEach((pair, index) => {
            const spanPair = document.createElement('span');
            spanPair.textContent = pair.flat().join('');
            if (pair.length === 1) spanPair.classList.add('unpaired');
            else spanPair.classList.add('paired');
            spanPair.setAttribute('data-index', index);
            pCurrentString.appendChild(spanPair);
        });
    }

    // Function to restart the game
    function restartGame() {
        elements.restartButton.addEventListener('click', function () {
            document.getElementById('current-string').addEventListener('click', handleClick);
            elements.inputSection.style.display = 'block';
            elements.additionalContent.style.display = 'none';
            elements.logPlayerMoves.style.display = 'none';
            elements.logChangesInString.style.display = 'none';
            elements.restartButton.style.display = 'none';
            elements.logStartStringListElem.textContent = '';
            elements.logChangesInString.innerHTML = '';
            elements.logPlayerMoves.innerHTML = '';
            elements.userScoreElement.textContent = 0;
            elements.pcScoreElement.textContent = 0;
        });
    }

    // Function to get the DOM elements
    function getElements() {
        return {
            inputSection: document.querySelector('.input-section'),
            currentStringElement: document.getElementById('current-string'),
            userScoreElement: document.getElementById('user-score'),
            pcScoreElement: document.getElementById('pc-score'),
            startGameButton: document.querySelector('.start-game-btn'),
            additionalContent: document.getElementById('additional-content'),
            logChangesInString: document.getElementById('log-changes-string'),
            logPlayerMoves: document.getElementById('log-moves'),
            logStartStringListElem: document.getElementById('log-start-string'),
            restartButton: document.getElementById('restart-btn'),
            winnerParagraph: document.getElementById('winner'),
            modeSelect: document.getElementById('algorithm-select'),
            playerSelect: document.getElementById('player-select')
        };
    }

    // Function to handle the enter key press
    function handleEnterKeyPress(event) {
        if (event.key === 'Enter') {
            document.querySelector('.start-game-btn').click();
        }
    }

    // Function to restart the game
    function restartGame() {
        elements.restartButton.addEventListener('click', function () {
            window.location.reload();
        });
    }
});
