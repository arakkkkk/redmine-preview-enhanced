window.onload = () => {
  if (
    document.querySelector('meta[name="description"][content*="RedMica"]') ==
      null &&
    document.querySelector('meta[name="description"][content*="RedMica"]') ==
      null
  ) {
    return;
  }

  // Place editor previews side by side
  const $editorDiv = document.getElementsByClassName("jstEditor")[0];
  const $preview = document.getElementsByClassName("wiki-preview")[0];
  const $editor = document.getElementsByClassName("wiki-edit")[0];
  const $Tabs = document.querySelectorAll("div.jstTabs.tabs > ul")[0];
  const $tabElements = document.querySelectorAll(".tab-elements")[0];
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

  const $editorDiv2 = document.getElementsByClassName("jstEditor")[1];
  const $preview2 = document.getElementsByClassName("wiki-preview")[1];
  const $editor2 = document.getElementsByClassName("wiki-edit")[1];
  const $Tabs2 = document.querySelectorAll("div.jstTabs.tabs > ul")[1];
  const $tabElements2 = document.querySelectorAll(".tab-elements")[1];
  const $editTab2 = $Tabs2.children[0].querySelector("a");
  const $previewTab2 = $Tabs2.children[1].querySelector("a");

  previewSwitcher(
    $editor2,
    $editorDiv2,
    $previewTab2,
    $preview2,
    $editTab2,
    $Tabs2,
    $tabElements2,
    document,
  );

  jump($editor, $preview, $Tabs);
};
