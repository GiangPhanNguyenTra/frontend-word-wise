chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "show_recommendation") {
    showRecommendation(
      msg.word,
      msg.type,
      msg.vnMeaning,
      msg.enDefinition,
      msg.example,
      msg.tag
    );
  }
});

function showRecommendation(word, type, vnMeaning, enDefinition, example, tag) {
  const existing = document.getElementById("wordwise-recommendation");
  if (existing) existing.remove();

  const box = document.createElement("div");
  box.id = "wordwise-recommendation";

  Object.assign(box.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    backgroundColor: "white",
    boxShadow:
      "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    border: "1px solid #F3F4F6",
    padding: "1.5rem",
    borderRadius: "1rem",
    width: "380px",
    zIndex: "999999",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  });

  box.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.25rem;">
      <h3 style="font-size: 1.25rem; font-weight: 700; color: #111827; line-height: 1.2;">${word}</h3>
      <span style="background-color: #E9EFFD; color: #2563EB; padding: 0.25rem 0.75rem; border-radius: 0.375rem; font-size: 0.875rem; font-weight: 500; white-space: nowrap;">${tag}</span>
    </div>
    <p style="font-size: 0.875rem; color: #9CA3AF; margin-bottom: 0.25rem;">${type}</p>
    <p style="font-size: 0.875rem; color: #1F2937; margin-bottom: 0.25rem; font-weight: 500;">${vnMeaning}</p>
    <p style="font-size: 0.875rem; color: #1F2937; margin-bottom: 0.25rem; line-height: 1.25;">${enDefinition}</p>
    <p style="font-size: 0.875rem; color: #9CA3AF; margin-bottom:0.25rem; font-style: italic;">${example}</p>
    <div style="display: flex; justify-content: flex-end; align-items: center; gap: 1rem;">
      <button id="dismissBtn" style="background: none; border: none; color: #3B82F6; font-size: 0.75rem; cursor: pointer; font-weight: 500; padding: 0.5rem;">Dismiss</button>
      <button id="saveBtn" style="background-color: #3B82F6; color: #FFFFFF; padding: 0.6rem 1.25rem; border-radius: 0.5rem; border: none; cursor: pointer; font-weight: 500; font-size: 0.9rem;">Save</button>
    </div>
  `;
  document.body.appendChild(box);

  box.querySelector("#dismissBtn").onclick = () => box.remove();
  box.querySelector("#saveBtn").onclick = () => {
    box.innerHTML = `<p style='color: #16a34a; font-size: 0.875rem; font-weight: 600; text-align: center; padding: 2rem 0;'>✅ Saved to your collection!</p>`;
    setTimeout(() => box.remove(), 1500);
  };
}
