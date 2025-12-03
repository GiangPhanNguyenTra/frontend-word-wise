const CORE_API_URL = "https://core-word-wise.onrender.com/api/v1";
const REC_API_URL =
  "https://overluxuriously-kinematographical-annemarie.ngrok-free.dev/api";

async function getToken() {
  const data = await chrome.storage.local.get("permanentAuthToken");
  return data.permanentAuthToken;
}

async function authenticatedFetch(url, options = {}) {
  const token = await getToken();
  if (!token) throw new Error("No token found");

  const headers = {
    "Content-Type": "application/json",
    Cookie: `token=${token}`,
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  if (response.status === 401 || response.status === 403) {
    chrome.storage.local.remove("permanentAuthToken");
    throw new Error("Unauthorized");
  }
  return response;
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "addToWordWise",
    title: "Translate by WordWise",
    contexts: ["selection"],
  });
  initializeSettings();
});

chrome.runtime.onStartup.addListener(initializeSettings);

async function initializeSettings() {
  try {
    const token = await getToken();
    if (!token) return;
    const response = await authenticatedFetch(`${CORE_API_URL}/settings`);
    const json = await response.json();
    if (json.success && json.data?.settings) {
      schedulePractice(json.data.settings.study_sessions_per_day);
    }
    fetchDailyRecommendations();
  } catch (e) {
    console.error("Init failed", e);
  }
}

function schedulePractice(sessionsPerDay) {
  chrome.alarms.clearAll();
  const schedules = { 1: [12], 2: [9, 21], 3: [9, 15, 21], 4: [9, 13, 17, 21] };
  const hours = schedules[sessionsPerDay] || schedules[1];
  hours.forEach((hour, index) => {
    const now = new Date();
    let nextRun = new Date();
    nextRun.setHours(hour, 0, 0, 0);
    if (now > nextRun) nextRun.setDate(nextRun.getDate() + 1);
    chrome.alarms.create(`practice_session_${index}`, {
      when: nextRun.getTime(),
      periodInMinutes: 1440,
    });
  });
  chrome.alarms.create("fetch_daily_recs", { periodInMinutes: 1440 });
  chrome.alarms.create("show_recommendation_popup", { periodInMinutes: 30 });
}

async function fetchDailyRecommendations() {
  try {
    const token = await getToken();
    if (!token) return;
    const response = await fetch(`${REC_API_URL}/recommendations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jwt: token }),
    });
    const data = await response.json();
    if (data.results) {
      await chrome.storage.local.set({ dailyRecs: data.results, recIndex: 0 });
    }
  } catch (e) {
    console.error("Fetch recs failed", e);
  }
}

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name.startsWith("practice_session_")) {
    try {
      const response = await authenticatedFetch(
        `${CORE_API_URL}/practice/extension-words`
      );
      const json = await response.json();
      if (json.success) {
        await chrome.storage.session.set({
          practiceQueue: json.data,
          triggerPractice: true,
        });
        chrome.action.openPopup();
      }
    } catch (e) {
      console.error(e);
    }
  } else if (alarm.name === "fetch_daily_recs") {
    fetchDailyRecommendations();
  } else if (alarm.name === "show_recommendation_popup") {
    const data = await chrome.storage.local.get(["dailyRecs", "recIndex"]);
    if (data.dailyRecs?.length > 0) {
      const idx = data.recIndex || 0;
      const word = data.dailyRecs[idx % data.dailyRecs.length];
      const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "show_recommendation",
          data: word,
        });
        await chrome.storage.local.set({ recIndex: idx + 1 });
      }
    }
  }
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "addToWordWise") {
    const selection = info.selectionText;
    const injection = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.getSelection().anchorNode.parentElement.innerText,
    });
    const context = injection[0]?.result || selection;

    // Lưu dữ liệu thô và mở popup ngay lập tức, việc gọi API enrich để add-word.js lo
    await chrome.storage.session.set({
      rawAddWordData: { word: selection, context: context },
    });
    chrome.action.openPopup();
  }
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  // Add Word: Enrich Data
  if (msg.action === "enrich_word_data") {
    (async () => {
      try {
        const response = await fetch(`${REC_API_URL}/v1/enrich/contextual`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ word: msg.word, context: msg.context }),
        });
        const data = await response.json();
        sendResponse({ success: true, data: data });
      } catch (e) {
        sendResponse({ success: false });
      }
    })();
    return true;
  }

  // Practice: Fetch Words manually
  if (msg.action === "fetch_practice_now") {
    (async () => {
      try {
        const response = await authenticatedFetch(
          `${CORE_API_URL}/practice/extension-words`
        );
        const json = await response.json();
        sendResponse(json);
      } catch (e) {
        sendResponse({ success: false });
      }
    })();
    return true;
  }

  // Content Script: Save Word
  if (msg.action === "save_word_from_content") {
    const payload = {
      collection: msg.data.recommended_collection || "General",
      words: [msg.data],
    };
    authenticatedFetch(`${CORE_API_URL}/collections/add-words`, {
      method: "POST",
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((json) => sendResponse(json))
      .catch(() => sendResponse({ success: false }));
    return true;
  }
});

chrome.runtime.onMessageExternal.addListener(
  (request, sender, sendResponse) => {
    if (request.token) {
      chrome.storage.local.set({ permanentAuthToken: request.token }, () => {
        initializeSettings();
        sendResponse({ success: true });
      });
    }
    return true;
  }
);
