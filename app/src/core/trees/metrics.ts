export function calculateFrequencies(input: string): Record<string, number> {
    
    const frequencies: Record<string, number> = {}

    for (const s of input) {
        frequencies[s] = (frequencies[s] || 0) + 1;
    }

    return frequencies;
} 

// E
export function calculateEntropy(inputLength: number, frequencies: Record<string, number>): number {
    if (inputLength <= 0) return 0;

    let entropy = 0;
    for (const [_, count] of Object.entries(frequencies)) {
        const p = count / inputLength;
        entropy -= p * Math.log2(p);
    }

    return entropy;
}

// H0
export function calculateMaxEntropy(alphabetSize: number): number {
    if (alphabetSize <= 0) return 0;
    return Math.log2(alphabetSize)
}

// R
export function calculateAbsoluteRedundancy(Entropy: number, maxEntropy: number) {
    return maxEntropy - Entropy
}

// r0
export function calculateRelativeRedundancy(Entropy: number, maxEntropy: number) {
    if (maxEntropy === 0) return 0;
    return 1 - Entropy/maxEntropy
}

// M
export function calculateMean(inputLength: number, codes: Record<string, string>, frequencies: Record<string, number>): number {
    if (inputLength <= 0) return 0;

    let mean = 0
    for (const [symbol, code] of Object.entries(codes)) {
        mean += code.length * (frequencies[symbol] || 0)
    }
    return mean / inputLength
}