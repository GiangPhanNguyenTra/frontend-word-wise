chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "addToWordWise",
    title: "Add to WordWise",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== "addToWordWise" || !tab.id) return;
  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const selection = window.getSelection();
        const word = selection.toString().trim();
        const context = selection.anchorNode?.parentElement?.innerText || "";
        return { word, context };
      },
    });
    if (results && results[0] && results[0].result.word) {
      await chrome.storage.session.set({ wordData: results[0].result });
      chrome.action.openPopup();
    }
  } catch (err) {
    console.error("WordWise background script error:", err);
  }
});

setInterval(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    if (!activeTab?.id || !activeTab.url?.startsWith("http")) return;

    chrome.tabs.sendMessage(
      activeTab.id,
      {
        action: "show_recommendation",
        word: "Revolutionary",
        type: "adj",
        vnMeaning: "cách mạng, đột phá",
        enDefinition: "involving or causing a complete or dramatic change",
        example:
          '"This new drug is revolutionary in its approach to treating cancer."',
        tag: "Technology",
      },
      () => chrome.runtime.lastError
    );
  });
}, 10000);
