import { isEmpty } from "ramda"

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
  const matcher = match(s)
  for (let i = 0; i < rxs.length; i++) {
    const rx = rxs[i]
    const matched = matcher(rx)
    if (!isEmpty(matched)) {
      return matched
    }
  }
  return []
}
