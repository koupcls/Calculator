// ============ LZ77 ============
export interface LZ77Step {
  dictionary: string
  input: string
  code: string
}

export function lz77Compress(text: string): LZ77Step[] {
  if (!text) return []
  
  const steps: LZ77Step[] = []
  let dict = ''
  let pos = 0

  while (pos < text.length) {
    let bestLen = 0
    let bestIdx = 0

    for (let i = 0; i < dict.length; i++) {
      let len = 0
      while (pos + len < text.length && dict[i + len] === text[pos + len]) {
        len++
      }
      if (len > bestLen) {
        bestLen = len
        bestIdx = i
      }
    }

    const nextChar = pos + bestLen < text.length ? text[pos + bestLen] : ''
    const code = `<${bestIdx}, ${bestLen}, '${nextChar || ' '}'>`

    steps.push({
      dictionary: dict || '-',
      input: text.slice(pos),
      code
    })

    dict += text.slice(pos, pos + bestLen + 1)
    pos += bestLen + 1
  }

  return steps
}

// ============ LZSS ============
export interface LZSSStep {
  dictionary: string
  input: string
  code: string
  isLiteral: boolean
}

export function lzssCompress(text: string): LZSSStep[] {
  if (!text) return []
  
  const steps: LZSSStep[] = []
  let dict = ''
  let pos = 0

  while (pos < text.length) {
    let bestLen = 0
    let bestIdx = 0

    for (let i = 0; i < dict.length; i++) {
      let len = 0
      while (pos + len < text.length && dict[i + len] === text[pos + len]) {
        len++
      }
      if (len > bestLen) {
        bestLen = len
        bestIdx = i
      }
    }

    let step: LZSSStep
    if (bestLen > 0) {
      step = {
        dictionary: dict || '-',
        input: text.slice(pos),
        code: `1<${bestIdx},${bestLen}>`,
        isLiteral: false
      }
      dict += text.slice(pos, pos + bestLen)
      pos += bestLen
    } else {
      const char = text[pos]
      step = {
        dictionary: dict || '-',
        input: text.slice(pos),
        code: `0, '${char}'`,
        isLiteral: true
      }
      dict += char
      pos += 1
    }

    steps.push(step)
  }

  return steps
}

// ============ LZ78 ============
export interface LZ78Step {
  position: number
  dictionary: string[]
  code: string
}

export function lz78Compress(text: string): LZ78Step[] {
  if (!text) return []
  
  const steps: LZ78Step[] = []
  const dictionary: Map<string, number> = new Map()
  let pos = 0
  let dictPos = 1

  while (pos < text.length) {
    let currentStr = text[pos]
    let foundInDict = false

    // Ищем самую длинную последовательность в словаре
    while (currentStr.length <= text.length - pos) {
      if (dictionary.has(currentStr)) {
        foundInDict = true
        currentStr += text[pos + currentStr.length - 1] || ''
      } else {
        break
      }
    }

    // Если нашли в словаре, берём предыдущую строку
    if (foundInDict && currentStr.length > 1) {
      currentStr = currentStr.slice(0, -1)
    }

    const dictIndex = dictionary.get(currentStr) || 0
    const lastChar = pos + currentStr.length < text.length 
      ? text[pos + currentStr.length] 
      : text[pos + currentStr.length - 1]

    const code = `<${dictIndex}, '${lastChar}'>`

    // Добавляем новую последовательность в словарь
    const newEntry = currentStr + lastChar
    if (!dictionary.has(newEntry)) {
      dictionary.set(newEntry, dictPos)
      dictPos++
    }

    const dictArray = Array.from(dictionary.keys())

    steps.push({
      position: dictPos - 1,
      dictionary: dictArray,
      code
    })

    pos += currentStr.length + 1
  }

  return steps
}

// ============ LZW ============
export interface LZWStep {
  position: number
  dictionary: string[]
  code: number
}

export function lzwCompress(text: string, alphabet: string): LZWStep[] {
  if (!text || !alphabet) return []
  
  const steps: LZWStep[] = []
  const dictionary: Map<string, number> = new Map()
  
  // Инициализация словаря алфавитом (позиции 1-35)
  for (let i = 0; i < alphabet.length; i++) {
    dictionary.set(alphabet[i], i + 1)
  }
  
  // Добавляем пробел и дефис если их нет
  if (!alphabet.includes(' ')) {
    dictionary.set(' ', dictionary.size + 1)
  }
  if (!alphabet.includes('-')) {
    dictionary.set('-', dictionary.size + 1)
  }

  let currentStr = ''
  let nextPos = dictionary.size + 1

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const combined = currentStr + char

    if (dictionary.has(combined)) {
      currentStr = combined
    } else {
      // Выводим код для текущей строки
      const code = dictionary.get(currentStr) || 0
      const dictArray = Array.from(dictionary.keys())
      
      steps.push({
        position: nextPos - 1,
        dictionary: [...dictArray],
        code
      })

      // Добавляем новую последовательность
      dictionary.set(combined, nextPos)
      nextPos++
      currentStr = char
    }
  }

  // Последняя строка
  if (currentStr) {
    const code = dictionary.get(currentStr) || 0
    const dictArray = Array.from(dictionary.keys())
    
    steps.push({
      position: nextPos,
      dictionary: [...dictArray],
      code
    })
  }

  return steps
}