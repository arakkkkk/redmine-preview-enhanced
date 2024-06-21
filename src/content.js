window.onload = () => {
  chrome.storage.sync.get("redmineURL", (data) => {
    const redmineURL = data.redmineURL;
    const patternRegex = new RegExp(
      "^" + redmineURL.replace(/\*/g, ".*") + "$",
    );
    if (!location.href.match(patternRegex)) {
      return;
    }
    if (
      !location.href.match(/\/wiki\//g) &&
      !location.href.match(/\/issues\//g)
    ) {
      return;
    }

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
      let $clicked = event.target;
      let previewLines = parseDOM($preview);
      if (previewLines.getByDOM($clicked) === null) {
        if (previewLines.getByDOM($clicked.parentElement) === null) {
          $clicked = previewLines.getByDOM(
            $clicked.parentElement.parentElement,
          );
        } else {
          $clicked = previewLines.getByDOM($clicked.parentElement);
        }
      } else {
        $clicked = previewLines.getByDOM($clicked);
      }
      console.log("clicked:", $clicked);
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
      console.log(`clicked: count${currentNum}, elem: ${clikedLine}`);
      $preview.scrollTop =
        clikedLine.dom.offsetTop - 225 - $preview.clientHeight / 10;
      highlightElem(clikedLine.dom);
    });

    // $editor.addEventListener("scroll", function (event) {
    //   let scrollTop = $editor.scrollTop;
    //   let scrollRatio = scrollTop / $editor.scrollHeight;
    //   let previewLines = parseDOM($preview);
    //   let lineNumber = Math.floor(previewLines.data.length * scrollRatio);
    //   previewLines.jump($preview, lineNumber);
    // });
    // $preview.addEventListener("scroll", function (event) {});
  });
};
