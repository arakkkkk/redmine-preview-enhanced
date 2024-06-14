$saveButton = document.getElementById("saveButton");
$input = document.getElementById("urlInput");
chrome.storage.sync.get("redmineURL", (data) => {
  const redmineURL = data.redmineURL;
  if (redmineURL) {
    $input.value = redmineURL;
  }
});

$saveButton.addEventListener("click", () => {
  const url = document.getElementById("urlInput").value;
  url.replace(/\/$/g, "");
  chrome.storage.sync.set({ redmineURL: url }, () => {
    console.log("URL is set to " + url);
  });
});
