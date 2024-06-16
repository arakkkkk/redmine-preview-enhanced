let editor = document.querySelector("#content_text");
let editorRows;
let editorRowsCount;

let val = editor.value;
editorRows = val.split("\n");
// console.log(editorRows);
editorRowsCount = editorRows.length;
// console.log(editorRowsCount);

let customVal = val.replace(/<pre>[\s\S]*?<\/pre>/g, "<code_block>");
editorRows = customVal.split("\n");
editorRows = editorRows.filter((item) => item !== "");
console.log(editorRows);
editorRowsCount = editorRows.length;
console.log(editorRowsCount);
