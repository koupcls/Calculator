import type { Frequencies } from '../trees/storeTypes'

// Вспомогательная функция для получения сокращенной дроби в виде строки
function toFractionString(numerator: number, denominator: number): string {
  if (numerator === 0) return '0';
  
  // Ищем наибольший общий делитель (Алгоритм Евклида)
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const commonDivisor = gcd(numerator, denominator);
  
  const reducedNum = numerator / commonDivisor;
  const reducedDen = denominator / commonDivisor;
  
  // Если знаменатель стал равен 1, возвращаем просто число (например, 4/1 -> 4)
  return reducedDen === 1 ? `${reducedNum}` : `${reducedNum}/${reducedDen}`;
}

export function formatEntropyFormula(freqs: Frequencies, n: number): string {
  if (n === 0) return 'E = 0'
  
  // 1. Формируем слагаемые вида: 1/4×log₂(1/4)
  const terms = Object.entries(freqs)
    .map(([_, count]) => {
      const frac = toFractionString(count, n);
      return `${frac}×log₂(${frac})`;
    })
    .join(' + ') // Соединяем через плюс, так как вынесли минус за знак суммы

  // 2. Считаем итоговое числовое значение
  const value = Object.entries(freqs).reduce((acc, [_, count]) => {
    const p = count / n
    return acc - p * Math.log2(p)
  }, 0)

  // Итоговый вывод: минус перед скобкой всей суммы
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
  
  // Для математического ожидания тоже подставляем обыкновенные дроби для p_i
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
