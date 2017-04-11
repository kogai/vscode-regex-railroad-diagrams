export interface RegexString {
  body: string
  option?: string
}

const rx = /\/(.+?)\\{0}\/{0}\/([gimy]*)+/g;

// "\/".match(/\//)
// ["/", index: 0, input: "/"]

// "\/"
// "/"

export const extractRegex = (s: string): RegexString[] => {
  const results: RegexString[] = []
  let result: RegExpExecArray | null = null

  console.log(s);

  while (result = rx.exec(s)) {
    const body = result[1]
    const option = result[2]

    console.log(result);

    if (option.length === 0) {
      results.push({ body })
    } else {
      results.push({ body, option })
    }
  }

  return results
}
