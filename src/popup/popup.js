$saveButton = document.getElementById("saveButton");
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
