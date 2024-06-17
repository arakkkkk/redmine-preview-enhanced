class Lines {
  constructor() {
    this.data = [];
  }

  append(line) {
    line.id = this.data.length + 1;
    this.data.push(line);
    // console.log("appended:", line.dom);
  }

  concat(cls) {
    if (cls === null) return;
    if (cls.data.length === 0) return;
    if (this.data.length > 0) {
      for (let cl of cls.data) {
        cl.id = cl.id + this.tail.id;
      }
    }
    this.data = this.data.concat(cls.data);
  }

  getByID(id) {
    for (let l of this.data) {
      if (l.id == id) return l;
    }
    return null;
  }

  getByDOM(dom) {
    for (let l of this.data) {
      if (l.dom == dom) return l;
    }
    return null;
  }

  get head() {
    for (let l of this.data) {
      if (l.id == 1) return l;
    }
  }

  get tail() {
    let tail = null;
    for (let l of this.data) {
      if (tail === null) tail = l;
      if (l.id > tail.id) tail = l;
    }
    return tail;
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

// // 上から中に入りながら探していく形式
const parseDOM = (parent, isFirstRun = true) => {
  // return: lines
  let _lines = new Lines();
  let childs = parent.childNodes;
  for (let i = 0; i < childs.length; i++) {
    let child = childs[i];
    // support toc
    if (child.className == "toc") {
      let line = new Line(child);
      _lines.append(line);
      continue;
    }
    // rec
    let followingLines = parseDOM(child, false);

    // lineTagListに入ったtagならlinesに追加
    if (lineTagList.includes(child.nodeName)) {
      if (isFirstRun) {
      }
      if (
        isFirstRun ||
        !lineTagList.includes(parent.nodeName) // <li>の中に<pre>が入るパターンは一行になる
      ) {
        let line = new Line(child);
        _lines.append(line);
      } else if (child.nodeName == "BR") {
        let line = new Line(parent);
        _lines.append(line);
      }
    }
    _lines.concat(followingLines);
  }
  return _lines;
};
