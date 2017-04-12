declare module "railroad-diagrams" {
  export class FakeSVG {
    items: FakeSVG[]
    tagName: string
    attrs: {}
    width: number
    up: number
    down: number
    constructor(tagName: any, attrs: any, text?: any)
    format(x: any, y: any, width?: any): this
    addTo(parent: FakeSVG): HTMLElement
  }

  export class Path extends FakeSVG  {
    constructor(x: number, y?: number)
    h(value: any): this
  }

  interface DiagramStatic extends FakeSVG {
    INTERNAL_ALIGNMENT: string
    VERTICAL_SEPARATION: number
    (x: any, y?: any): FakeSVG
    constructor(x: any, y?: any): FakeSVG
  }
  export const Diagram: DiagramStatic

  interface ComplexDiagramStatic extends FakeSVG  {
    (x: any, y?: any): FakeSVG
    constructor(x: any, y?: any): FakeSVG
  }
  export const ComplexDiagram: ComplexDiagramStatic

  interface SequenceStatic extends FakeSVG {
    (x: any, y?: any): FakeSVG
    constructor(x: any): FakeSVG
  }
  export const Sequence: SequenceStatic

  interface StackStatic extends FakeSVG {
    (x: any, y?: any): FakeSVG
    constructor(x: any): FakeSVG
  }
  export const Stack: StackStatic

  interface OptionalSequenceStatic extends FakeSVG {
    (x: any, y?: any): FakeSVG
    constructor(x: any): FakeSVG
  }
  export const OptionalSequence: OptionalSequenceStatic
  
  interface ChoiceStatic extends FakeSVG {
    (x: any, y?: any): FakeSVG
    constructor(x: any): FakeSVG
  }
  export const Choice: ChoiceStatic
  
  interface MultipleChoiceStatic extends FakeSVG {
    (x: any, y?: any): FakeSVG
    constructor(x: any): FakeSVG
  }
  export const MultipleChoice: MultipleChoiceStatic

  interface OptionalStatic extends FakeSVG {
    (x: any, y?: any): FakeSVG
    constructor(x: any): FakeSVG
  }
  export const Optional: OptionalStatic

  interface OneOrMoreStatic extends FakeSVG {
    (x: any, y?: any): FakeSVG
    constructor(x: any): FakeSVG
  }
  export const OneOrMore: OneOrMoreStatic

  interface ZeroOrMoreStatic extends FakeSVG {
    (x: any, y?: any): FakeSVG
    constructor(x: any): FakeSVG
  }
  export const ZeroOrMore: ZeroOrMoreStatic

  interface TerminalStatic extends FakeSVG {
    (x: any, y?: any): FakeSVG
    constructor(x: any): FakeSVG
  }
  export const Terminal: TerminalStatic

  interface NonTerminalStatic extends FakeSVG {
    (x: any, y?: any): FakeSVG
    constructor(x: any): FakeSVG
  }
  export const NonTerminal: NonTerminalStatic

  interface CommentStatic extends FakeSVG {
    (x: any, y?: any): FakeSVG
    constructor(x: any): FakeSVG
  }
  export const Comment: CommentStatic

  export class Skip implements FakeSVG {
    items: FakeSVG[]
    tagName: string
    attrs: {}
    width: number
    up: number
    down: number
    constructor(tagName: any, attrs: any, text?: any)
    format(x: any, y: any, width?: any): this
    addTo(parent: FakeSVG): HTMLElement
  }
}
