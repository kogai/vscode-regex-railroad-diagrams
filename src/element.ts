import { TextDocumentContentProvider, Uri, EventEmitter, window } from "vscode"

import { extractRegex } from "./diagram"
import { regexToRailRoadDiagram } from "./convert"

export const PREVIEW_PROTCOL = "regex-railroad-diagram"
export const PREVIEW_URI = Uri.parse(`${PREVIEW_PROTCOL}://authority/regex-preview`)

export class RegExpProvider implements TextDocumentContentProvider {
  private _onDidChange = new EventEmitter<Uri>()

  public provideTextDocumentContent(uri: Uri) {
    return this.createSnippet()
  }

  get onDidChange() {
    return this._onDidChange.event
  }

  private createSnippet() {
    const editor = window.activeTextEditor
    if (!editor) {
      return
    }
    const { anchor } = editor.selection
    const regexStrings = extractRegex(editor.document.lineAt(anchor.line).text)
    if (!regexStrings) {
      return
    }
    const elements = regexStrings.map(regexToRailRoadDiagram)
    return `
        <style>
          svg.railroad-diagram {
            background-color: hsl(30,20%,95%);
          }
          svg.railroad-diagram path {
            stroke-width: 3;
            stroke: black;
            fill: rgba(0,0,0,0);
          }
          svg.railroad-diagram text {
            font: bold 14px monospace;
            text-anchor: middle;
          }
          svg.railroad-diagram text.label {
            text-anchor: start;
          }
          svg.railroad-diagram text.comment {
            font: italic 12px monospace;
          }
          svg.railroad-diagram rect {
            stroke-width: 3;
            stroke: black;
            fill: hsl(120,100%,90%);
          }
        </style>
        ${elements.map(e => e.toString())}
      `
  }

  public update(uri: Uri) {
    this._onDidChange.fire(uri)
  }
}
