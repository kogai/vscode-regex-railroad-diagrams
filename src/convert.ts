import regexp = require("regexp")

import {Diagram, Sequence, Choice, Optional, OneOrMore, ZeroOrMore, Terminal, NonTerminal, Comment, Group} from "@kogai/railroad-diagrams"
import {RegexString} from "./diagram"

const doSpace = () => NonTerminal("SP", {title: "Space character", class: "literal whitespace"})

const makeLiteral = function(text: string) {
  if (text === " ") {
    return doSpace()
  } else {
    const parts = text.split(/(^ +| {2,}| +$)/)
    const sequence = []
    for (let part of parts) {
      if (!part.length) { continue }
      if (/^ +$/.test(part)) {
        if (part.length === 1) {
          sequence.push(doSpace())
        } else {
          sequence.push(OneOrMore(doSpace(), Comment(`${part.length}x`, {title: `repeat ${part.length} times`})))
        }
      } else {
        sequence.push(Terminal(part, {class: "literal"}))
      }
    }

    if (sequence.length === 1) {
      return sequence[0]
    } else {
      return new Sequence(sequence)
    }
  }
}

const get_flag_name = function(flag: string) {
  const flag_names: {[key: string]: string} = {
    A: "pcre:anchored",
    D: "pcre:dollar-endonly",
    S: "pcre:study",
    U: "pcre:ungreedy",
    X: "pcre:extra",
    J: "pcre:extra",
    i: "case-insensitive",
    m: "multi-line",
    s: "dotall",
    e: "evaluate",
    o: "compile-once",
    x: "extended-legilibility",
    g: "global",
    c: "current-position",
    p: "preserve",
    d: "no-unicode-rules",
    u: "unicode-rules",
    a: "ascii-rules",
    l: "current-locale"
  }

  if (flag in flag_names) {
    return flag_names[flag]
  } else {
    return `unknown:${flag}`
  }
}

const rx2rr = function(node: any, options: string): any {
  const isSingleString = () => options.match(/s/)

  const doStartOfString = function() {
    let title: string
    if (options.match(/m/)) {
      title = "Beginning of line"
    } else {
      title = "Beginning of string"
    }
    return NonTerminal("START", {title, class: "zero-width-assertion"})
  }

  const doEndOfString   = function() {
    let title: string
    if (options.match(/m/)) {
      title = "End of line"
    } else {
      title = "End of string"
    }

    return NonTerminal("END", {title, class: "zero-width-assertion"})
  }

  switch (node.type) {
  case "match": {
    let literal = ""
    const sequence = []

    for (let n of node.body) {
      if (n.type === "literal" && n.escaped) {
        if (n.body === "A") {
          sequence.push(doStartOfString())
        } else if (n.body === "Z") {
          sequence.push(doEndOfString())
        } else {
          literal += n.body
        }

      } else if (n.type === "literal") {  // and not n.escaped
        literal += n.body
      } else {
        if (literal) {
          sequence.push(makeLiteral(literal))
          literal = ""
        }

        sequence.push(rx2rr(n, options))
      }
    }

    if (literal) {
      sequence.push(makeLiteral(literal))
    }

    if (sequence.length === 1) {
      return sequence[0]
    } else {
      return new Sequence(sequence)
    }
  }

  case "alternate": {
    const alternatives = []
    while (node.type === "alternate") {
      alternatives.push(rx2rr(node.left, options))
      node = node.right
    }

    alternatives.push(rx2rr(node, options))

    return new Choice(Math.floor(alternatives.length/2)-1, alternatives)
  }

  case "quantified": {
    const {min, max, greedy} = node.quantifier

    const body = rx2rr(node.body, options)

    if (min > max) {
      throw new Error(`Minimum quantifier (${min}) must be lower than ` + `maximum quantifier (${max})`)
    }

    const plural = function(x: number) { if (x !== 1) { return "s" } else { return "" } }

    switch (min) {
    case 0:
      if (max === 1) {
        return Optional(body)
      } else {
        if (max === 0) {
          return ZeroOrMore(body, quantifiedComment("0x", greedy, {title: "exact 0 times repitition does not make sense"}))
        } else if (max !== Infinity) {
          return ZeroOrMore(body, quantifiedComment(`0-${max}x`, greedy, {title: `repeat 0 to ${max} time` + plural(max)}))
        } else {
          return ZeroOrMore(body, quantifiedComment("*", greedy, {title: "repeat zero or more times"}))
        }
      }
    case 1:
      if (max === 1) {
        return OneOrMore(body, Comment("1", {title: "once"}))
      } else if (max !== Infinity) {
        return OneOrMore(body, quantifiedComment(`1-${max}x`, greedy, {title: `repeat 1 to ${max} times`}))
      } else {
        return OneOrMore(body, quantifiedComment("+", greedy, {title: "repeat at least one time"}))
      }
    default:
      if (max === min) {
        return OneOrMore(body, Comment(`${max}x`, {title: `repeat ${max} times`}))
      } else if (max !== Infinity) {
        return OneOrMore(body, quantifiedComment(`${min}-${max}x`, greedy, {title: `repeat ${min} to ${max} times`}))
      } else {
        return OneOrMore(body, quantifiedComment(`>= ${min}x`, greedy, {title: `repeat at least ${min} time` + plural(min)}))
      }
    }
  }

  case "capture-group": {
    let text = `capture ${node.index}`
    let min_width = 55
    if (node.name) {
      text += ` (${node.name})`
      min_width = 55 + ((node.name.split("").length+3)*7)
    }
    return Group(rx2rr(node.body, options), Comment(text, {class: "caption"}), {minWidth: min_width, attrs: {class: "capture-group group"}})
  }

  case "flags": {
    const turn_on_long = []
    const turn_off_long = []

    const flags = node.body.join("")
    let [turn_on, turn_off] = flags.split("-")
    if (turn_on == null) { turn_on = "" }
    if (turn_off == null) { turn_off = "" }
    for (var f of turn_on.split("")) {
      turn_on_long.push(get_flag_name(f))
    }

    for (f of turn_off.split("")) {
      if (f === "i") {
        turn_on_long.push("case-sensitive")
      } else {
        turn_off_long.push(get_flag_name(f))
      }
    }

    const _title = []
    if (turn_on) {
      _title.push(`Turn on: ${turn_on_long.join(", ")}`)
    }
    if (turn_off) {
      _title.push(`Turn off: ${turn_off_long.join(", ")}`)
    }

    return NonTerminal(`SET: ${node.body.join("")}`, {title: _title.join("\n"), class: "zero-width-assertion"})
      //NonTerminal("WORD", title: "Word character A-Z, 0-9, _", class: 'character-class')
  }

  case "non-capture-group":
      // Group rx2rr(node.body, options), null, attrs: {class: 'group'}
    return rx2rr(node.body, options)

  case "positive-lookahead":
    return Group(rx2rr(node.body, options), Comment("=> ?", {title: "Positive lookahead", class: "caption"}), {attrs: {class: "lookahead positive zero-width-assertion group"}})

  case "negative-lookahead":
    return Group(rx2rr(node.body, options), Comment("!> ?", {title: "Negative lookahead", class: "caption"}), {attrs: {class: "lookahead negative zero-width-assertion group"}})

  case "positive-lookbehind":
    return Group(rx2rr(node.body, options), Comment("<= ?", {title: "Positive lookbehind", class: "caption"}), {attrs: {class: "lookbehind positive zero-width-assertion group"}})

  case "negative-lookbehind":
    return Group(rx2rr(node.body, options), Comment("<! ?", {title: "Negative lookbehind", class: "caption"}), {attrs: {class: "lookbehind negative zero-width-assertion group"}})

  case "back-reference":
    return NonTerminal(`${node.code}`, {title: `Match capture ${node.code} (Back Reference)`, class: "back-reference"})

  case "literal":
    if (node.escaped) {
      if (node.body === "A") {
        return doStartOfString()
      } else if (node.body === "Z") {
        return doEndOfString()
      } else {
          //Terminal("\\"+node.body)
        return Terminal(node.body, {class: "literal"})
      }
    } else {
      return makeLiteral(node.body)
    }

  case "start":
    return doStartOfString()

  case "end":
    return doEndOfString()

  case "word":
    return NonTerminal("WORD", {title: "Word character A-Z, 0-9, _", class: "character-class"})

  case "non-word":
    return NonTerminal("NON-WORD", {title: "Non-word character, all except A-Z, 0-9, _", class: "character-class invert"})

  case "line-feed":
    return NonTerminal("LF", {title: "Line feed '\\n'", class: "literal whitespace"})

  case "carriage-return":
    return NonTerminal("CR", {title: "Carriage Return '\\r'", class: "literal whitespace"})

  case "vertical-tab":
    return NonTerminal("VTAB", {title: "Vertical tab '\\v'", class: "literal whitespace"})

  case "tab":
    return NonTerminal("TAB", {title: "Tab stop '\\t'", class: "literal whitespace"})

  case "form-feed":
    return NonTerminal("FF", {title: "Form feed", class: "literal whitespace"})

  case "back-space":
    return NonTerminal("BS", {title: "Backspace", class: "literal"})

  case "digit":
    return NonTerminal("0-9", {class: "character-class"})

  case "null-character":
    return NonTerminal("NULL", {title: "Null character '\\0'", class: "literal"})

  case "non-digit":
    return NonTerminal("not 0-9", {title: "All except digits", class: "character-class invert"})

  case "white-space":
    return NonTerminal("WS", {title: "Whitespace: space, tabstop, linefeed, carriage-return, etc.", class: "character-class whitespace"})

  case "non-white-space":
    return NonTerminal("NON-WS", {title: "Not whitespace: all except space, tabstop, line-feed, carriage-return, etc.", class: "character-class invert"})

  case "range":
    return NonTerminal(node.text, {class: "character-class"})

  case "charset": {
    const charset = (node.body.map((x: any) => x.text))

    if (charset.length === 1) {
      const char = charset[0]

      if (char === " ") {
        if (node.invert) {
          return doSpace()
        }
      }

      if (node.invert) {
        return NonTerminal(`not ${char}`, {title: `Match all except ${char}`, class: "character-class invert"})
      } else {
        if (char === "SP") {
          return doSpace()
        } else {
          return Terminal(char, {class: "literal"})
        }
      }
    } else {
      const list = charset.slice(0, -1).join(", ")

      for (let i = 0; i < list.length; i++) {
        const x = list[i]
        if (x === " ") {
          list[i] = "SP"
        }
      }

      if (node.invert) {
        return NonTerminal(`not ${list} and ${charset.slice(-1)}`, {class: "character-class invert"})
      } else {
        return NonTerminal(`${list} or ${charset.slice(-1)}`, {class: "character-class"})
      }
    }
  }

  case "hex": case "octal": case "unicode":
    return Terminal(node.text, {class: "literal charachter-code"})

  case "unicode-category": {
    let _text = node.code
    let _class = "unicode-category character-class"
    if (node.invert) {
      _class += " invert"
      _text = `NON-${_text}`
    }

    return NonTerminal(_text, {title: `Unicode Category ${node.code}`, class: _class})
  }

  case "any-character": {
    const extra = !isSingleString() ? " except newline" : ""
    return NonTerminal("ANY", {title: `Any character${extra}` , class: "character-class"})
  }

  case "word-boundary":
    return NonTerminal("WB", {title: "Word-boundary", class: "zero-width-assertion"})

  case "non-word-boundary":
    return NonTerminal("NON-WB", {title: "Non-word-boundary (match if in a word)", class: "zero-width-assertion invert"})

  default:
    return NonTerminal(node.type)
  }
}

var quantifiedComment = function(comment: string, greedy: string, attrs: any) {
  if (comment && greedy) {
    attrs.title += ", longest possible match"
    attrs.class = "quantified greedy"
    return Comment(comment + " (greedy)", attrs)
  } else if (greedy) {
    attrs.title = "longest possible match"
    attrs.class = "quantified greedy"
    return Comment("greedy", attrs)
  } else if (comment) {
    attrs.title += ", shortest possible match"
    attrs.class = "quantified lazy"
    return Comment(comment + " (lazy)", attrs)
  } else {
    attrs.title = "shortest possible match"
    attrs.class = "quantified lazy"
    return Comment("lazy", attrs)
  }
}

export const regexToRailRoadDiagram = (regex: RegexString) => Diagram(rx2rr(regexp(regex.body), regex.option || ""))
