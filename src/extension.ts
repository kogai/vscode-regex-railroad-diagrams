import {window, ExtensionContext, commands, workspace, ViewColumn} from "vscode"
import {RegExpProvider, PREVIEW_URI, PREVIEW_PROTCOL} from "./element"

/**
 * Entry point of extension.
 */
export function activate(context: ExtensionContext) {
  const provider = new RegExpProvider()
  context.subscriptions.push(workspace.registerTextDocumentContentProvider(PREVIEW_PROTCOL, provider))
  context.subscriptions.push(commands.registerCommand("extension.showRegExpPreview", () => commands
      .executeCommand("vscode.previewHtml", PREVIEW_URI, ViewColumn.Two, "RegExp Diagram Preview")
      .then((success) => {}, window.showErrorMessage)
    ))

  workspace.onDidChangeTextDocument(event => {
    const editor = window.activeTextEditor
    if (!editor || event.document !== editor.document) {
      return
    }
    provider.update(PREVIEW_URI)
  })

  window.onDidChangeTextEditorSelection(event => {
    if (event.textEditor !== window.activeTextEditor) {
      return
    }
    provider.update(PREVIEW_URI)
  })
}

export function deactivate() {}
