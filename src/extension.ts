import {window, ExtensionContext} from "vscode"
import {checkForRegExp} from "./diagram"

/**
 * Entry point of extension.
 */
export function activate(context: ExtensionContext) {
  const disposable = window.onDidChangeTextEditorSelection(({selections}) => {
    const select = selections[0]
    checkForRegExp(select)
  })
  context.subscriptions.push(disposable)
}

export function deactivate() {}
