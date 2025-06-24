(async () => {
  const isHTTPS = window.location.protocol === "https:";
  const url = window.location.href;
  const domain = new URL(url).hostname;

  let phishing = false;
  let domainAge = "Unknown";
  let hasFavicon = !!document.querySelector('link[rel~="icon"]');
  let containsForm = !!document.querySelector('form');

  const knownPhishingSites = ["examplephish.com", "badsite.net"];
  if (knownPhishingSites.some(site => domain.includes(site))) phishing = true;

  const newDomains = ["examplephish.com"];
  if (newDomains.includes(domain)) domainAge = "New (less than 30 days)";
  else domainAge = "Trusted (older domain)";

  chrome.runtime.sendMessage({
    url,
    isHTTPS,
    phishing,
    domainAge,
    hasFavicon,
    containsForm
  });
})();
