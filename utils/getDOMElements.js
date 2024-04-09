import { getElementById } from './getElementById.js';

// Function to get the DOM elements
export function getElements() {
    return {
        inputSection: document.querySelector('.input-section'),
        currentStringElement: getElementById('current-string'),
        userScoreElement: getElementById('user-score'),
        pcScoreElement: getElementById('pc-score'),
        startGameButton: document.querySelector('.start-game-btn'),
        additionalContent: getElementById('additional-content'),
        logChangesInString: getElementById('log-changes-string'),
        logPlayerMoves: getElementById('log-moves'),
        logStartStringListElem: getElementById('log-start-string'),
        restartButton: getElementById('restart-btn'),
        winnerParagraph: getElementById('winner'),
        modeSelect: getElementById('algorithm-select'),
        playerSelect: getElementById('player-select'),
    };
}
