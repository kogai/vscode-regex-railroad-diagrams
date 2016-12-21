import {deepStrictEqual} from "assert"
import {regexToRailRoadDiagram} from "./convert"

describe("convert", () => {
  it("can convert regex string to FakeSVG", () => {
    const diagram = regexToRailRoadDiagram({
      body: "foo",
      option: "g"
    })
    deepStrictEqual(diagram.tagName, "svg")
    deepStrictEqual(diagram.attrs, {class: "railroad-diagram"})
    deepStrictEqual(diagram.items.length, 3)
  })
  it("can convert regex string with group to FakeSVG", () => {
    const diagram = regexToRailRoadDiagram({
      body: "(foo)",
      option: "g"
    })
    deepStrictEqual(diagram.tagName, "svg")
    deepStrictEqual(diagram.attrs, {class: "railroad-diagram"})
    deepStrictEqual(diagram.items.length, 3)
  })
})
