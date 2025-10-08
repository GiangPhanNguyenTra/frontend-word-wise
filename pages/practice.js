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

      targetContent.style.display = "block";
      tab.style.color = "#2563eb";
      tab.style.borderColor = "#2563eb";
    });
  });

  document.querySelector("button.wwise-btn-primary").onclick = () =>
    alert("Answer checked (mock)");
});
