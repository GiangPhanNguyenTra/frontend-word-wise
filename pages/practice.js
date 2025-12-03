document.addEventListener("DOMContentLoaded", async () => {
  let vocabList = [];
  const container = document.body;

  // 1. Helper to parse API data to App format
  const parseData = (dataList) => {
    return dataList.map((item) => ({
      word: item.word,
      vnMeaning: item.wordVn,
      enDefinition: item.definitionEn,
      // Prefer example from API, else fallback
      example:
        item.examples && item.examples[0]
          ? item.examples[0].en
          : `Example for ${item.word}`,
    }));
  };

  // 2. Check Storage first
  const data = await chrome.storage.session.get("practiceQueue");
  if (data.practiceQueue && data.practiceQueue.length > 0) {
    vocabList = parseData(data.practiceQueue);
  } else {
    // 3. Not in storage? Fetch immediately!
    document.body.innerHTML = `
      <div style="height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center;">
        <div style="border: 3px solid #f3f3f3; border-top: 3px solid #2563eb; border-radius: 50%; width: 24px; height: 24px; animation: spin 1s linear infinite; margin-bottom: 1rem;"></div>
        <p style="color: #6b7280;">Fetching new practice session...</p>
        <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
      </div>`;

    // Send message to background to fetch
    const response = await new Promise((resolve) => {
      chrome.runtime.sendMessage({ action: "fetch_practice_now" }, resolve);
    });

    if (
      response &&
      response.success &&
      response.data &&
      response.data.length > 0
    ) {
      vocabList = parseData(response.data);
      // Restore Body HTML structure for the app to run
      location.reload(); // Simple reload to re-run script with data now in memory (or re-render).
      // Actually, let's just re-render properly without reload to be smoother:

      // Save to storage so next time (or reload) it's there
      await chrome.storage.session.set({ practiceQueue: response.data });

      // Re-inject HTML structure since we wiped body
      document.body.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
              <h2 style="color: #2563eb; margin: 0; font-size: 1.25rem;">Practice</h2>
              <span id="progress-counter" style="color: #6b7280; font-size: 0.9rem; font-weight: 500;">(0/0)</span>
            </div>
            <div style="display: flex; border-bottom: 1px solid #e5e7eb; margin-bottom: 1.5rem;">
              <button class="tab-btn" data-tab-target="translation" style="color: #2563eb; border-color: #2563eb;">Translation</button>
              <button class="tab-btn" data-tab-target="definition">Definition</button>
              <button class="tab-btn" data-tab-target="fill-blank">Fill Blank</button>
            </div>
            <div id="translation-content">
              <p style="text-align: center; color: #4b5563; margin-bottom: 0.5rem;">Translate this word:</p>
              <h3 style="text-align: center; color: #111827; font-size: 1.5rem; margin: 0 0 1.5rem 0;"><span style="border-bottom: 2px dashed #9ca3af;"></span></h3>
              <input type="text" placeholder="Type answer here..." style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 1rem; box-sizing: border-box; outline: none;" />
            </div>
            <div id="definition-content" style="display: none;">
              <p style="text-align: center; color: #4b5563; margin-bottom: 1rem;">Choose definition for: <span style="font-weight: 700; color: #2563eb; font-size: 1.1rem;"></span></p>
              <div style="display: flex; flex-direction: column; gap: 0.5rem;"></div>
            </div>
            <div id="fill-blank-content" style="display: none;">
              <p style="font-size: 0.95rem; color: #374151; text-align: center; margin-bottom: 1.5rem; line-height: 1.5; font-style: italic; background: #f9fafb; padding: 0.5rem; border-radius: 0.375rem;"></p>
              <div id="fill-blank-inputs" style="display: flex; flex-wrap: wrap; justify-content: center; margin-bottom: 1.5rem;"></div>
              <div id="fill-blank-options" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 0.5rem;"></div>
            </div>
            <div id="action-container" style="margin-top: 2rem; display: flex; justify-content: space-between; align-items: center;">
              <button class="wwise-link-btn" style="background: none; border: none; color: #6b7280; cursor: pointer; font-size: 0.9rem;">Skip</button>
              <button class="wwise-btn-primary" style="background: #2563eb; color: white; padding: 0.6rem 1.5rem; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 600; font-size: 0.95rem;">Check</button>
            </div>
        `;
    } else {
      document.body.innerHTML = `<div style="text-align:center; padding: 2rem; color: #6b7280;">
            No practice words available or connection failed. <br><br>
            <a href="../popup.html" style="color:#2563eb; text-decoration:none;">Back to Menu</a>
        </div>`;
      return;
    }
  }

  // --- Logic start game ---
  let shuffledVocab = [...vocabList].sort(() => Math.random() - 0.5);
  let currentIndex = 0;
  let currentWord = null;
  let selectedDefBtn = null;

  // Re-select elements after potentially rewriting innerHTML
  const tabs = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll("[id$='-content']");
  const actionContainer = document.getElementById("action-container");
  const defaultActionHTML = actionContainer.innerHTML;
  const progressEl = document.getElementById("progress-counter");

  function switchTab(target) {
    tabContents.forEach((c) => (c.style.display = "none"));
    tabs.forEach((t) => {
      t.style.color = "#9ca3af";
      t.style.borderColor = "transparent";
    });
    document.getElementById(target + "-content").style.display = "block";
    const activeTab = document.querySelector(`[data-tab-target="${target}"]`);
    if (activeTab) {
      activeTab.style.color = "#2563eb";
      activeTab.style.borderColor = "#2563eb";
    }
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => switchTab(tab.dataset.tabTarget));
  });

  function renderQuestion() {
    if (currentIndex >= shuffledVocab.length) {
      document.body.innerHTML = `<div style="text-align:center; padding: 3rem; color: #16a34a; font-weight: bold; font-size: 1.2rem;">🎉 Session Completed!</div>`;
      setTimeout(() => {
        chrome.storage.session.remove("practiceQueue");
        window.close();
      }, 2000);
      return;
    }

    currentWord = shuffledVocab[currentIndex];
    progressEl.textContent = `(${currentIndex + 1}/${shuffledVocab.length})`;
    actionContainer.innerHTML = defaultActionHTML;

    // Re-attach events
    actionContainer.querySelector(".wwise-link-btn").onclick = () => {
      loadNext();
    };
    actionContainer.querySelector(".wwise-btn-primary").onclick = checkAnswer;

    // Translation Tab
    document.querySelector(
      "#translation-content span"
    ).textContent = `"${currentWord.vnMeaning}"`;
    const transInput = document.querySelector("#translation-content input");
    transInput.value = "";
    transInput.onkeydown = (e) => {
      if (e.key === "Enter") checkAnswer();
    };

    // Definition Tab
    document.querySelector(
      "#definition-content span"
    ).textContent = `"${currentWord.word}"`;
    const defContainer = document.querySelector("#definition-content div");

    // Get wrong definitions
    const wrongDefs = vocabList
      .filter((w) => w.word !== currentWord.word)
      .map((w) => w.enDefinition);
    // Pick 3 wrong + 1 correct
    const options = [
      currentWord.enDefinition,
      ...wrongDefs.sort(() => 0.5 - Math.random()).slice(0, 3),
    ].sort(() => 0.5 - Math.random());

    defContainer.innerHTML = options
      .map(
        (opt) =>
          `<button class="def-opt" style="width: 100%; text-align: left; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem; background: white; cursor: pointer; margin-bottom: 0.5rem; font-size: 0.9rem; color: #374151;">${opt}</button>`
      )
      .join("");

    selectedDefBtn = null;
    defContainer.querySelectorAll(".def-opt").forEach((btn) => {
      btn.onclick = () => {
        defContainer.querySelectorAll(".def-opt").forEach((b) => {
          b.style.borderColor = "#d1d5db";
          b.style.backgroundColor = "white";
        });
        btn.style.borderColor = "#3b82f6";
        btn.style.backgroundColor = "#eff6ff";
        selectedDefBtn = btn;
      };
    });

    // Fill Blank Tab
    const hintIdx = Math.floor(currentWord.word.length / 2);
    // Replace word in example with blanks
    const blankWord = "__________";
    const regex = new RegExp(currentWord.word, "gi");
    document.querySelector("#fill-blank-content p").innerHTML =
      currentWord.example.replace(
        regex,
        `<span style="font-weight:700">${blankWord}</span>`
      );

    const inputsDiv = document.getElementById("fill-blank-inputs");
    const optionsDiv = document.getElementById("fill-blank-options");

    inputsDiv.innerHTML = "";
    currentWord.word.split("").forEach((char, i) => {
      if (i === hintIdx)
        inputsDiv.innerHTML += `<div class="char-hint">${char}</div>`;
      else
        inputsDiv.innerHTML += `<input type="text" class="char-input" readonly />`;
    });

    const letters = currentWord.word
      .split("")
      .filter((_, i) => i !== hintIdx)
      .sort(() => 0.5 - Math.random());
    optionsDiv.innerHTML = letters
      .map(
        (l, i) =>
          `<button data-idx="${i}" class="char-opt" style="width: 2.5rem; height: 2.5rem; border: 1px solid #d1d5db; background: white; border-radius: 0.25rem; cursor: pointer; font-size: 1rem;">${l}</button>`
      )
      .join("");

    // Logic inputs
    const inputs = inputsDiv.querySelectorAll("input");
    const charBtns = optionsDiv.querySelectorAll("button");
    let currentInputIdx = 0;

    charBtns.forEach((btn) => {
      btn.onclick = () => {
        if (currentInputIdx < inputs.length) {
          inputs[currentInputIdx].value = btn.innerText;
          btn.style.visibility = "hidden";
          inputs[currentInputIdx].dataset.btnIdx = btn.dataset.idx;
          currentInputIdx++;
        }
      };
    });

    inputs.forEach((inp, idx) => {
      inp.onclick = () => {
        if (inp.value) {
          const btnIdx = inp.dataset.btnIdx;
          const btn = optionsDiv.querySelector(`button[data-idx="${btnIdx}"]`);
          if (btn) btn.style.visibility = "visible";
          inp.value = "";

          // Reset logic simple: clear from here onwards
          let found = false;
          let newIdx = 0;
          inputs.forEach((ii, index) => {
            if (ii === inp) found = true;
            if (found && ii.value) {
              const bIdx = ii.dataset.btnIdx;
              const b = optionsDiv.querySelector(`button[data-idx="${bIdx}"]`);
              if (b) b.style.visibility = "visible";
              ii.value = "";
            }
          });

          // Recalculate next empty slot
          for (let i = 0; i < inputs.length; i++) {
            if (!inputs[i].value) {
              currentInputIdx = i;
              break;
            }
          }
        }
      };
    });

    // Default switch
    switchTab("translation");
  }

  function checkAnswer() {
    const activeTabEl = document.querySelector(
      ".tab-btn[style*='rgb(37, 99, 235)']"
    );
    const activeTab = activeTabEl
      ? activeTabEl.dataset.tabTarget
      : "translation";
    let correct = false;

    if (activeTab === "translation") {
      const val = document
        .querySelector("#translation-content input")
        .value.trim()
        .toLowerCase();
      correct = val === currentWord.word.toLowerCase();
    } else if (activeTab === "definition") {
      correct =
        selectedDefBtn && selectedDefBtn.innerText === currentWord.enDefinition;
    } else {
      let formed = "";
      const els = document.getElementById("fill-blank-inputs").children;
      for (let el of els) {
        if (el.tagName === "DIV") formed += el.innerText;
        else formed += el.value;
      }
      correct = formed.toLowerCase() === currentWord.word.toLowerCase();
    }

    const msg = correct
      ? `<span style="color:#16a34a">✅ Correct!</span>`
      : `<span style="color:#dc2626">❌ Wrong! It's <b>${currentWord.word}</b></span>`;

    actionContainer.innerHTML = `<div style="text-align:center; width:100%; font-size:1.1rem; font-weight:600; padding: 0.5rem;">${msg}</div>`;

    setTimeout(loadNext, 1500);
  }

  function loadNext() {
    currentIndex++;
    renderQuestion();
  }

  renderQuestion();
});
