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

    previewSwitcher(
      $editor,
      $editorDiv,
      $previewTab,
      $preview,
      $editTab,
      $Tabs,
      $tabElements,
      document,
    );

    jump($editor, $preview, $Tabs);
  });
};
