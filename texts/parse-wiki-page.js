class Lines {
  constructor() {
    this.data = [];
  }

  append(line) {
    line.id = this.length + 1;
    this.data.push(line);
    // console.log("appended:", line.dom);
  }

  concat(followingLines) {
    if (followingLines === null) return;
    if (followingLines.length === 0) return;
    this.data = this.data.concat(followingLines.data);
  }

  get domList() {
    let domList = [];
    for (let line of this.data) {
      domList.push(line.dom);
    }
    return domList;
  }
}
class Line {
  constructor(dom) {
    this.dom = dom;
  }
}

const lineTagList = [
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "P",
  "LI",
  "BR",
  "TR",
  "HR",
  "PRE",
  "IMG",
];

const preview = document.querySelector(".wiki-preview");

// // 上から中に入りながら探していく形式
const parseDOM = (parent, isFirstRun = true) => {
  // return: lines
  let _lines = new Lines();
  let childs = parent.childNodes;
  for (let i = 0; i < childs.length; i++) {
    let child = childs[i];
    let followingLines = parseDOM(child, false);
    // lineTagListに入ったtagならlinesに追加
    if (lineTagList.includes(child.nodeName)) {
      if (isFirstRun) {
      }
      if (
        isFirstRun ||
        child.nodeName == "BR" || // <br />の場合親タグが<p>になる
        !lineTagList.includes(parent.nodeName) // <li>の中に<pre>が入るパターンは一行になる
      ) {
        let line = new Line(child);
        _lines.append(line);
      }
    }
    _lines.concat(followingLines);
  }
  return _lines;
};
let lines = parseDOM(preview);
console.log(lines);
console.log(lines.domList);
