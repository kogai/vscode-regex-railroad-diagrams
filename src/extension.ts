import {window, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument} from "vscode"

export function activate(context: ExtensionContext) {
  let wordCounter = new WordCounter()
  let controller = new WordCounterController(wordCounter)

  let disposable = commands.registerCommand("extension.sayHello", () => {
    wordCounter.updateWordCount()
  })

  context.subscriptions.push(controller)
  context.subscriptions.push(wordCounter)
  context.subscriptions.push(disposable)
}
export function deactivate() {}

class WordCounter implements Disposable {
  private _statusBarItem: StatusBarItem;

  public updateWordCount() {

    // Create as needed
    if (!this._statusBarItem) {
      this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left)
    }

    // Get the current text editor
    let editor = window.activeTextEditor
    if (!editor) {
      this._statusBarItem.hide()
      return
    }

    let doc = editor.document

    // Only update status if an MarkDown file
    if (doc.languageId === "markdown") {
      let wordCount = this._getWordCount(doc)

      // Update the status bar
      this._statusBarItem.text = wordCount !== 1 ? `$(pencil) ${wordCount} Words` : "$(pencil)"
      this._statusBarItem.show()
    } else {
      this._statusBarItem.hide()
    }
  }

  public _getWordCount(doc: TextDocument): number {

    let docContent = doc.getText()

    // Parse out unwanted whitespace so the split is accurate
    docContent = docContent.replace(/(< ([^>]+)<)/g, "").replace(/\s+/g, " ")
    docContent = docContent.replace(/^\s\s*/, "").replace(/\s\s*$/, "")
    let wordCount = 0
    if (docContent != "") {
      wordCount = docContent.split(" ").length
    }

    return wordCount
  }

  dispose() {
    this._statusBarItem.dispose()
  }
}

class WordCounterController implements Disposable {

  private _wordCounter: WordCounter;
  private _disposable: Disposable;

  constructor(wordCounter: WordCounter) {
    this._wordCounter = wordCounter
    this._wordCounter.updateWordCount()

    // subscribe to selection change and editor activation events
    let subscriptions: Disposable[] = []
    window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions)
    window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions)

    // update the counter for the current file
    this._wordCounter.updateWordCount()

    // create a combined disposable from both event subscriptions
    this._disposable = Disposable.from(...subscriptions)
  }

  dispose() {
    this._disposable.dispose()
  }

  private _onEvent() {
    this._wordCounter.updateWordCount()
  }
}
