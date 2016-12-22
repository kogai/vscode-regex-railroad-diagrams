declare module "regexp" {
  interface RegexpTree {}
  function parser(regexp: string): RegexpTree
  export = parser
}
