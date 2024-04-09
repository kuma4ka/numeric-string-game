// Generate a random numerical string of a given length
export function generateNumericalString(length) {
    let numericalString = '';
    for (let i = 0; i < length; i++) {
        numericalString += Math.floor(Math.random() * 6) + 1;
    }
    return numericalString;
}
