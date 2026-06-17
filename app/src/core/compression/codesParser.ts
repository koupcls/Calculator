export const parseMassInput = (text: string, algorithm: string): any[] => {
  let str = text.trim()
  const result: any[] = []

  while (str.length > 0) {
    // Удаляем ведущие запятые и пробелы перед кодом
    str = str.replace(/^[\s,]+/, '')
    if (str.length === 0) break

    // LZ77: <offset, length, 'char'>
    if (algorithm === 'lz77') {
      const match = str.match(/^<\s*(\d+)\s*,\s*(\d+)\s*,\s*(?:"([^"]*)"|'([^']*)')\s*>/)
      if (match) {
        const char = match[3] !== undefined ? match[3] : match[4]
        result.push({
          offset: parseInt(match[1]),
          length: parseInt(match[2]),
          nextChar: char || ''
        })
        str = str.slice(match[0].length)
        continue
      }
    }

    // LZSS: 0, 'a' ИЛИ 1, <offset, length>
    if (algorithm === 'lzss') {
      const matchLiteral = str.match(/^0\s*,\s*(?:"([^"]*)"|'([^']*)')/)
      if (matchLiteral) {
        const char = matchLiteral[1] !== undefined ? matchLiteral[1] : matchLiteral[2]
        result.push({ isLiteral: true, offset: 0, length: 1, symbol: char || '' })
        str = str.slice(matchLiteral[0].length)
        continue
      }
      const matchRef = str.match(/^1\s*,\s*<\s*(\d+)\s*,\s*(\d+)\s*>/)
      if (matchRef) {
        result.push({ isLiteral: false, offset: parseInt(matchRef[1]), length: parseInt(matchRef[2]), symbol: '' })
        str = str.slice(matchRef[0].length)
        continue
      }
    }

    // LZ78: <dictIndex, 'char'>
    if (algorithm === 'lz78') {
      const match = str.match(/^<\s*(\d+)\s*,\s*(?:"([^"]*)"|'([^']*)')\s*>/)
      if (match) {
        const char = match[2] !== undefined ? match[2] : match[3]
        result.push({
          dictIndex: parseInt(match[1]),
          symbol: char || ''
        })
        str = str.slice(match[0].length)
        continue
      }
    }

    // LZW: поток чисел преобразуется в массив объектов { code: number }
    if (algorithm === 'lzw') {
      const match = str.match(/^(\d+)/)
      if (match) {
        result.push({ code: parseInt(match[1]) })
        str = str.slice(match[0].length)
        continue
      }
    }

    // Если встретили мусор — прерываем чтение
    break
  }

  return result
}