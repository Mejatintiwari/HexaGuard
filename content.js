(async () => {
  const isHTTPS = window.location.protocol === "https:";
  const url = window.location.href;
  const domain = new URL(url).hostname;
  let phishing = false;
  let domainAge = "Loading...";
  let hasFavicon = !!document.querySelector('link[rel~="icon"]');
  let containsForm = !!document.querySelector('form');

  // --- Google Safe Browsing API ---
  try {
    const safeRes = await fetch("https://safebrowsing.googleapis.com/v4/threatMatches:find?key=API KEY", {
      method: "POST",
      body: JSON.stringify({
        client: {
          clientId: "HexaGuard-ext",
          clientVersion: "1.3"
        },
        threatInfo: {
          threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
          platformTypes: ["ANY_PLATFORM"],
          threatEntryTypes: ["URL"],
          threatEntries: [{ url }]
        }
      }),
      headers: { "Content-Type": "application/json" }
    });
    const safeData = await safeRes.json();
    if (safeData && safeData.matches && safeData.matches.length > 0) {
      phishing = true;
    }
  } catch (err) {
    console.warn("Safe Browsing API error:", err);
  }

  // --- WHOIS XML API ---
  try {
    const whoisRes = await fetch(`https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=API KEY &domainName=${domain}&outputFormat=JSON`);
    const whoisData = await whoisRes.json();
    const createdDate = whoisData.WhoisRecord?.createdDate;
    if (createdDate) {
      const ageInDays = (Date.now() - new Date(createdDate).getTime()) / (1000 * 60 * 60 * 24);
      domainAge = ageInDays < 30 ? "New (less than 30 days)" : `Trusted (age: ${Math.floor(ageInDays)} days)`;
    }
  } catch (err) {
    console.warn("WHOIS API error:", err);
    domainAge = "Error fetching domain age";
  }

  chrome.runtime.sendMessage({
    url,
    isHTTPS,
    phishing,
    domainAge,
    hasFavicon,
    containsForm
  });
})();
