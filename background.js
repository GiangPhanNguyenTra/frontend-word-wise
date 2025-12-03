chrome.runtime.onMessageExternal.addListener(
  (request, sender, sendResponse) => {
    if (request.action === "setPermanentAuthToken") {
      const token = request.token;
      if (token) {
        chrome.storage.local.set({ permanentAuthToken: token }, () => {
          console.log(
            "WordWise: Permanent auth token received and stored successfully."
          );
          sendResponse({
            success: true,
            message: "Token stored successfully.",
          });
        });
      } else {
        console.error(
          "WordWise: Received request to set token, but no token was provided."
        );
        sendResponse({ success: false, message: "No token provided." });
      }
      return true;
    }
  }
);

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "addToWordWise",
    title: "Add to WordWise",
    contexts: ["selection"],
  });

  chrome.alarms.create("practiceReminder", {
    delayInMinutes: 0.16,
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

// Lắng nghe sự kiện khi báo thức reo
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "practiceReminder") {
    await chrome.storage.session.set({ openPracticeView: true });
    chrome.action.openPopup();
  }
});

// Gửi gợi ý từ vựng (vẫn giữ lại)
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
