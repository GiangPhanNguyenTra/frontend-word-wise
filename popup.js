document.addEventListener("DOMContentLoaded", async () => {
  const mainMenuView = document.getElementById("main-menu-view");
  const addWordView = document.getElementById("add-word-view");

  const data = await chrome.storage.session.get("wordData");

  if (data && data.wordData) {
    displayAddWordView(data.wordData);
    await chrome.storage.session.remove("wordData");
  } else {
    mainMenuView.style.display = "block";
    addWordView.style.display = "none";
  }

  function displayAddWordView({ word, context }) {
    mainMenuView.style.display = "none";
    addWordView.style.display = "block";

    addWordView.innerHTML = `
      <h1 style="color: #2563eb; font-weight: 700; font-size: 1.25rem; margin-bottom: 0.25rem;">Word Wise</h1>
      <h2 style="font-weight: 700; font-size: 1.125rem; margin-bottom: 1rem; color: #111827;">Add New Word</h2>
      
      <div style="display: flex; align-items: baseline; gap: 0.5rem; margin-bottom: 0.75rem;">
        <div style="font-size: 1.125rem; color: #3B82F6; font-weight: 600;">${word}</div>
        <div style="color: #6B7280; font-size: 0.875rem;">: tạm dịch</div>
      </div>
      
      <textarea id="context-textarea" style="width: 100%; border: 1px solid #D1D5DB; border-radius: 0.5rem; padding: 0.5rem; font-size: 0.875rem; box-sizing: border-box; resize: none; overflow-y: hidden; line-height: 1.5; margin-bottom: 0.75rem;">${context}</textarea>
      
      <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.25rem;">
        <span class="wwise-tag" style="padding: 0.25rem 0.75rem; background-color: #EFF6FF; color: #6B7280; border-radius: 9999px; font-size: 0.875rem;">Science</span>
        <span class="wwise-tag" style="padding: 0.25rem 0.75rem; background-color: #EFF6FF; color: #6B7280; border-radius: 9999px; font-size: 0.875rem;">Technology</span>
        <span class="wwise-tag" style="padding: 0.25rem 0.75rem; background-color: #EFF6FF; color: #6B7280; border-radius: 9999px; font-size: 0.875rem;">Family</span>
      </div>
      
      <div style="display: flex; gap: 0.5rem;">
        <button id="cancelBtn" style="flex: 1; background-color: #F3F4F6; color: #374151; padding: 0.6rem 0; border-radius: 0.375rem; border: none; cursor: pointer; font-weight: 500; font-size: 0.875rem;">Cancel</button>
        <button id="addBtn" class="wwise-btn-primary" style="flex: 1; background-color: #3B82F6; color: #FFFFFF; padding: 0.6rem 0; border-radius: 0.375rem; border: none; cursor: pointer; font-weight: 500; font-size: 0.875rem;">Add to collection</button>
      </div>
    `;

    const textarea = addWordView.querySelector("#context-textarea");
    function autoResizeTextarea(element) {
      element.style.height = "auto";
      element.style.height = element.scrollHeight + "px";
    }
    autoResizeTextarea(textarea);
    textarea.addEventListener("input", () => autoResizeTextarea(textarea));

    const tags = addWordView.querySelectorAll(".wwise-tag");
    tags.forEach((clickedTag) => {
      clickedTag.addEventListener("click", () => {
        // Bỏ class 'selected' khỏi tất cả các tag
        tags.forEach((tag) => {
          tag.classList.remove("selected");
        });
        // Chỉ thêm class 'selected' cho tag vừa được nhấn
        clickedTag.classList.add("selected");
      });
    });

    addWordView.querySelector("#cancelBtn").addEventListener("click", () => {
      window.close();
    });

    addWordView.querySelector("#addBtn").addEventListener("click", () => {
      addWordView.innerHTML = `<p style='color: #16a34a; font-size: 1rem; font-weight: 600; text-align: center; padding: 2rem 0;'>✅ Added to your collection!</p>`;
      setTimeout(() => window.close(), 1500);
    });
  }
});
