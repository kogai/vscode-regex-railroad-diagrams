enum TokenKind {
  Extraneous,
  RegexLiteralStart,
  RegexLiteralEnd,
  RegexLiteralOption,
  RegexLiteralBody,
}

interface RegExpToken {
  kind: string
  prev?: string
  next?: string
  value: string
  inRegex: boolean
  offset: number
}

export const lexer = (ss: string, tokens: RegExpToken[] = []): RegExpToken[] => {
  if (ss.length === 0) {
    return tokens
  }
  const value = ss[0]
  const tail = ss.slice(1)
  const prevToken = tokens[tokens.length - 1] || { offset: -1 }
  const prev = prevToken.value
  const next = tail[0]
  const offset = prevToken.offset + 1

  let kind: string
  let inRegex: boolean
  const isPreviousRegex = !!prevToken.value && prevToken.inRegex

  if (value === "/") {
    if (prevToken.value === "\\") {
      kind = TokenKind[TokenKind.RegexLiteralBody]
      inRegex = true
    } else if (!isPreviousRegex && next === "/" || !isPreviousRegex && next === "*" || !isPreviousRegex && prevToken.value === "/" || !isPreviousRegex && prevToken.value === "*") {
      kind = TokenKind[TokenKind.Extraneous]
      inRegex = false
    } else {
      kind = isPreviousRegex ? TokenKind[TokenKind.RegexLiteralEnd] : TokenKind[TokenKind.RegexLiteralStart]
      inRegex = true
    }
  } else {
    if (prevToken) {
      if (prevToken.inRegex && (value === "g" || value === "i" || value === "m" || value === "u" || value === "y")) {
        kind = TokenKind[TokenKind.RegexLiteralOption]
        inRegex = true
      } else {
        if (prevToken.kind === TokenKind[TokenKind.RegexLiteralOption]) {
          kind = TokenKind[TokenKind.Extraneous]
          inRegex = false
        } else {
          kind = isPreviousRegex && prevToken.kind !== TokenKind[TokenKind.RegexLiteralEnd] ? TokenKind[TokenKind.RegexLiteralBody] : TokenKind[TokenKind.Extraneous]
          inRegex = isPreviousRegex
        }
      }
    } else {
      kind = TokenKind[TokenKind.Extraneous]
      inRegex = false
    }
  }

  const character: RegExpToken = {
    value,
    prev,
    next,
    kind,
    inRegex,
    offset,
  }

  return lexer(tail, tokens.concat([character]))
}

export interface RegexString {
  body: string
  option?: string
}

export const tokenize = (tokens: RegExpToken[]): RegexString[] => {
  const seed: RegExpToken[][] = [[]]
  let i = 0
  return tokens
    .filter(t => t.kind !== TokenKind[TokenKind.Extraneous])
    .reduce((acc, t) => {
      switch (t.kind) {
      case TokenKind[TokenKind.RegexLiteralStart]:
        return acc
      case TokenKind[TokenKind.RegexLiteralEnd]:
        i++
        return acc.concat([[]])
      case TokenKind[TokenKind.RegexLiteralBody]:
        return acc.map((xs, index) => i === index ? xs.concat(t) : xs)
      case TokenKind[TokenKind.RegexLiteralOption]:
        return acc.map((xs, index) => i - 1 === index ? xs.concat(t) : xs)
      }
      return acc
    }, seed)
    .filter(xs => xs.length > 0)
    .map(xs => {
      const body = xs.filter(x => x.kind === TokenKind[TokenKind.RegexLiteralBody]).map(x => x.value).join("")
      const option = xs.filter(x => x.kind === TokenKind[TokenKind.RegexLiteralOption]).map(x => x.value).join("") || undefined
      return option ? {body, option} : {body}
    })
}

export const extractRegex = (s: string): RegexString[] | null => tokenize(lexer(s))

