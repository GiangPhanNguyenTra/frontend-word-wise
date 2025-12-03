const CORE_API_URL = "https://core-word-wise.onrender.com/api/v1";

document.addEventListener("DOMContentLoaded", async () => {
  // 1. Get RAW Data immediately
  const session = await chrome.storage.session.get("rawAddWordData");
  const rawData = session.rawAddWordData;

  if (!rawData) {
    window.location.href = "../popup.html";
    return;
  }

  // 2. Render what we have immediately
  document.getElementById("word-display").textContent = rawData.word;
  document.getElementById("context-input").value = rawData.context || "";

  // Variables to hold enriched data
  let enrichedData = null;

  // 3. Call API to enrich data via Background (to avoid CORS issues or token issues)
  chrome.runtime.sendMessage(
    {
      action: "enrich_word_data",
      word: rawData.word,
      context: rawData.context,
    },
    (response) => {
      const loadingDiv = document.getElementById("translation-loading");
      const resultDiv = document.getElementById("translation-result");
      const saveBtn = document.getElementById("save-btn");

      if (response && response.success) {
        enrichedData = response.data;
        loadingDiv.style.display = "none";
        resultDiv.style.display = "block";
        saveBtn.disabled = false;

        // Update UI with Enriched Data
        document.getElementById("phonetic-display").textContent =
          enrichedData.phonetics?.us?.text ||
          enrichedData.phonetics?.uk?.text ||
          "";

        // USE VIETNAMESE MEANING & DEFINITION
        document.getElementById("vn-meaning").textContent =
          enrichedData.word_vn || "Không tìm thấy";
        document.getElementById("vi-def").textContent =
          enrichedData.definition_vi || enrichedData.definition_en;
      } else {
        loadingDiv.innerHTML =
          "<span style='color:red; font-size:0.85rem'>Translation failed. You can still save.</span>";
        saveBtn.disabled = false;
        // Fallback object structure to prevent crash on save
        enrichedData = {
          word: rawData.word,
          word_vn: rawData.word, // Fallback
          phonetics: {},
          definition_en: "",
          definition_vi: "",
          source: "",
        };
      }
    }
  );

  // 4. Load Collections
  loadCollections();

  // 5. Button Logic
  document.getElementById("cancel-btn").onclick = async () => {
    await chrome.storage.session.remove("rawAddWordData");
    window.location.href = "../popup.html";
  };

  document.getElementById("save-btn").onclick = async () => {
    if (!enrichedData) return;

    const selectedTag = document.querySelector(".tag-item.selected");
    if (!selectedTag) {
      alert("Please select a collection");
      return;
    }

    const btn = document.getElementById("save-btn");
    btn.textContent = "Saving...";
    btn.disabled = true;

    try {
      const tokenData = await chrome.storage.local.get("permanentAuthToken");
      const contextVal = document.getElementById("context-input").value;

      const payload = {
        collection: selectedTag.textContent,
        words: [
          {
            word: rawData.word,
            word_vn: enrichedData.word_vn,
            phonetics: enrichedData.phonetics,
            partOfSpeech: enrichedData.partOfSpeech || "noun",
            definition_en: enrichedData.definition_en,
            definition_vi: enrichedData.definition_vi,
            examples: [{ en: contextVal, vi: "" }],
            source: enrichedData.source,
            synonyms: enrichedData.synonyms || [],
          },
        ],
      };

      const res = await fetch(`${CORE_API_URL}/collections/add-words`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenData.permanentAuthToken}`,
        },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (json.success) {
        document.getElementById("content-area").style.display = "none";
        document.getElementById("message-area").style.display = "flex";
        await chrome.storage.session.remove("rawAddWordData");
        setTimeout(() => window.close(), 1500);
      } else {
        throw new Error("API reported failure");
      }
    } catch (e) {
      alert("Failed to save word.");
      btn.textContent = "Save Word";
      btn.disabled = false;
    }
  };
});

async function loadCollections() {
  try {
    const tokenData = await chrome.storage.local.get("permanentAuthToken");
    if (!tokenData.permanentAuthToken) return;

    const res = await fetch(`${CORE_API_URL}/collections/names`, {
      headers: {
        Authorization: `Bearer ${tokenData.permanentAuthToken}`,
        "Content-Type": "application/json",
      },
    });
    const json = await res.json();

    const tagsContainer = document.getElementById("tags-container");
    tagsContainer.innerHTML = "";

    if (json.data && Array.isArray(json.data)) {
      json.data.forEach((name, index) => {
        const tag = document.createElement("span");
        tag.className = "tag-item";
        if (index === 0) tag.classList.add("selected"); // Auto select first
        tag.style.cssText =
          "padding: 0.25rem 0.75rem; background-color: #eff6ff; color: #2563eb; border-radius: 999px; font-size: 0.75rem;";
        tag.textContent = name;
        tag.onclick = () => {
          document
            .querySelectorAll(".tag-item")
            .forEach((t) => t.classList.remove("selected"));
          tag.classList.add("selected");
        };
        tagsContainer.appendChild(tag);
      });
    }
  } catch (e) {
    document.getElementById("tags-container").innerHTML =
      "<span style='color:red; font-size:0.8rem'>Error loading collections</span>";
  }
}
