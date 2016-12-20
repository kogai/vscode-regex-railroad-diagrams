import {deepStrictEqual} from "assert"
import {extractRegex, lexer, tokenize} from "./diagram"

describe("diagram", () => {
  it("should tokenize line", () => {
    deepStrictEqual(lexer("const foo = /foo/g; const"), [
      { value: "c", prev: undefined, next: "o", kind: "Extraneous", inRegex: false, offset: 0 },
      { value: "o", prev: "c", next: "n", kind: "Extraneous", inRegex: false, offset: 1 },
      { value: "n", prev: "o", next: "s", kind: "Extraneous", inRegex: false, offset: 2 },
      { value: "s", prev: "n", next: "t", kind: "Extraneous", inRegex: false, offset: 3 },
      { value: "t", prev: "s", next: " ", kind: "Extraneous", inRegex:  false, offset: 4 },
      { value: " ", prev: "t", next: "f", kind: "Extraneous", inRegex: false, offset: 5 },
      { value: "f", prev: " ", next: "o", kind: "Extraneous", inRegex: false, offset: 6 },
      { value: "o", prev: "f", next: "o", kind: "Extraneous", inRegex: false, offset: 7 },
      { value: "o", prev: "o", next: " ", kind: "Extraneous", inRegex: false, offset: 8 },
      { value: " ", prev: "o", next: "=", kind: "Extraneous", inRegex: false, offset: 9 },
      { value: "=", prev: " ", next: " ", kind: "Extraneous", inRegex: false, offset: 10 },
      { value: " ", prev: "=", next: "/", kind: "Extraneous", inRegex: false, offset: 11 },
      { value: "/", prev: " ", next: "f", kind: "RegexLiteralStart", inRegex: true, offset: 12 },
      { value: "f", prev: "/", next: "o", kind: "RegexLiteralBody", inRegex: true, offset: 13 },
      { value: "o", prev: "f", next: "o", kind: "RegexLiteralBody", inRegex: true, offset: 14 },
      { value: "o", prev: "o", next: "/", kind: "RegexLiteralBody", inRegex: true, offset: 15 },
      { value: "/", prev: "o", next: "g", kind: "RegexLiteralEnd", inRegex: true, offset: 16 },
      { value: "g", prev: "/", next: ";", kind: "RegexLiteralOption", inRegex: true, offset: 17 },
      { value: ";", prev: "g", next: " ", kind: "Extraneous", inRegex: false, offset: 18 },
      { value: " ", prev: ";", next: "c", kind: "Extraneous", inRegex: false, offset: 19 },
      { value: "c", prev: " ", next: "o", kind: "Extraneous", inRegex: false, offset: 20 },
      { value: "o", prev: "c", next: "n", kind: "Extraneous", inRegex: false, offset: 21 },
      { value: "n", prev: "o", next: "s", kind: "Extraneous", inRegex: false, offset: 22 },
      { value: "s", prev: "n", next: "t", kind: "Extraneous", inRegex: false, offset: 23 },
      { value: "t", prev: "s", next: undefined, kind: "Extraneous", inRegex: false, offset: 24 }
    ])
  })

  it("can tokenize line include backslash", () => {
    deepStrictEqual(lexer("const foo = /\\/foo/g; const"), [
      { value: "c", prev: undefined, next: "o", kind: "Extraneous", inRegex: false, offset: 0 },
      { value: "o", prev: "c", next: "n", kind: "Extraneous", inRegex: false, offset: 1 },
      { value: "n", prev: "o", next: "s", kind: "Extraneous", inRegex: false, offset: 2 },
      { value: "s", prev: "n", next: "t", kind: "Extraneous", inRegex: false, offset: 3 },
      { value: "t", prev: "s", next: " ", kind: "Extraneous", inRegex:  false, offset: 4 },
      { value: " ", prev: "t", next: "f", kind: "Extraneous", inRegex: false, offset: 5 },
      { value: "f", prev: " ", next: "o", kind: "Extraneous", inRegex: false, offset: 6 },
      { value: "o", prev: "f", next: "o", kind: "Extraneous", inRegex: false, offset: 7 },
      { value: "o", prev: "o", next: " ", kind: "Extraneous", inRegex: false, offset: 8 },
      { value: " ", prev: "o", next: "=", kind: "Extraneous", inRegex: false, offset: 9 },
      { value: "=", prev: " ", next: " ", kind: "Extraneous", inRegex: false, offset: 10 },
      { value: " ", prev: "=", next: "/", kind: "Extraneous", inRegex: false, offset: 11 },
      { value: "/", prev: " ", next: "\\", kind: "RegexLiteralStart", inRegex: true, offset: 12 },
      { value: "\\", prev: "/", next: "/", kind: "RegexLiteralBody", inRegex: true, offset: 13 },
      { value: "/", prev: "\\", next: "f", kind: "RegexLiteralBody", inRegex: true, offset: 14 },
      { value: "f", prev: "/", next: "o", kind: "RegexLiteralBody", inRegex: true, offset: 15 },
      { value: "o", prev: "f", next: "o", kind: "RegexLiteralBody", inRegex: true, offset: 16 },
      { value: "o", prev: "o", next: "/", kind: "RegexLiteralBody", inRegex: true, offset: 17 },
      { value: "/", prev: "o", next: "g", kind: "RegexLiteralEnd", inRegex: true, offset: 18 },
      { value: "g", prev: "/", next: ";", kind: "RegexLiteralOption", inRegex: true, offset: 19 },
      { value: ";", prev: "g", next: " ", kind: "Extraneous", inRegex: false, offset: 20 },
      { value: " ", prev: ";", next: "c", kind: "Extraneous", inRegex: false, offset: 21 },
      { value: "c", prev: " ", next: "o", kind: "Extraneous", inRegex: false, offset: 22 },
      { value: "o", prev: "c", next: "n", kind: "Extraneous", inRegex: false, offset: 23 },
      { value: "n", prev: "o", next: "s", kind: "Extraneous", inRegex: false, offset: 24 },
      { value: "s", prev: "n", next: "t", kind: "Extraneous", inRegex: false, offset: 25 },
      { value: "t", prev: "s", next: undefined, kind: "Extraneous", inRegex: false, offset: 26 },
    ])
  })

  it("can tokenize line include single comment", () => {
    deepStrictEqual(lexer("const foo = /foo/g; // const"), [
      { value: "c", prev: undefined, next: "o", kind: "Extraneous", inRegex: false, offset: 0 },
      { value: "o", prev: "c", next: "n", kind: "Extraneous", inRegex: false, offset: 1 },
      { value: "n", prev: "o", next: "s", kind: "Extraneous", inRegex: false, offset: 2 },
      { value: "s", prev: "n", next: "t", kind: "Extraneous", inRegex: false, offset: 3 },
      { value: "t", prev: "s", next: " ", kind: "Extraneous", inRegex:  false, offset: 4 },
      { value: " ", prev: "t", next: "f", kind: "Extraneous", inRegex: false, offset: 5 },
      { value: "f", prev: " ", next: "o", kind: "Extraneous", inRegex: false, offset: 6 },
      { value: "o", prev: "f", next: "o", kind: "Extraneous", inRegex: false, offset: 7 },
      { value: "o", prev: "o", next: " ", kind: "Extraneous", inRegex: false, offset: 8 },
      { value: " ", prev: "o", next: "=", kind: "Extraneous", inRegex: false, offset: 9 },
      { value: "=", prev: " ", next: " ", kind: "Extraneous", inRegex: false, offset: 10 },
      { value: " ", prev: "=", next: "/", kind: "Extraneous", inRegex: false, offset: 11 },
      { value: "/", prev: " ", next: "f", kind: "RegexLiteralStart", inRegex: true, offset: 12 },
      { value: "f", prev: "/", next: "o", kind: "RegexLiteralBody", inRegex: true, offset: 13 },
      { value: "o", prev: "f", next: "o", kind: "RegexLiteralBody", inRegex: true, offset: 14 },
      { value: "o", prev: "o", next: "/", kind: "RegexLiteralBody", inRegex: true, offset: 15 },
      { value: "/", prev: "o", next: "g", kind: "RegexLiteralEnd", inRegex: true, offset: 16 },
      { value: "g", prev: "/", next: ";", kind: "RegexLiteralOption", inRegex: true, offset: 17 },
      { value: ";", prev: "g", next: " ", kind: "Extraneous", inRegex: false, offset: 18 },
      { value: " ", prev: ";", next: "/", kind: "Extraneous", inRegex: false, offset: 19 },
      { value: "/", prev: " ", next: "/", kind: "Extraneous", inRegex: false, offset: 20 },
      { value: "/", prev: "/", next: " ", kind: "Extraneous", inRegex: false, offset: 21 },
      { value: " ", prev: "/", next: "c", kind: "Extraneous", inRegex: false, offset: 22 },
      { value: "c", prev: " ", next: "o", kind: "Extraneous", inRegex: false, offset: 23 },
      { value: "o", prev: "c", next: "n", kind: "Extraneous", inRegex: false, offset: 24 },
      { value: "n", prev: "o", next: "s", kind: "Extraneous", inRegex: false, offset: 25 },
      { value: "s", prev: "n", next: "t", kind: "Extraneous", inRegex: false, offset: 26 },
      { value: "t", prev: "s", next: undefined, kind: "Extraneous", inRegex: false, offset: 27 },
    ])
  })

  it("can tokenize line include multiline comment", () => {
    deepStrictEqual(lexer("const foo = /foo/g; /*const*/"), [
      { value: "c", prev: undefined, next: "o", kind: "Extraneous", inRegex: false, offset: 0 },
      { value: "o", prev: "c", next: "n", kind: "Extraneous", inRegex: false, offset: 1 },
      { value: "n", prev: "o", next: "s", kind: "Extraneous", inRegex: false, offset: 2 },
      { value: "s", prev: "n", next: "t", kind: "Extraneous", inRegex: false, offset: 3 },
      { value: "t", prev: "s", next: " ", kind: "Extraneous", inRegex:  false, offset: 4 },
      { value: " ", prev: "t", next: "f", kind: "Extraneous", inRegex: false, offset: 5 },
      { value: "f", prev: " ", next: "o", kind: "Extraneous", inRegex: false, offset: 6 },
      { value: "o", prev: "f", next: "o", kind: "Extraneous", inRegex: false, offset: 7 },
      { value: "o", prev: "o", next: " ", kind: "Extraneous", inRegex: false, offset: 8 },
      { value: " ", prev: "o", next: "=", kind: "Extraneous", inRegex: false, offset: 9 },
      { value: "=", prev: " ", next: " ", kind: "Extraneous", inRegex: false, offset: 10 },
      { value: " ", prev: "=", next: "/", kind: "Extraneous", inRegex: false, offset: 11 },
      { value: "/", prev: " ", next: "f", kind: "RegexLiteralStart", inRegex: true, offset: 12 },
      { value: "f", prev: "/", next: "o", kind: "RegexLiteralBody", inRegex: true, offset: 13 },
      { value: "o", prev: "f", next: "o", kind: "RegexLiteralBody", inRegex: true, offset: 14 },
      { value: "o", prev: "o", next: "/", kind: "RegexLiteralBody", inRegex: true, offset: 15 },
      { value: "/", prev: "o", next: "g", kind: "RegexLiteralEnd", inRegex: true, offset: 16 },
      { value: "g", prev: "/", next: ";", kind: "RegexLiteralOption", inRegex: true, offset: 17 },
      { value: ";", prev: "g", next: " ", kind: "Extraneous", inRegex: false, offset: 18 },
      { value: " ", prev: ";", next: "/", kind: "Extraneous", inRegex: false, offset: 19 },
      { value: "/", prev: " ", next: "*", kind: "Extraneous", inRegex: false, offset: 20 },
      { value: "*", prev: "/", next: "c", kind: "Extraneous", inRegex: false, offset: 21 },
      { value: "c", prev: "*", next: "o", kind: "Extraneous", inRegex: false, offset: 22 },
      { value: "o", prev: "c", next: "n", kind: "Extraneous", inRegex: false, offset: 23 },
      { value: "n", prev: "o", next: "s", kind: "Extraneous", inRegex: false, offset: 24 },
      { value: "s", prev: "n", next: "t", kind: "Extraneous", inRegex: false, offset: 25 },
      { value: "t", prev: "s", next: "*", kind: "Extraneous", inRegex: false, offset: 26 },
      { value: "*", prev: "t", next: "/", kind: "Extraneous", inRegex: false, offset: 27 },
      { value: "/", prev: "*", next: undefined, kind: "Extraneous", inRegex: false, offset: 28 },
    ])
  })

  it("can grouped by RegExpToken", () => {
    deepStrictEqual(tokenize([
      { value: "c", prev: undefined, next: "o", kind: "Extraneous", inRegex: false, offset: 0 },
      { value: "o", prev: "c", next: "n", kind: "Extraneous", inRegex: false, offset: 1 },
      { value: "n", prev: "o", next: "s", kind: "Extraneous", inRegex: false, offset: 2 },
      { value: "s", prev: "n", next: "t", kind: "Extraneous", inRegex: false, offset: 3 },
      { value: "t", prev: "s", next: " ", kind: "Extraneous", inRegex:  false, offset: 4 },
      { value: " ", prev: "t", next: "f", kind: "Extraneous", inRegex: false, offset: 5 },
      { value: "f", prev: " ", next: "o", kind: "Extraneous", inRegex: false, offset: 6 },
      { value: "o", prev: "f", next: "o", kind: "Extraneous", inRegex: false, offset: 7 },
      { value: "o", prev: "o", next: " ", kind: "Extraneous", inRegex: false, offset: 8 },
      { value: " ", prev: "o", next: "=", kind: "Extraneous", inRegex: false, offset: 9 },
      { value: "=", prev: " ", next: " ", kind: "Extraneous", inRegex: false, offset: 10 },
      { value: " ", prev: "=", next: "/", kind: "Extraneous", inRegex: false, offset: 11 },
      { value: "/", prev: " ", next: "f", kind: "RegexLiteralStart", inRegex: true, offset: 12 },
      { value: "f", prev: "/", next: "o", kind: "RegexLiteralBody", inRegex: true, offset: 13 },
      { value: "o", prev: "f", next: "o", kind: "RegexLiteralBody", inRegex: true, offset: 14 },
      { value: "o", prev: "o", next: "/", kind: "RegexLiteralBody", inRegex: true, offset: 15 },
      { value: "/", prev: "o", next: "g", kind: "RegexLiteralEnd", inRegex: true, offset: 16 },
      { value: "g", prev: "/", next: ";", kind: "RegexLiteralOption", inRegex: true, offset: 17 },
      { value: ";", prev: "g", next: " ", kind: "Extraneous", inRegex: false, offset: 18 },
      { value: " ", prev: ";", next: "/", kind: "Extraneous", inRegex: false, offset: 19 },
      { value: "/", prev: " ", next: "*", kind: "Extraneous", inRegex: false, offset: 20 },
      { value: "*", prev: "/", next: "c", kind: "Extraneous", inRegex: false, offset: 21 },
      { value: "c", prev: "*", next: "o", kind: "Extraneous", inRegex: false, offset: 22 },
      { value: "o", prev: "c", next: "n", kind: "Extraneous", inRegex: false, offset: 23 },
      { value: "n", prev: "o", next: "s", kind: "Extraneous", inRegex: false, offset: 24 },
      { value: "s", prev: "n", next: "t", kind: "Extraneous", inRegex: false, offset: 25 },
      { value: "t", prev: "s", next: "*", kind: "Extraneous", inRegex: false, offset: 26 },
      { value: "/", prev: " ", next: "f", kind: "RegexLiteralStart", inRegex: true, offset: 27 },
      { value: "f", prev: "/", next: "o", kind: "RegexLiteralBody", inRegex: true, offset: 28 },
      { value: "o", prev: "f", next: "o", kind: "RegexLiteralBody", inRegex: true, offset: 29 },
      { value: "o", prev: "o", next: "/", kind: "RegexLiteralBody", inRegex: true, offset: 30 },
      { value: "/", prev: "o", next: "g", kind: "RegexLiteralEnd", inRegex: true, offset: 31 },
      { value: "g", prev: "/", next: ";", kind: "RegexLiteralOption", inRegex: true, offset: 32 },
    ]), [
      {body: "foo", option: "g"},
      {body: "foo", option: "g"}
    ])
  })

  it("can extract regex string", () => {
    deepStrictEqual(extractRegex("const foo = /foo/g; const"), [{body: "foo", option: "g"}])
  })

  it("can extract regex string with multiple-flag", () => {
    deepStrictEqual(extractRegex("const foo = /foo/gim const bar = /bar.?/"), [{body: "foo", option: "gim"}, {body: "bar.?"}])
  })

  it("can extract regex string with single comment", () => {
    deepStrictEqual(extractRegex("const foo = /foo/gim // comment"), [{body: "foo", option: "gim"}])
  })
})
