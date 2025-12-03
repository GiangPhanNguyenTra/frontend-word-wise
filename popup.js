document.addEventListener("DOMContentLoaded", async () => {
  const session = await chrome.storage.session.get([
    "rawAddWordData",
    "triggerPractice",
  ]);

  if (session.triggerPractice) {
    await chrome.storage.session.remove("triggerPractice");
    window.location.href = "pages/practice.html";
    return;
  }

  if (session.rawAddWordData) {
    window.location.href = "pages/add-word.html";
    return;
  }
});
