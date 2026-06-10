export interface CompressionStep<TCode> {
  code: TCode;
  stringCode: string; 
}

export interface LZ77Code { 
  offset: number;
  length: number;
  nextChar: string;
}

export interface LZ77Step extends CompressionStep<LZ77Code> {
  dictionary: string; 
  input: string; 
}

export interface LZSSCode { 
  isLiteral: boolean; 
  offset?: number; 
  length?: number; 
  symbol: string; 
}

export interface LZSSStep extends CompressionStep<LZSSCode> { 
  dictionary: string; 
  input: string; 
}

export interface LZ78Code { 
  dictIndex: number; 
  symbol: string; 
}

export interface LZ78Step extends CompressionStep<LZ78Code> { 
  stepIndex: number; 
  dictionary: string[]; 
}

export type LZWCode = number;

export interface LZWStep extends CompressionStep<LZWCode> { 
  stepIndex: number; 
  dictionary: string[]; 
}


export function lz77Compress(inputText: string): LZ77Step[] {
  if (!inputText) return [];
  
  const steps: LZ77Step[] = [];
  const textLength = inputText.length;
  let currentPosition = 0;
  let dictionary = '';

  while (currentPosition < textLength) {
    const currentChar = inputText[currentPosition];
    const dictionaryLength = dictionary.length;

    if (dictionary.indexOf(currentChar) === -1) {
      steps.push({
        dictionary,
        input: inputText.slice(currentPosition),
        code: { offset: 0, length: 0, nextChar: currentChar },
        stringCode: `<0, 0, '${currentChar}'>`
      });
      dictionary += currentChar;
      currentPosition++;
      continue;
    }

    let bestMatchIndex = 0;
    let maxMatchLength = 0;

    for (let i = dictionaryLength - 1; i >= 0; i--) {
      if (dictionary[i] === currentChar) {
        let currentMatchLength = 0;
        const matchStartOffset = currentPosition - dictionaryLength + i;
        
        while (matchStartOffset + currentMatchLength < currentPosition) {
          if (inputText[matchStartOffset + currentMatchLength] === inputText[currentPosition + currentMatchLength]) {
            currentMatchLength++;
          } else {
            break;
          }
        }

        if (currentMatchLength > maxMatchLength) {
          maxMatchLength = currentMatchLength;
          bestMatchIndex = i;
        }
      }
    }

    if (currentPosition + maxMatchLength + 1 >= textLength) {
      maxMatchLength -= 1;
    }

    const nextCharPosition = currentPosition + maxMatchLength;
    const nextChar = nextCharPosition < textLength ? inputText[nextCharPosition] : '';
    const calculatedOffset = dictionaryLength - bestMatchIndex - 1;

    steps.push({
      dictionary,
      input: inputText.slice(currentPosition),
      code: { offset: calculatedOffset, length: maxMatchLength, nextChar },
      stringCode: `<${calculatedOffset}, ${maxMatchLength}, '${nextChar}'>`
    });

    dictionary += inputText.slice(currentPosition, currentPosition + maxMatchLength + 1);
    currentPosition += maxMatchLength + 1;
  }

  return steps;
}


export function lzssCompress(inputText: string): LZSSStep[] {
  if (!inputText) return [];
  
  const steps: LZSSStep[] = [];
  const textLength = inputText.length;
  let currentPosition = 0;
  let dictionary = '';

  while (currentPosition < textLength) {
    const currentChar = inputText[currentPosition];
    const dictionaryLength = dictionary.length;

    if (dictionary.indexOf(currentChar) === -1) {
      steps.push({
        dictionary,
        input: inputText.slice(currentPosition),
        code: { isLiteral: true, symbol: currentChar },
        stringCode: `0, '${currentChar}'`
      });
      dictionary += currentChar;
      currentPosition++;
      continue;
    }

    let bestMatchIndex = 0;
    let maxMatchLength = 0;

    for (let i = dictionaryLength - 1; i >= 0; i--) {
      if (dictionary[i] === currentChar) {
        let currentMatchLength = 0;
        const matchStartOffset = currentPosition - dictionaryLength + i;
        
        while (matchStartOffset + currentMatchLength < currentPosition) {
          if (inputText[matchStartOffset + currentMatchLength] === inputText[currentPosition + currentMatchLength]) {
            currentMatchLength++;
          } else {
            break;
          }
        }

        if (currentMatchLength > maxMatchLength) {
          maxMatchLength = currentMatchLength;
          bestMatchIndex = i;
        }
      }
    }

    const symbolPosition = currentPosition + maxMatchLength - 1;
    const symbol = symbolPosition < textLength ? inputText[symbolPosition] : '';
    const calculatedOffset = dictionaryLength - bestMatchIndex - 1;

    steps.push({
      dictionary,
      input: inputText.slice(currentPosition),
      code: { isLiteral: false, offset: calculatedOffset, length: maxMatchLength, symbol },
      stringCode: `1, <${calculatedOffset}, ${maxMatchLength}>`
    });

    dictionary += inputText.slice(currentPosition, currentPosition + maxMatchLength);
    currentPosition += maxMatchLength;
  }

  return steps;
}


export function lz78Compress(inputText: string): LZ78Step[] {
  const dictionary: string[] = [];
  const steps: LZ78Step[] = [];
  const textLength = inputText.length;
  let currentPosition = 0;

  while (currentPosition < textLength) {
    const currentChar = inputText[currentPosition];
    let maxMatchLength = 0;
    let bestDictionaryIndex = -1;

    for (let i = 0; i < dictionary.length; i++) {
      if (dictionary[i][0] === currentChar) {
        const prefix = dictionary[i];
        let matchCount = 0;
        let isPrefixFullyMatched = true;

        for (; matchCount < prefix.length && currentPosition + matchCount < textLength; matchCount++) {
          if (inputText[currentPosition + matchCount] !== prefix[matchCount]) {
            isPrefixFullyMatched = false;
            break;
          }
        }

        if (isPrefixFullyMatched && matchCount > maxMatchLength) {
          maxMatchLength = matchCount;
          bestDictionaryIndex = i;
        }
      }
    }

    if (bestDictionaryIndex === -1) {
      steps.push({
        stepIndex: steps.length,
        dictionary: [...dictionary],
        code: { dictIndex: 0, symbol: currentChar },
        stringCode: `<0, '${currentChar}'>`
      });
      dictionary.push(currentChar);
      currentPosition++;
    } else {
      const nextChar = inputText[currentPosition + maxMatchLength] || '';
      const displayDictIndex = bestDictionaryIndex + 1;

      steps.push({
        stepIndex: steps.length,
        dictionary: [...dictionary],
        code: { dictIndex: displayDictIndex, symbol: nextChar },
        stringCode: `<${displayDictIndex}, '${nextChar}'>`
      });
      dictionary.push(dictionary[bestDictionaryIndex] + nextChar);
      currentPosition += maxMatchLength + 1;
    }
  }

  return steps;
}


export function lzwCompress(inputText: string, alphabet: string): LZWStep[] {
  if (!inputText) return [];

  const dictionary: string[] = alphabet.split('');
  const steps: LZWStep[] = [];
  const dictionaryMap = new Map<string, number>();

  for (let i = 0; i < dictionary.length; i++) {
    dictionaryMap.set(dictionary[i], i);
  }

  const textLength = inputText.length;
  let currentPosition = 0;
  let nextStepIndex = alphabet.length;

  while (currentPosition < textLength) {
    let currentMatch = inputText[currentPosition];
    let matchLength = 1;
    let bestDictionaryIndex = dictionaryMap.get(currentMatch) ?? -1;

    while (currentPosition + matchLength < textLength) {
      const nextChar = inputText[currentPosition + matchLength];
      const combinedPhrase = currentMatch + nextChar;

      if (dictionaryMap.has(combinedPhrase)) {
        currentMatch = combinedPhrase;
        bestDictionaryIndex = dictionaryMap.get(combinedPhrase)!;
        matchLength++;
      } else {
        break;
      }
    }

    const codeValue = bestDictionaryIndex + 1;
    steps.push({
      stepIndex: nextStepIndex++,
      dictionary: [...dictionary], 
      code: codeValue,
      stringCode: codeValue.toString()
    });

    if (currentPosition + matchLength < textLength) {
      const nextChar = inputText[currentPosition + matchLength];
      const newPhrase = currentMatch + nextChar;
      
      dictionary.push(newPhrase);
      dictionaryMap.set(newPhrase, dictionary.length - 1);
    }

    currentPosition += matchLength;
  }

  return steps;
}