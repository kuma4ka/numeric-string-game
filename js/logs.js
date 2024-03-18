import Game from './game.js';

class Logger {
    static updateLogChangesInString(numericalString) {
        const listStringChanges = document.getElementById('log-list-changes-string');
        const listItem = document.createElement('li');
        listItem.textContent = `Updated string: ${numericalString}.`;
        listStringChanges.appendChild(listItem);
    }
    
    static updateLogPlayerMoves(playerMove) {
        const listPlayerMoves = document.getElementById('log-list-player-moves');
        const listItem = document.createElement('li');
        listItem.textContent = playerMove;
        listPlayerMoves.appendChild(listItem);
    }

}

export default Logger;