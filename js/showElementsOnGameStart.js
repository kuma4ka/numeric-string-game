// first arg - elements
// second arg - game
export function showElementsOnGameStart(
    { additionalContent, logPlayerMoves, logChangesInString, logStartStringListElem, inputSection },
    { numericalString }
) {
    additionalContent.style.display = 'block';
    logPlayerMoves.style.display = 'block';
    logChangesInString.style.display = 'block';
    logStartStringListElem.textContent = `Start string: ${numericalString}`;
    inputSection.style.display = 'none';
}
