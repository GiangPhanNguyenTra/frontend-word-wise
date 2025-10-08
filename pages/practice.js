document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll("[data-tab-target]");
  const tabContents = document.querySelectorAll("[id$='-content']");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetId = tab.dataset.tabTarget;
      const targetContent = document.getElementById(targetId + "-content");

      tabContents.forEach((content) => {
        content.style.display = "none";
      });

      tabs.forEach((t) => {
        t.style.color = "#9ca3af";
        t.style.borderColor = "transparent";
      });

      if (targetContent) {
        targetContent.style.display = "block";
      }
      tab.style.color = "#2563eb";
      tab.style.borderColor = "#2563eb";
    });
  });

  const definitionOptions = document.querySelectorAll(
    "#definition-content .practice-option-btn"
  );
  definitionOptions.forEach((clickedOption) => {
    clickedOption.addEventListener("click", () => {
      // Bỏ chọn tất cả các đáp án khác bằng cách reset style
      definitionOptions.forEach((option) => {
        option.style.borderColor = "#d1d5db";
        option.style.backgroundColor = "white";
      });
      // Đánh dấu đáp án được chọn bằng cách thay đổi style
      clickedOption.style.borderColor = "#3b82f6"; // Màu viền xanh
      clickedOption.style.backgroundColor = "#eff6ff"; // Màu nền xanh nhạt
    });
  });

  const fillBlankAnswerArea = document.querySelector(
    "#fill-blank-content div[style*='border-bottom']"
  );
  const fillBlankOptions = document.querySelectorAll(
    "#fill-blank-content .practice-option-btn"
  );

  fillBlankAnswerArea.style.textAlign = "center";
  fillBlankAnswerArea.style.fontSize = "1.5rem";
  fillBlankAnswerArea.style.fontWeight = "500";
  fillBlankAnswerArea.style.letterSpacing = "0.25rem";
  fillBlankAnswerArea.style.paddingBottom = "0.5rem";
  fillBlankAnswerArea.style.color = "#1f2937";

  fillBlankOptions.forEach((option) => {
    option.addEventListener("click", () => {
      fillBlankAnswerArea.textContent += option.textContent;
      option.style.display = "none";
    });
  });

  document.querySelector("button.wwise-btn-primary").onclick = () =>
    alert("Answer checked (mock)");
});
