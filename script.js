import Game from './js/game.js';
import { showElementsOnGameStart } from './js/showElementsOnGameStart.js';
import { addEnterPress } from './utils/addEnterPressEvent.js';
import { getElements } from './utils/getDOMElements.js';
import { getElementById } from './utils/getElementById.js';
import { stringAsSpans } from './utils/stringAsSpans.js';

function start() {
    const {
        startGameButton,
        modeSelect,
        playerSelect,
        inputSection,
        currentStringElement,
        userScoreElement,
        pcScoreElement,
        additionalContent,
        logChangesInString,
        logPlayerMoves,
        logStartStringListElem,
        restartButton,
        winnerParagraph,
    } = getElements();

    addEnterPress();

    let game;

    function startGameButtonClick() {
        const length = parseInt(getElementById('length-number').value);

        if (length < 15 && length > 25) {
            return alert('Please enter a number between 15 and 25.');
        }

        const playerTurn = playerSelect.value;
        game = new Game(length, modeSelect.value, playerTurn);

        updateUI();
        showElementsOnGameStart(
            { additionalContent, logPlayerMoves, logChangesInString, logStartStringListElem, inputSection },
            game
        );

        if (playerTurn === 'PC') {
            setTimeout(() => {
                game.playTurn();
            }, 300);
        }
    }

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
        userScoreElement.textContent = game.userScore;
        pcScoreElement.textContent = game.pcScore;

        updateUIendGame();
    }

    // Function to update UI on end Game
    function updateUIendGame() {
        if (game.numericalString.length === 1) {
            restartButton.style.display = 'block';
            winnerParagraph.style.color = 'green';
            winnerParagraph.textContent = game.endGame();

            currentStringElement.removeEventListener('click', handleClick);
        }
    }

    // Function to restart the game
    restartButton.addEventListener('click', function () {
        window.location.reload();
    });

    // Event listener for the start game button click
    startGameButton.addEventListener('click', startGameButtonClick);

    // Event listener for the click on the current string
    currentStringElement.addEventListener('click', handleClick);
}

document.addEventListener('DOMContentLoaded', start);
