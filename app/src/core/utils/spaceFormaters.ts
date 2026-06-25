// ' ' to '_'
export function formateSpace(symbol: string): string {
    return symbol.length == 1 ? symbol.replace(' ', '_') : symbol
}

export function formateSpaces(line: string, pattern: string = ' '): string {
    const spacePattern = pattern.replaceAll(' ', '_')
    return line.replaceAll(pattern, spacePattern)
}

// '_' to ' '
export function unformateSpace(symbol: string): string {
    return symbol.length == 1 ? symbol.replace('_', ' ') : symbol
}

export function unformateSpaces(line: string, pattern: string = '_'): string {
    const spacePattern = pattern.replaceAll('_', ' ')
    return line.replaceAll(pattern, spacePattern)
}