document.addEventListener("DOMContentLoaded", () => {
  const VOCABULARY_LIST = [
    {
      word: "ephemeral",
      vnMeaning: "phù du, thoáng qua",
      enDefinition: "Lasting for a very short time.",
      example:
        "The beauty of the cherry blossoms is ephemeral, lasting only for a week.",
    },
    {
      word: "serendipity",
      vnMeaning: "sự tình cờ may mắn",
      enDefinition:
        "The occurrence of events by chance in a happy or beneficial way.",
      example: "Finding that old photo was a moment of pure serendipity.",
    },
    {
      word: "ubiquitous",
      vnMeaning: "phổ biến, ở đâu cũng có",
      enDefinition: "Present, appearing, or found everywhere.",
      example: "Smartphones have become ubiquitous in modern society.",
    },
    {
      word: "eloquent",
      vnMeaning: "hùng hồn, có tài hùng biện",
      enDefinition: "Fluent or persuasive in speaking or writing.",
      example:
        "The president gave an eloquent speech that moved the entire nation.",
    },
  ];

  let shuffledVocab = [];
  let currentQuestionIndex = 0;
  let currentWord = {};
  let selectedDefinitionButton = null;

  const tabs = document.querySelectorAll("[data-tab-target]");
  const tabContents = document.querySelectorAll("[id$='-content']");
  const actionContainer = document.getElementById("action-container");
  const originalActionHTML = actionContainer.innerHTML;
  const progressCounter = document.getElementById("progress-counter");

  function shuffleArray(array) {
    return [...array].sort(() => Math.random() - 0.5);
  }

  function showFeedback(isCorrect) {
    actionContainer.innerHTML = isCorrect
      ? `<p style="width: 100%; text-align: center; color: #16a34a; font-weight: 500;">✅ Correct!</p>`
      : `<p style="width: 100%; text-align: center; color: #dc2626; font-weight: 500;">❌ Incorrect! The answer is: <strong>${currentWord.word}</strong></p>`;
    setTimeout(loadNextQuestion, 2000);
  }

  function renderUI(wordData) {
    // Translation Tab
    document.querySelector(
      "#translation-content p > span"
    ).textContent = `"${wordData.vnMeaning}"`;
    document.querySelector("#translation-content input").value = "";

    // Definition Tab
    document.querySelector(
      "#definition-content p > span"
    ).textContent = `"${wordData.word}"`;
    const defOptionsContainer = document.querySelector(
      "#definition-content div"
    );
    const wrongDefs = VOCABULARY_LIST.filter(
      (w) => w.word !== wordData.word
    ).map((w) => w.enDefinition);
    const options = shuffleArray([
      wordData.enDefinition,
      ...shuffleArray(wrongDefs).slice(0, 3),
    ]);
    defOptionsContainer.innerHTML = options
      .map(
        (opt) =>
          `<button class="practice-option-btn" style="width: 100%; border: 1px solid #d1d5db; border-radius: 0.5rem; padding: 0.75rem; font-size: 0.9rem; text-align: left; background: white; cursor: pointer;">${opt}</button>`
      )
      .join("");
    defOptionsContainer.querySelectorAll("button").forEach((btn) => {
      btn.onclick = () => {
        selectedDefinitionButton = btn;
        defOptionsContainer.querySelectorAll("button").forEach((b) => {
          b.style.borderColor = "#d1d5db";
          b.style.backgroundColor = "white";
        });
        btn.style.borderColor = "#3b82f6";
        btn.style.backgroundColor = "#eff6ff";
      };
    });

    // Fill Blank Tab
    const hintIndex = Math.floor(wordData.word.length / 2);
    document.querySelector("#fill-blank-content p").innerHTML =
      wordData.example.replace(
        new RegExp(wordData.word, "i"),
        `<span style="font-weight: 600;">__________</span>`
      );
    const inputsContainer = document.getElementById("fill-blank-inputs");
    const optionsContainer = document.getElementById("fill-blank-options");
    inputsContainer.innerHTML = "";

    Array.from(wordData.word).forEach((char, i) => {
      const node =
        i === hintIndex
          ? `<span class="char-hint">${char}</span>`
          : `<input type="text" class="char-input" readonly />`;
      inputsContainer.insertAdjacentHTML("beforeend", node);
    });

    const letterBank = shuffleArray(
      wordData.word.split("").filter((_, i) => i !== hintIndex)
    );
    const letterButtons = new Map();
    optionsContainer.innerHTML = letterBank
      .map((l, i) => {
        const id = `${l}_${i}`;
        letterButtons.set(id, l);
        return `<button data-id="${id}" class="practice-option-btn" style="width: 2.5rem; height: 2.5rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 1rem; background: white; cursor: pointer;">${l}</button>`;
      })
      .join("");

    let activeInput = null;
    const allInputs = Array.from(inputsContainer.querySelectorAll("input"));

    const setActiveInput = (input) => {
      allInputs.forEach((i) => i.classList.remove("focused"));
      if (input) {
        input.classList.add("focused");
        activeInput = input;
      } else {
        activeInput = null;
      }
    };

    allInputs.forEach((input) => {
      input.addEventListener("click", () => {
        const currentDataId = input.dataset.id;
        if (currentDataId) {
          input.value = "";
          delete input.dataset.id;
          const btn = optionsContainer.querySelector(
            `button[data-id="${currentDataId}"]`
          );
          if (btn) btn.style.visibility = "visible";
        }
        setActiveInput(input);
      });
    });

    optionsContainer.querySelectorAll("button").forEach((btn) => {
      btn.onclick = () => {
        let targetInput = activeInput || allInputs.find((i) => !i.value);
        if (targetInput) {
          const currentDataId = targetInput.dataset.id;
          if (currentDataId) {
            const oldBtn = optionsContainer.querySelector(
              `button[data-id="${currentDataId}"]`
            );
            if (oldBtn) oldBtn.style.visibility = "visible";
          }
          targetInput.value = btn.textContent;
          targetInput.dataset.id = btn.dataset.id;
          btn.style.visibility = "hidden";

          const nextInputIndex = allInputs.indexOf(targetInput) + 1;
          const nextInput = allInputs[nextInputIndex];
          setActiveInput(nextInput);
        }
      };
    });
    setActiveInput(allInputs[0]);
  }

  function loadNextQuestion() {
    if (currentQuestionIndex >= shuffledVocab.length) {
      actionContainer.innerHTML = `<p style="width: 100%; text-align: center; color: #2563eb; font-weight: 500;">🎉 You've completed the practice!</p>`;
      return;
    }
    currentWord = shuffledVocab[currentQuestionIndex];
    selectedDefinitionButton = null;
    actionContainer.innerHTML = originalActionHTML;
    actionContainer.querySelector(".wwise-link-btn").onclick = startPractice;
    actionContainer.querySelector(".wwise-btn-primary").onclick = checkAnswer;
    progressCounter.textContent = `(${currentQuestionIndex + 1}/${
      shuffledVocab.length
    })`;
    renderUI(currentWord);
    currentQuestionIndex++;
  }

  function checkAnswer() {
    const activeTab = document.querySelector(
      "button[data-tab-target][style*='color: rgb(37, 99, 235)']"
    );
    let isCorrect = false;
    switch (activeTab.dataset.tabTarget) {
      case "translation":
        isCorrect =
          document
            .querySelector("#translation-content input")
            .value.trim()
            .toLowerCase() === currentWord.word.toLowerCase();
        break;
      case "definition":
        isCorrect =
          selectedDefinitionButton &&
          selectedDefinitionButton.textContent === currentWord.enDefinition;
        break;
      case "fill-blank":
        let userAnswer = "";
        document
          .getElementById("fill-blank-inputs")
          .childNodes.forEach((node) => {
            userAnswer += node.value || node.textContent;
          });
        isCorrect = userAnswer === currentWord.word;
        break;
    }
    showFeedback(isCorrect);
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabContents.forEach((c) => (c.style.display = "none"));
      tabs.forEach((t) => {
        t.style.color = "#9ca3af";
        t.style.borderColor = "transparent";
      });
      document.getElementById(
        tab.dataset.tabTarget + "-content"
      ).style.display = "block";
      tab.style.color = "#2563eb";
      tab.style.borderColor = "#2563eb";
    });
  });

  function startPractice() {
    shuffledVocab = shuffleArray(VOCABULARY_LIST);
    currentQuestionIndex = 0;
    loadNextQuestion();
  }

  startPractice();
});
