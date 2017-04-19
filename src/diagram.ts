export interface RegexString {
  body: string
  option?: string
}

const match = (s: string) => (rx: RegExp) => {
  const results: RegexString[] = []
  let result: RegExpExecArray | null = null

  while (result = rx.exec(s)) { // eslint-disable-line
    const body = result[1]
    const option = result[2]
    if (option.length === 0) {
      results.push({ body })
    } else {
      results.push({ body, option })
    }
  }

  return results
}

export const extractRegex = (s: string): RegexString[] => {
  const rxs = [
    /\/(.*[^\/])\/(?!\/)([gimy]*)+/g,
    /\/(.*)\/([gimy]*)+/g,
  ]

  return rxs
    .map(match(s))
    .reduce((acc, r) => acc.concat(r), [])
    .filter((r, i) => i === 0)
}
