import {window, ExtensionContext} from "vscode"
import {extractRegex} from "./diagram"
import {regexToRailRoadDiagram} from "./convert"

/**
 * Entry point of extension.
 */
export function activate(context: ExtensionContext) {
  context.subscriptions.push(window.onDidChangeTextEditorSelection(({selections}) => {
    const editor = window.activeTextEditor
    if (!editor) {
      return
    }
    const {anchor} = selections[0]
    const regexStrings = extractRegex(editor.document.lineAt(anchor.line).text)
    if (!regexStrings) {
      return
    }
    const elements = regexStrings.map(regexToRailRoadDiagram)
    console.log(elements)
  }))
}

export function deactivate() {}
