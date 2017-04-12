import {Terminal, Diagram, Skip, FakeSVG, Path} from "railroad-diagrams"

const isString = (value: any): value is string => {
  return (typeof value) == "string"
}

const wrapString = (value: any, attrs?: any): FakeSVG => {
  return isString(value) ? Terminal(value, attrs) : value
}

const determineGaps = (outer: any, inner: any) => {
  const diff = outer - inner
  switch(Diagram.INTERNAL_ALIGNMENT) {
  case "left":
    return [0, diff]
  case "right":
    return [diff, 0]
  // case "center":
  //   return
  default:
    return [diff / 2, diff / 2]
  }
}

export class Group extends Skip {
  item: FakeSVG
  items: FakeSVG[]
  caption: FakeSVG
  padding: number
  width: number
  needsSpace: boolean

  constructor(
    item: FakeSVG,
    caption: FakeSVG,
    options: {minWidth?: number, attrs?: { class: string }} = {}
  ) {
    super("g", options.attrs)
    this.item = wrapString(item)
    this.caption = caption
    this.padding = 10
    this.width = this.item.width + 2 * this.padding

    if (options.minWidth) {
      if (this.width < options.minWidth) {
        this.width = options.minWidth
      }
    }

    let height = this.item.up + this.item.down
    if (caption) {
      height += Diagram.VERTICAL_SEPARATION + this.caption.up + this.caption.down
    }

    this.up = this.item.up + this.padding
    this.down = height - this.up + this.padding
    this.needsSpace = true
  }

  format(x: any, y: any, width: number) {
    // Hook up the two sides if this is narrower than its stated width.
    const gaps = determineGaps(width, this.width)
    new Path(x, y).h(gaps[0]).addTo(this)
    new Path(x + gaps[0] + this.width, y).h(gaps[1]).addTo(this)
    x += gaps[0]

    new FakeSVG("rect", {
      x: x,
      y: y - this.up,
      width: this.width,
      height: this.up + this.down,
      rx: 5,
      ry: 5
    }).addTo(this)

    this.item.format(x, y, this.width).addTo(this)

    if (this.caption) {
      const caption_y = y + this.item.down + Diagram.VERTICAL_SEPARATION + this.caption.up
      const caption_x = x + (this.width - this.caption.width) / 2
      this.caption.format(caption_x, caption_y, this.caption.width).addTo(this)
    }

    return this
  }
}
