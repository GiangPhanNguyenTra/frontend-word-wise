chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "show_recommendation") {
    renderRecommendation(msg.data);
  }
});

function renderRecommendation(wordData) {
  const existing = document.getElementById("ww-rec-overlay");
  if (existing) existing.remove();

  const container = document.createElement("div");
  container.id = "ww-rec-overlay";

  const phonetic =
    wordData.phonetics?.us?.text || wordData.phonetics?.uk?.text || "";
  const audio =
    wordData.phonetics?.us?.audio || wordData.phonetics?.uk?.audio || "";
  const example =
    wordData.examples && wordData.examples[0] ? wordData.examples[0].en : "";
  const collection = wordData.recommended_collection || "General";

  container.innerHTML = `
    <div class="ww-card">
      <div class="ww-header">
        <div>
            <h3 class="ww-word">${wordData.word}</h3>
            <span class="ww-phonetic">${phonetic} ${audio ? "🔊" : ""}</span>
        </div>
        <span class="ww-badge">${collection}</span>
      </div>
      <p class="ww-pos">${wordData.partOfSpeech}</p>
      <p class="ww-meaning">${wordData.word_vn}</p>
      <p class="ww-def">${wordData.definition_en}</p>
      ${example ? `<p class="ww-example">"${example}"</p>` : ""}
      <div class="ww-actions">
        <button id="ww-dismiss">Dismiss</button>
        <button id="ww-save">Save</button>
      </div>
    </div>
  `;

  document.body.appendChild(container);

  if (audio) {
    container.querySelector(".ww-phonetic").style.cursor = "pointer";
    container.querySelector(".ww-phonetic").onclick = () => {
      new Audio(audio).play();
    };
  }

  container.querySelector("#ww-dismiss").onclick = () => container.remove();

  const saveBtn = container.querySelector("#ww-save");
  saveBtn.onclick = () => {
    saveBtn.innerText = "Saving...";
    chrome.runtime.sendMessage(
      { action: "save_word_from_content", data: wordData },
      (res) => {
        if (res && res.success) {
          saveBtn.innerText = "Saved!";
          saveBtn.style.backgroundColor = "#16a34a";
          setTimeout(() => container.remove(), 1500);
        } else {
          saveBtn.innerText = "Failed";
          saveBtn.style.backgroundColor = "#dc2626";
        }
      }
    );
  };
}
