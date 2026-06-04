import type { Frequencies, Codes } from '../trees/storeTypes'

function toFractionString(numerator: number, denominator: number): string {
  if (numerator === 0) return '0';
  
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const commonDivisor = gcd(numerator, denominator);
  
  const reducedNum = numerator / commonDivisor;
  const reducedDen = denominator / commonDivisor;
  
  return reducedDen === 1 ? `${reducedNum}` : `${reducedNum}/${reducedDen}`;
}

export function formatEntropyFormula(freqs: Frequencies, n: number): string {
  if (n === 0) return 'E = 0'
  
  const terms = Object.entries(freqs)
    .map(([_, count]) => {
      const frac = toFractionString(count, n);
      return `${frac}×log₂(${frac})`;
    })
    .join(' + ')

  const value = Object.entries(freqs).reduce((acc, [_, count]) => {
    const p = count / n
    return acc - p * Math.log2(p)
  }, 0)

  return `E = -Σ(p·log₂p) = -(${terms}) = ${value.toFixed(4)}`
}

export function formatMaxEntropyFormula(m: number): string {
  const value = Math.log2(m)
  return `H₀ = log₂(m) = log₂(${m}) = ${value.toFixed(4)}`
}

export function formatRedundancyFormula(e: number, h0: number): string {
  const r = h0 - e
  return `R = H₀ - E = ${h0.toFixed(4)} - ${e.toFixed(4)} = ${r.toFixed(4)}`
}

export function formatRelativeRedundancyFormula(e: number, h0: number): string {
  const r0 = h0 === 0 ? 0 : 1 - e / h0
  return `r₀ = 1 - E/H₀ = 1 - ${e.toFixed(4)}/${h0.toFixed(4)} = ${r0.toFixed(4)}`
}

export function formatMeanFormula(
  codes: Record<string, string>,
  freqs: Frequencies,
  n: number
): string {
  if (n === 0) return 'M = 0'
  
  const terms = Object.entries(codes)
    .map(([sym, code]) => {
      const count = freqs[sym] || 0;
      const frac = toFractionString(count, n);
      return `${code.length}×(${frac})`;
    })
    .join(' + ')

  const value = Object.entries(codes).reduce((acc, [sym, code]) => {
    return acc + code.length * ((freqs[sym] || 0) / n)
  }, 0)

  return `M = Σ(lᵢ·pᵢ) = ${terms} = ${value.toFixed(4)}`
}

export function codeLine(line: string, codes: Codes): string {
  let result: string = ""
  for (const symb of line) {
    result += (codes[symb] ?? '') + ' '
  }
  return result.trim()
}