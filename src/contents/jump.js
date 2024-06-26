const jump = ($editor, $preview, $tabs) => {
  ///////////////////////////
  // Preview to Editor
  ///////////////////////////
  $preview.addEventListener("dblclick", function (event) {
    let $clicked = event.target;
    let previewLines = parseDOM($preview);
    if (previewLines.getByDOM($clicked) === null) {
      if (previewLines.getByDOM($clicked.parentElement) === null) {
        $clicked = previewLines.getByDOM($clicked.parentElement.parentElement);
      } else {
        $clicked = previewLines.getByDOM($clicked.parentElement);
      }
    } else {
      $clicked = previewLines.getByDOM($clicked);
    }
    // console.log("clicked:", $clicked);
    // count parsed line
    let isPre = false;
    const lines = $editor.value.split("\n");
    let startIndex = 0;
    let lineText;
    let currentNum = 0;
    let i;
    for (i = 0; i < lines.length; i++) {
      if (currentNum == $clicked.id) break;
      let line = lines[i];
      startIndex += line.length + 1;
      if (line == "") {
        continue;
      } else if (isPre) {
        if (line.includes("</pre>")) isPre = false;
        continue;
      }
      if (line.includes("<pre>")) {
        isPre = true;
      }
      currentNum += 1;
      lineText = line;
    }
    startIndex -= lineText.length;

    $editor.focus(); // textareaにフォーカス
    $editor.setSelectionRange(startIndex - 1, startIndex + lineText.length); // 検索文字列を選択
    $editor.scrollTop =
      $editor.scrollHeight * (i / lines.length) - $editor.clientHeight / 10;
  });

  ///////////////////////////
  // Editor to Preview
  ///////////////////////////
  const highlightElem = ($e) => {
    // ハイライトのためのCSSクラス
    const highlightClass = "highlight";
    $e.classList.add(highlightClass); // ハイライトクラスを追加

    // 一定時間後にハイライトを解除
    setTimeout(function () {
      $e.classList.remove(highlightClass); // ハイライトクラスを削除
    }, 2000); // 3秒後に解除
  };

  $editor.addEventListener("dblclick", function (event) {
    // Get clicked lines
    const clickedTextNum = $editor.selectionStart;
    const text = $editor.value;
    const clickedLine = text.slice(0, clickedTextNum).split("\n").length;
    // count parsed line
    let currentNum = 0;
    let isPre = false;
    const lines = text.split("\n");
    for (let i = 0; i < lines.length; i++) {
      if (i == clickedLine) break;
      let line = lines[i];
      if (line == "") {
        continue;
      } else if (isPre) {
        if (line.includes("</pre>")) isPre = false;
        continue;
      }
      if (line.includes("<pre>")) {
        isPre = true;
      }
      currentNum += 1;
    }
    let previewLines = parseDOM($preview);
    let clikedLine = previewLines.getByID(currentNum);
    console.log(clikedLine);
    if (clikedLine.dom.tagName == "TD" || clikedLine.dom.tagName == "TR") {
      for (let i = 0; i < 10; i++) {
        clikedLine.dom = clikedLine.dom.parentElement;
        if (clikedLine.dom.tagName == "TABLE") break;
      }
    }
    // console.log(`clicked: count${currentNum}, elem: ${clikedLine}`);
    $preview.scrollTop = parseInt(
      clikedLine.dom.offsetTop - $preview.clientHeight / 3,
    );
    highlightElem(clikedLine.dom);
  });

  chrome.storage.sync.get("jumpOnScroll", (data) => {
    if (data.jumpOnScroll == false) {
      console.log("not");
      return;
    }
    $editor.addEventListener("scroll", function (event) {
      const $sidebyTab = $tabs.children[2].querySelector("a");
      if (!$sidebyTab.classList.contains("selected")) {
        return;
      }
      // Get clicked lines
      let scrollTop = $editor.scrollTop;
      let scrollRatio = scrollTop / $editor.scrollHeight;
      const text = $editor.value;
      const topLine = parseInt(text.split("\n").length * scrollRatio) + 1;
      console.log(topLine);
      // count parsed line
      let currentNum = 0;
      let isPre = false;
      const lines = text.split("\n");
      for (let i = 0; i < lines.length; i++) {
        if (i == topLine) break;
        let line = lines[i];
        if (line == "") {
          continue;
        } else if (isPre) {
          if (line.includes("</pre>")) isPre = false;
          continue;
        }
        if (line.includes("<pre>")) {
          isPre = true;
        }
        currentNum += 1;
      }
      let previewLines = parseDOM($preview);
      let clikedLine = previewLines.getByID(currentNum);
      console.log(clikedLine.dom);
      $preview.scrollTop = parseInt(
        clikedLine.dom.offsetTop - $preview.clientHeight / 3,
      );
    });
  });
};
