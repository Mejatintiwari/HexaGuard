document.getElementById("reportBtn").addEventListener("click", () => {
  alert("Report submitted. Thank you!");
});

chrome.runtime.onMessage.addListener((msg) => {
  document.getElementById("status").innerText = `URL: ${msg.url}`;
  document.getElementById("ssl").innerText = msg.isHTTPS ? "✅ Secure (HTTPS)" : "❌ Not Secure (No SSL)";
  document.getElementById("phish").innerText = msg.phishing ? "⚠️ Possible Threat Detected" : "✅ No Threats Found";
  document.getElementById("age").innerText = msg.domainAge;
  document.getElementById("favicon").innerText = msg.hasFavicon ? "✅ Present" : "⚠️ Missing";
  document.getElementById("forms").innerText = msg.containsForm ? "📩 Forms Found" : "✔️ No Forms Detected";
});
