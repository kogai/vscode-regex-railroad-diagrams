declare module "railroad-diagrams" {
  export interface FakeSVG {
    items: FakeSVG[]
    tagName: string
    attrs: {}
    width: number
    up: number
    down: number
  }

  export class Sequence { constructor(x: any) }
  export class Choice { constructor(x: any, y: any) }

  export function Optional(x: any, y?: any): FakeSVG
  export function OneOrMore(x: any, y: any): FakeSVG
  export function ZeroOrMore(x: any, y: any): FakeSVG
  export function Comment(x: any, y: any): FakeSVG
  export function Group(x: any, y: any, z: any): FakeSVG
  export function Terminal(x: any, y: any): FakeSVG
  export function NonTerminal(x: any, y?: any): FakeSVG
  export function Diagram(regexpTree: any): FakeSVG
}
