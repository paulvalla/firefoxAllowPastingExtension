// Set initial state on install
browser.runtime.onInstalled.addListener(() => {
  browser.storage.local.set({ enabled: false });
  browser.action.setBadgeText({ text: "OFF" });
  browser.action.setBadgeBackgroundColor({ color: "#777777" });
});

// Handle the extension icon click
browser.action.onClicked.addListener(async (tab) => {
  // Only execute on allowed domains
  const allowedDomains = ["dcb.bank.in", "hdfc.bank.in"];
  const isAllowed = tab.url && allowedDomains.some(domain => tab.url.includes(domain));
  if (!isAllowed) {
    return;
  }

  const data = await browser.storage.local.get("enabled");
  const nextState = !data.enabled;
  await browser.storage.local.set({ enabled: nextState });

  if (nextState) {
    // Turn ON
    browser.action.setBadgeText({ text: "ON", tabId: tab.id });
    browser.action.setBadgeBackgroundColor({ color: "#00AA00", tabId: tab.id });
    browser.action.setTitle({ title: "Force Paste: ON", tabId: tab.id });
    browser.action.setIcon({ path: "icon-on.svg", tabId: tab.id });

    // Inject content script to lift restrictions
    browser.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"]
    });
  } else {
    // Turn OFF (Requires reload to restore native page behaviors completely)
    browser.action.setBadgeText({ text: "OFF", tabId: tab.id });
    browser.action.setBadgeBackgroundColor({ color: "#777777", tabId: tab.id });
    browser.action.setTitle({ title: "Force Paste: OFF", tabId: tab.id });
    browser.action.setIcon({ path: "icon-off.svg", tabId: tab.id });
  }
});
