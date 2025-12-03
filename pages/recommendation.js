document.addEventListener("DOMContentLoaded", async () => {
  const container = document.body;

  const data = await chrome.storage.local.get("dailyRecs");
  if (!data.dailyRecs || data.dailyRecs.length === 0) {
    container.innerHTML =
      "<p style='text-align:center; padding: 20px; color: #666;'>No recommendations for today yet.</p>";
    return;
  }

  const listContainer = document.createElement("div");
  listContainer.style.display = "flex";
  listContainer.style.flexDirection = "column";
  listContainer.style.gap = "1rem";

  data.dailyRecs.slice(0, 10).forEach((wordData) => {
    const card = document.createElement("div");
    card.style.cssText =
      "background-color: #eff6ff; padding: 1rem; border-radius: 0.5rem; border: 1px solid #dbeafe;";

    const phonetic = wordData.phonetics?.us?.text || "";

    card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
          <h3 style="font-size: 1.1rem; font-weight: 700; color: #111827; margin: 0;">${
            wordData.word
          }</h3>
          <span style="background-color: #fff; color: #2563eb; padding: 0.1rem 0.5rem; border-radius: 4px; font-size: 0.75rem; border: 1px solid #bfdbfe;">${
            wordData.recommended_collection || "General"
          }</span>
        </div>
        <p style="color: #6b7280; font-size: 0.8rem; margin: 0 0 0.25rem 0;">${
          wordData.partOfSpeech
        } • ${phonetic}</p>
        <p style="color: #1f2937; margin: 0 0 0.25rem 0; font-weight: 500;">${
          wordData.word_vn
        }</p>
        <p style="color: #374151; font-size: 0.85rem; margin: 0;">${
          wordData.definition_en
        }</p>
      `;
    listContainer.appendChild(card);
  });

  // Replace content below title
  const title = container.querySelector("h3"); // Assuming standard header structure
  // Since HTML structure provided was a single card, let's clear and append list
  container.innerHTML = `<h2 style="color: #2563eb; margin: 0 0 1rem 0;">Daily Recommendations</h2>`;
  container.appendChild(listContainer);
});
