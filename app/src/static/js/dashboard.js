/* DeployWatch dashboard — live status polling + uptime ticker */
(function () {
  "use strict";

  var pill = document.getElementById("live-pill");
  var liveText = document.getElementById("live-text");
  var statStatus = document.getElementById("stat-status");
  var uptimeEl = document.getElementById("stat-uptime");

  // Uptime counts up client-side between polls so the number never looks frozen.
  var uptimeSeconds = parseInt(uptimeEl ? uptimeEl.getAttribute("data-uptime") : "0", 10) || 0;

  function formatUptime(totalSeconds) {
    var d = Math.floor(totalSeconds / 86400);
    var h = Math.floor((totalSeconds % 86400) / 3600);
    var m = Math.floor((totalSeconds % 3600) / 60);
    var s = totalSeconds % 60;
    var parts = [];
    if (d > 0) parts.push(d + "d");
    if (h > 0 || d > 0) parts.push(h + "h");
    if (m > 0 || h > 0 || d > 0) parts.push(m + "m");
    parts.push(s + "s");
    return parts.join(" ");
  }

  function renderUptime() {
    if (uptimeEl) uptimeEl.textContent = formatUptime(uptimeSeconds);
  }

  function setState(state) {
    // state: "ok" | "down" | "checking"
    pill.classList.remove("ok", "down");
    if (state === "ok") {
      pill.classList.add("ok");
      liveText.textContent = "Live";
      if (statStatus) statStatus.textContent = "Running";
    } else if (state === "down") {
      pill.classList.add("down");
      liveText.textContent = "Unreachable";
      if (statStatus) statStatus.textContent = "Down";
    } else {
      liveText.textContent = "Checking…";
    }
  }

  function poll() {
    fetch("/api/status", { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("bad status");
        return res.json();
      })
      .then(function (data) {
        if (data && data.status === "running") {
          setState("ok");
          if (typeof data.uptime_seconds === "number") {
            uptimeSeconds = data.uptime_seconds;
            renderUptime();
          }
        } else {
          setState("down");
        }
      })
      .catch(function () {
        setState("down");
      });
  }

  renderUptime();
  setState("checking");
  poll();
  setInterval(poll, 5000);          // refresh health every 5s
  setInterval(function () {         // tick the uptime display every 1s
    uptimeSeconds += 1;
    renderUptime();
  }, 1000);
})();
