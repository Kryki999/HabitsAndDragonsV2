/* Look-dev only. Tap a vertex icon → center pill with name + value. */
(function () {
  document.querySelectorAll(".stat-hex").forEach(function (hex) {
    var tip = hex.querySelector(".stat-tip");
    if (!tip) return;
    var tipImg = tip.querySelector("img");
    var tipName = tip.querySelector(".nm");
    var tipVal = tip.querySelector("b");
    hex.querySelectorAll(".stat").forEach(function (btn) {
      var name = btn.getAttribute("data-name") || "";
      var value = btn.getAttribute("data-value") || "";
      btn.setAttribute("aria-label", name + " " + value);
      btn.addEventListener("click", function () {
        var on = btn.classList.contains("is-on");
        hex.querySelectorAll(".stat").forEach(function (b) {
          b.classList.remove("is-on");
        });
        if (on) {
          hex.classList.remove("is-open");
          return;
        }
        btn.classList.add("is-on");
        hex.classList.add("is-open");
        if (tipName) tipName.textContent = btn.getAttribute("data-name") || "";
        if (tipVal) tipVal.textContent = btn.getAttribute("data-value") || "";
        var src = btn.querySelector("img");
        if (tipImg && src) tipImg.src = src.getAttribute("src") || "";
      });
    });
  });
})();
