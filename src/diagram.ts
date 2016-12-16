import {Selection} from "vscode"

// TODO: debounceする
// 正規表現文字列の取得とエディタへの描画(Controller)
export const checkForRegExp = (select: Selection): void => {
  console.log(select)
}

// 正規表現文字列を範囲取得
export const getRegexpBufferRange = () => {}

// 言語間の差異を吸収
export const cleanRegex = () => {}
