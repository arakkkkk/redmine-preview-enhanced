// Place editor previews side by side
const $editorDiv = document.getElementsByClassName("jstEditor")[0];
const $preview = document.getElementsByClassName("wiki-preview")[0];
const $editor = document.getElementsByClassName("wiki-edit")[0];
const $Tabs = document.querySelector("div.jstTabs.tabs > ul");
const $tabElements = document.querySelector(".tab-elements");
const $editTab = $Tabs.children[0].querySelector("a");
const $previewTab = $Tabs.children[1].querySelector("a");

const switchSideByView = () => {
  // Show preview
  $editorDiv.style.display = "flex";
  $previewTab.click();

  $preview.style.width = "48.75%";
  $preview.style.marginLeft = "1.25%";
  $preview.style.height = "95vh";
  // height
  $preview.style.height = "95vh";
  $preview.style.overflow = "scroll";

  // Unhide textarea
  // style
  $editor.style.width = "48.75%";
  $editor.style.marginRight = "1.25%";
  $editor.style.height = "95vh";
  // unhidden
  $editor.classList.remove("hidden");

  $Tabs.scrollIntoView({
    behavior: "smooth", // スクロールの動作をスムーズにする
    block: "start", // スクロール位置を調整 ("start", "center", "end", "nearest"が使用可能)
  });
};

////////////////////
// Custom Tabs
///////////////////
// Add sideByTab
const $sideByTab = document.createElement("li");
const $a = document.createElement("a");
$a.innerText = "SideBy";
$a.setAttribute("href", "#");
$a.addEventListener("click", function (event) {
  event.preventDefault();
  switchSideByView();
  for (let $t of $Tabs.children) {
    if (!$t.querySelector("a")) {
      continue;
    }
    $tabElements.querySelector("div").classList.remove("hidden");
    $t.querySelector("a").classList.remove("selected");
  }
  $a.classList.add("selected");
});
$sideByTab.appendChild($a);
$Tabs.insertBefore($sideByTab, $tabElements);
// Edit Tab
$editTab.addEventListener("click", function (event) {
  $sideByTab.querySelector("a").classList.remove("selected");
  $editor.style.width = "95%";
  $editor.style.marginRight = "";
  $editor.style.height = "95vh";
  $Tabs.scrollIntoView({
    behavior: "smooth", // スクロールの動作をスムーズにする
    block: "start", // スクロール位置を調整 ("start", "center", "end", "nearest"が使用可能)
  });
});
// Preview Tab
$previewTab.addEventListener("click", function (event) {
  $sideByTab.querySelector("a").classList.remove("selected");
});

///////////////////////////
// Preview to Editor
///////////////////////////
$preview.addEventListener("dblclick", function (event) {
  const $clicked = event.target;
  let text = null;
  if ($clicked.tagName.match(/H\d/g)) {
    text = $clicked.tagName.toLowerCase() + ". " + $clicked.innerText;
    text = text.slice(0, -1);
  } else if ($clicked.tagName == "STRONG") {
    text = "*" + $clicked.innerText + "*";
  } else if ($clicked.tagName == "LI") {
    text = "* " + $clicked.innerText;
  }
  if (text === null) {
    return;
  }
  console.log("serch for: ", text);
  const startIndex = $editor.value.indexOf(text); // 検索文字列の開始位置を取得

  if (startIndex !== -1) {
    // 検索文字列が見つかった場合
    $editor.focus(); // textareaにフォーカス
    $editor.setSelectionRange(startIndex, startIndex + text.length); // 検索文字列を選択
    $editor.scrollTop =
      $editor.scrollHeight * (startIndex / $editor.value.length);
  } else {
    // 検索文字列が見つからなかった場合の処理
    // console.log("検索文字列が見つかりませんでした。");
  }
});

///////////////////////////
// Editor to Preview
///////////////////////////
function findTagsByText(element, tagText) {
  // 結果を格納する配列
  let res = null;

  // 再帰関数
  function traverse(node) {
    // ノードがテキストノードの場合
    let serchText = tagText;
    if (node.parentNode.tagName.match(/H\d/g)) {
      serchText = node.parentNode.tagName.toLowerCase() + ". " + tagText;
    } else if (node.parentNode.tagName == "STRONG") {
      serchText = "*" + tagText + "*";
    }
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.textContent.match(/^[\s\n\r]*$/g)) {
        return;
      }
      let regexp = new RegExp(
        node.textContent
          .trim()
          .replaceAll("(", "\\(")
          .replaceAll(")", "\\)")
          .replaceAll("[", "\\[")
          .replaceAll("]", "\\]")
          .replaceAll(".", "\\.")
          // .replaceAll("\\", "\\\\")
          .replaceAll("/", "\\/")
          .replaceAll("*", "\\*"),
      );
      let match = serchText.match(regexp);
      if (match) {
        // 親要素を配列に追加
        if (res === null) {
          res = {
            tag: node.parentNode,
            matched: match[0],
          };
        } else if (match[0].length > res.matched.length) {
          res = {
            tag: node.parentNode,
            matched: match[0],
          };
        }
      }
    } else {
      // 子ノードを再帰的に処理
      for (let i = 0; i < node.childNodes.length; i++) {
        if (node.childNodes[i].classList) {
          if (node.childNodes[i].classList.contains("toc")) {
            continue;
          }
        }
        traverse(node.childNodes[i]);
      }
    }
  }

  // ルート要素から再帰処理を開始
  traverse(element);
  return res;
}

const highlightElem = ($e) => {
  // ハイライトのためのCSSクラス
  const highlightClass = "highlight";
  $e.classList.add(highlightClass); // ハイライトクラスを追加

  // 一定時間後にハイライトを解除
  setTimeout(function () {
    $e.classList.remove(highlightClass); // ハイライトクラスを削除
  }, 3000); // 3秒後に解除
};

let lines = [];
$editor.addEventListener("dblclick", function (event) {
  // Get clicked lines
  const cursorNum = $editor.selectionStart;
  const text = $editor.value;
  let current_num = 0;
  for (let line of text.split("\n")) {
    lines.push(line);
    if (
      current_num <= cursorNum &&
      cursorNum <= current_num + line.length + 1
    ) {
      // Search line preview
      console.log("clicked", lines[lines.length - 1]);
      for (let i = lines.length - 1; i > -1; i--) {
        let l = lines[i];
        l.replace(/^\*+ /g, "");
        l.replace(/^h\d+\. /g, "");
        l.replace(/^p\(\. /g, "");
        let m = findTagsByText($preview, l);
        // m.tag.scrollIntoView({
        //   behavior: "smooth", // スクロールの動作をスムーズにする
        //   block: "start", // スクロール位置を調整 ("start", "center", "end", "nearest"が使用可能)
        // });
        $preview.scrollTop = m.tag.offsetTop - 225;
        // hightlight
        highlightElem(m.tag);
        break;
      }
      return;
    }
    current_num += line.length + 1;
  }
});
