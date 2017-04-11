import {deepStrictEqual} from "assert"
import {extractRegex} from "./diagram"

describe("diagram", () => {
  context("extractRegex", () => {
    it("can extract regex string", () => {
      deepStrictEqual(extractRegex("const foo = /foo/g; const"), [{body: "foo", option: "g"}])
    })
    it("can NOT extract regex string with multiple-flag", () => {
      deepStrictEqual(extractRegex("const foo = /foo/gim const bar = /bar.?/"), [{body: "foo/gim const bar = /bar.?"}])
    })
    it("can extract regex string with single comment", () => {
      deepStrictEqual(extractRegex("const foo = /foo/gim // comment"), [{body: "foo", option: "gim"}])
    })
    it("can extract with regex string", () => {
      deepStrictEqual(extractRegex("/foo/g"), [{body: "foo", option: "g"}])
    })
    it("/(^ +| {2,}| +$)/", () => {
      const expect = extractRegex("const parts = text.split(/(^ +| {2,}| +$)/)")
      deepStrictEqual(expect, [{body: "(^ +| {2,}| +$)"}])
    })
    it("'/^(props|state)$/',", () => {
      const expect = extractRegex(`"/^(props|state)$/",`)
      deepStrictEqual(expect, [{body: "^(props|state)$"}])
    })
    it("/some_directory\/foo/", () => {
      const expect = extractRegex(`/some_directory\/foo/`)
      deepStrictEqual(expect, [{body: "some_directory\/foo"}])
    })
    it("/some_directory\/foo\/bar/", () => {
      const expect = extractRegex(`/some_directory\/foo\/bar/`)
      deepStrictEqual(expect, [{body: "some_directory\/foo\/bar"}])
    })
    it('dogfooding', () => {
      const expect = extractRegex(`const rx = /\/(.*[^\/])\/(?!\/)([gimy]*)+/g;`)
      deepStrictEqual(expect, [{body: "\/(.*[^\/])\/(?!\/)([gimy]*)+", option: "g"}])
    });
  })
})
