import { generateSpanPair } from './generateSpanPair.js';
import { getElementById } from './getElementById.js';

// Function to convert the string into spans
export function stringAsSpans(pairs) {
    const pCurrentString = getElementById('current-string');
    pCurrentString.innerHTML = 'Current string: ';

    pairs.forEach((pair, index) => {
        const spanPair = generateSpanPair(pair, index);
        pCurrentString.appendChild(spanPair);
    });
}
