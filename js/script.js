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

    document.getElementById('current-string').addEventListener('click', handleClick);

    function handleClick(event) {
        const clickedSpan = event.target;
        if (clickedSpan.classList.contains('paired') || clickedSpan.classList.contains('unpaired')) {
            const clickedSpanIndex = clickedSpan.getAttribute('data-index');
            const clickedSpanClass = clickedSpan.classList[0];
            game.playTurn(clickedSpanIndex, clickedSpanClass); // Pass the clicked pair to playTurn
            updateUI();
        }
    }

    function updateUI() {
        stringAsSpans(game.generatePairs());
        elements.userScoreElement.textContent = game.userScore;
        elements.pcScoreElement.textContent = game.pcScore;

        if (game.numericalString.length === 1) {
            alert(game.endGame());
            elements.restartButton.style.display = 'block';
            restartGame();
            // Disable event listener for clicks on pairs
            document.getElementById('current-string').removeEventListener('click', handleClick);
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

    function restartGame() {
        elements.restartButton.addEventListener('click', function () {
            elements.inputSection.style.display = 'block'; // Show input section
            elements.additionalContent.style.display = 'none'; // Hide additional content
            elements.logPlayerMoves.style.display = 'none'; // Hide logPlayerMoves
            elements.logChangesInString.style.display = 'none'; // Hide logChangesInString
            elements.restartButton.style.display = 'none'; // Hide restart button
            elements.logStartStringListElem.textContent = ''; // Clear start string
            elements.logChangesInString.innerHTML = ''; // Clear logChangesInString
            elements.logPlayerMoves.innerHTML = ''; // Clear logPlayerMoves
            elements.userScoreElement.textContent = 0; // Reset user score
            elements.pcScoreElement.textContent = 0; // Reset PC score
        });
    }

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
        };
    }
});
