// Function to generate span pair
export function generateSpanPair(pair, index) {
    const spanPair = document.createElement('span');
    spanPair.textContent = pair.join('');

    spanPair.classList.add(pair.length === 1 ? 'unpaired' : 'paired');

    spanPair.setAttribute('data-index', index);

    return spanPair;
}
