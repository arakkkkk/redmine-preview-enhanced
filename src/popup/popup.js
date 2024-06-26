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
  chrome.storage.sync.set({ redmineURL: url }, () => {
    console.log("URL is set to " + url);
  });
});

$scrollCheck = document.getElementById("scrollCheck");
chrome.storage.sync.get("jumpOnScroll", (data) => {
  console.log(data.jumpOnScroll);
  console.log(data.jumpOnScroll ?? true);
  const jumpOnScroll = data.jumpOnScroll ?? true;
  $scrollCheck.checked = jumpOnScroll;
});

$scrollCheck.addEventListener("change", () => {
  const jumpOnScroll = document.getElementById("scrollCheck").checked;
  console.log(jumpOnScroll);
  chrome.storage.sync.set({ jumpOnScroll: jumpOnScroll }, () => {
    // console.log("URL is set to " + url);
  });
});
