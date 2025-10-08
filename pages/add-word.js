document.addEventListener("DOMContentLoaded", async () => {
  const wordContainer = document.getElementById("word-container");
  const emptyState = document.getElementById("empty-state");

  chrome.storage.local.get("selectedWord", (data) => {
    if (data.selectedWord) {
      wordContainer.classList.remove("hidden");
      emptyState.classList.add("hidden");
      document.getElementById("word").textContent = data.selectedWord;
      document.getElementById(
        "context"
      ).value = `Example sentence with "${data.selectedWord}" ...`;
    }
  });

  document.getElementById("add-btn").addEventListener("click", () => {
    alert("Added to collection (mock)");
    window.close();
  });
});
