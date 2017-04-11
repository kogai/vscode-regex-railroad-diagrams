export interface RegexString {
  body: string
  option?: string
}

const rx = /\/(.*[^\/])\/(?!\/)([gimy]*)+/g;

export const extractRegex = (s: string): RegexString[] => {
  const results: RegexString[] = []
  let result: RegExpExecArray | null = null

  while (result = rx.exec(s)) {
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
