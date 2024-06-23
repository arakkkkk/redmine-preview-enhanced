const previewSwitcher = (
  $editor,
  $editorDiv,
  $previewTab,
  $preview,
  $editTab,
  $Tabs,
  $tabElements,
  document,
) => {
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

    for (let $t of $Tabs.children) {
      if (!$t.querySelector("a")) {
        continue;
      }
      $tabElements.querySelector("div").classList.remove("hidden");
      $t.querySelector("a").classList.remove("selected");
    }
    $a.classList.add("selected");
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
  // reload preview
  var typingTimer; // タイマーのID
  var doneTypingInterval = 1000; // 2秒（2000ミリ秒）の間隔

  function doneTyping() {
    switchSideByView();
  }

  $editor.addEventListener("input", function () {
    if (!$sideByTab.querySelector("a").classList.contains("selected")) return;
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTyping, doneTypingInterval);
  });

  $editor.addEventListener("keydown", function () {
    clearTimeout(typingTimer);
  });
};
