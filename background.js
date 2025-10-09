chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "addToWordWise",
    title: "Add to WordWise",
    contexts: ["selection"],
  });

  // Tạo báo thức CHỈ CHẠY MỘT LẦN sau 10 giây để test
  // Không có `periodInMinutes` nghĩa là nó sẽ không lặp lại.
  chrome.alarms.create("practiceReminder", {
    delayInMinutes: 0.16, // ~10 giây
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
    // 1. Đặt một "tín hiệu" trong storage để báo cho popup biết
    await chrome.storage.session.set({ openPracticeView: true });
    // 2. Mở popup của extension
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
