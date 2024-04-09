import { getElementById } from './getElementById.js';

export function addEnterPress() {
    // Event listener for the enter key press on the length input field
    getElementById('length-number').addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            document.querySelector('.start-game-btn').click();
        }
    });
}
