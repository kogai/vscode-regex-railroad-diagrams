declare module "@kogai/railroad-diagrams" {
  export class FakeSVG {
    items: FakeSVG[]
    tagName: string
    attrs: {}
    width: number
    up: number
    down: number
    constructor(tagName: any, attrs: any, text?: any)
    addTo(parent: HTMLElement): HTMLElement
  }

  export class Sequence extends FakeSVG { constructor(x: any) }
  export class Choice extends FakeSVG { constructor(x: any, y: any) }
  // export class Terminal extends FakeSVG { constructor(x: any, y?: any) }
  export class Path extends FakeSVG {
    constructor(x: any, y?: any)
    h(x: any): FakeSVG
  }
  export class Skip extends FakeSVG {}

  export function Diagram(x: any, y?: any): FakeSVG
  export function Optional(x: any, y?: any): FakeSVG
  export function OneOrMore(x: any, y: any): FakeSVG
  export function ZeroOrMore(x: any, y: any): FakeSVG
  export function Comment(x: any, y: any): FakeSVG
  export function NonTerminal(x: any, y?: any): FakeSVG
  export function Terminal(x: any, y?: any): FakeSVG
  export function Group(x: any, y?: any, z?: any): FakeSVG
}
