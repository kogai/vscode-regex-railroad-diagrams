import {deepStrictEqual} from "assert"
import {extractRegex} from "./diagram"

describe("diagram", () => {
  // const fixture = `
  //   exclude: /node_modules(?!\/camelcase)/,
  //   exclude: /node_modules|src\/components/,
  //   exclude: /src\/styles/,
  //   { test: /\.jpg$/, use: { loader: 'url-loader', options: { minetype: 'image/jpeg', limit: 10000 }} },
  //   { test: /\.png$/, use: { loader: 'url-loader', options: { minetype: 'image/png', limit: 10000 }} },
  //   { test: /\.svg$/, use: { loader: 'url-loader', options: { minetype: 'image/svg+xml', limit: 10000 }} },
  //   { test: /\.ttf$/, use: { loader: 'url-loader', options: { minetype: 'application/octet-stream', limit: 10000 }} },
  //   { test: /\.woff$/, use: { loader: 'url-loader', options: { minetype: 'application/font-woff', limit: 10000 }} },
  //   { test: /\.woff2$/, use: { loader: 'url-loader', options: { minetype: 'application/font-woff', limit: 10000 }} },
  //   { test: /\.eot$/, use: { loader: 'url-loader', options: { minetype: 'application/vnd.ms-fontobject', limit: 10000 }} },
  //   `.split("\n")
  
  context("extractRegex", () => {
    it("can extract regex string", () => {
      deepStrictEqual(extractRegex("const foo = /foo/g; const"), [{body: "foo", option: "g"}])
    })
    it("can extract regex string with multiple-flag", () => {
      deepStrictEqual(extractRegex("const foo = /foo/gim const bar = /bar.?/"), [{body: "foo", option: "gim"}, {body: "bar.?"}])
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
    it.only("exclude: /node_modules(?!\/camelcase)/,", () => {
      const expect = extractRegex(`exclude: /node_modules(?!\/camelcase)/,`)
      deepStrictEqual(expect, [{body: "node_modules(?!\/camelcase)"}])
    })
  })
})
