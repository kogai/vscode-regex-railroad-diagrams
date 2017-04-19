import { deepStrictEqual } from "assert"
import { regexToRailRoadDiagram } from "./convert"

describe("convert", () => {
  it("can convert regex string to FakeSVG", () => {
    const diagram = regexToRailRoadDiagram({
      body: "foo",
      option: "g"
    })
    deepStrictEqual(diagram.tagName, "svg")
    deepStrictEqual(diagram.attrs, { class: "railroad-diagram" })
    deepStrictEqual(diagram.items.length, 3)
  })
  it("can convert regex string with group to FakeSVG", () => {
    const diagram = regexToRailRoadDiagram({
      body: "(foo)",
      option: "g"
    })

    deepStrictEqual(diagram.tagName, "svg")
    deepStrictEqual(diagram.attrs, { class: "railroad-diagram" })
    deepStrictEqual(diagram.items.length, 3)
  })
  it("/(^ +| {2,}| +$)/", () => {
    const diagram = regexToRailRoadDiagram({
      body: "(^ +| {2,}| +$)",
    })
    deepStrictEqual(diagram.tagName, "svg")
    deepStrictEqual(diagram.attrs, { class: "railroad-diagram" })
    deepStrictEqual(diagram.items.length, 3)
  })
  it("/https?:\/\//", () => {
    const diagram = regexToRailRoadDiagram({
      body: "https?:\\\/\\\/",
    })
    deepStrictEqual(diagram.tagName, "svg")
    deepStrictEqual(diagram.attrs, { class: "railroad-diagram" })
    deepStrictEqual(diagram.items.length, 3)
  })
  it("/\/(.*[^\/])\/(?!\/)([gimy]*)+/g;", () => {
    const diagram = regexToRailRoadDiagram({
      body: "\\\/(.*[^\\\/])\\\/(?!\\\/)([gimy]*)+",
      option: "g",
    })
    deepStrictEqual(diagram.tagName, "svg")
    deepStrictEqual(diagram.attrs, { class: "railroad-diagram" })
    deepStrictEqual(diagram.items.length, 3)
  })
})
